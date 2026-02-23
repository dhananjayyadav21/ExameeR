import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Note from '@/models/Note';
import User from '@/models/User';
import MyLearningContent from '@/models/MyLearningContent';
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

        const notes = await Note.aggregate([
            { $match: criteria },
            {
                $addFields: {
                    noteIdString: { $toString: '$_id' }
                }
            },
            {
                $lookup: {
                    from: 'mylearningcontents',
                    let: { noteIdStr: '$noteIdString' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$contentId', '$$noteIdStr'] },
                                        { $eq: ['$contentType', 'Note'] },
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
                    noteIdString: 0
                }
            },
            { $sort: sortOption }
        ]);

        let response = {
            success: true,
            message: "Fetch All Public Notes",
            count: notes.length,
            data: notes,
        };

        if (user.Role === "Instructor" || user.Role === "Admin") {
            const myNotes = await Note.find({ ExmeeUserId: user.ExmeeUserId, category: category }).select("-uploadedBy -deletedOn");
            response.myNotes = myNotes;
            response.myNotesCount = myNotes.length;
        }

        if (user.Role === "Admin") {
            const allNotes = await Note.find({ category: category }).sort(sortOption);
            response.allNotes = allNotes;
            response.allNotesCount = allNotes.length;
        }

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error('Error fetching public notes:', error);
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

        const { title, description, professor, category, tags, isPublic, status, fileUrl } = await req.json();

        if (!title || !professor || !category || !status || !fileUrl) {
            return NextResponse.json({ success: false, message: "Required fields missing" }, { status: 400 });
        }

        const newNote = new Note({
            title,
            description,
            professor,
            category,
            tags: Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()),
            isPublic: isPublic === false ? false : true,
            status: status || 'public',
            fileUrl,
            uploadedBy: userData._id,
            ExmeeUserId: user.ExmeeUserId,
        });

        await newNote.save();
        return NextResponse.json({ success: true, message: 'Note uploaded successfully', data: newNote }, { status: 201 });

    } catch (error) {
        console.error('Upload Note Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
