import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import PYQ from '@/models/PYQ';
import User from '@/models/User';
import mongoose from 'mongoose';
import { verifyUser } from '@/lib/middleware/fetchUser';

export async function GET(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category') || "sciTechnology";
        const sortBy = searchParams.get('sortBy') || "latest";

        let sortOption = sortBy === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

        const user = await User.findById(userData._id).select('Role ExmeeUserId');
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found!' }, { status: 404 });
        }

        let criteria = {
            isPublic: true,
            status: 'public',
            category: category
        };

        const pyqs = await PYQ.aggregate([
            { $match: criteria },
            {
                $addFields: {
                    pyqIdString: { $toString: '$_id' }
                }
            },
            {
                $lookup: {
                    from: 'mylearningcontents',
                    let: { pyqIdStr: '$pyqIdString' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$contentId', '$$pyqIdStr'] },
                                        { $eq: ['$contentType', 'PYQ'] },
                                        { $eq: ['$userId', new mongoose.Types.ObjectId(userData._id)] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'learningMatch'
                }
            },
            {
                $addFields: {
                    isWatching: { $gt: [{ $size: '$learningMatch' }, 0] }
                }
            },
            {
                $project: {
                    uploadedBy: 0,
                    deletedOn: 0,
                    learningMatch: 0,
                    pyqIdString: 0
                }
            },
            { $sort: sortOption }
        ]);

        let response = {
            success: true,
            message: "Fetch All Public PYQs",
            count: pyqs.length,
            data: pyqs,
        };

        if (user.Role === "Instructor" || user.Role === "Admin") {
            const myPYQs = await PYQ.find({ ExmeeUserId: user.ExmeeUserId, category: category }).select("-uploadedBy -deletedOn");
            response.myPYQ = myPYQs;
            response.myPYQCount = myPYQs.length;
        }

        if (user.Role === "Admin") {
            const allPYQ = await PYQ.find({ category: category }).sort(sortOption);
            response.allPYQ = allPYQ;
            response.allPYQCount = allPYQ.length;
        }

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error('Error fetching public PYQs:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(userData._id);
        if (user.Role !== "Admin" && user.Role !== "Instructor") {
            return NextResponse.json({ success: false, message: "Access denied" }, { status: 401 });
        }

        const { title, year, subject, category, course, semester, university, tags, isPublic, status, fileUrl } = await req.json();

        if (!title || !year || !subject || !category || !status || !fileUrl) {
            return NextResponse.json({ success: false, message: "Required fields missing" }, { status: 400 });
        }

        const newPYQ = new PYQ({
            title,
            year,
            subject,
            category,
            course,
            semester,
            university,
            tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()),
            isPublic: isPublic === false ? false : true,
            status: status || 'public',
            fileUrl,
            uploadedBy: userData._id,
            ExmeeUserId: user.ExmeeUserId,
        });

        await newPYQ.save();
        return NextResponse.json({ success: true, message: 'PYQ uploaded successfully', data: newPYQ }, { status: 201 });

    } catch (error) {
        console.error('Upload PYQ Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
