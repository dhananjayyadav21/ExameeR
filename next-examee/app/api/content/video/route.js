import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Video from '@/models/Video';
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
        const course = searchParams.get('course');
        const semester = searchParams.get('semester');
        const university = searchParams.get('university');

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

        if (course && course !== "For All") {
            criteria.course = { $in: [course, "For All"] };
        }
        if (semester && semester !== "For All") {
            if (semester === "1st Year") {
                criteria.semester = { $in: ["1st Sem", "2nd Sem", "1st Year", "For All"] };
            } else if (semester === "2nd Year") {
                criteria.semester = { $in: ["3rd Sem", "4th Sem", "2nd Year", "For All"] };
            } else if (semester === "3rd Year") {
                criteria.semester = { $in: ["5th Sem", "6th Sem", "3rd Year", "For All"] };
            } else if (semester === "4th Year" || semester === "Final Year") {
                criteria.semester = { $in: ["7th Sem", "8th Sem", "4th Year", "Final Year", "For All"] };
            } else {
                criteria.semester = { $in: [semester, "For All"] };
            }
        }
        if (university && university !== "For All") {
            criteria.university = { $in: [university, "For All"] };
        }

        const videos = await Video.aggregate([
            { $match: criteria },
            {
                $addFields: {
                    videoIdString: { $toString: '$_id' }
                }
            },
            {
                $lookup: {
                    from: 'mylearningcontents',
                    let: { videoIdStr: '$videoIdString' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$contentId', '$$videoIdStr'] },
                                        { $eq: ['$contentType', 'Video'] },
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
                    videoIdString: 0
                }
            },
            { $sort: sortOption }
        ]);

        let response = {
            success: true,
            message: "Fetch All Public Videos",
            count: videos.length,
            data: videos,
        };

        if (user.Role === "Instructor" || user.Role === "Admin") {
            const myVideos = await Video.find({ ExmeeUserId: user.ExmeeUserId, category: category }).select("-uploadedBy -deletedOn");
            response.myVideo = myVideos;
            response.myVideoCount = myVideos.length;
        }

        if (user.Role === "Admin") {
            const allVideo = await Video.find({ category: category }).sort(sortOption);
            response.allVideo = allVideo;
            response.allVideoCount = allVideo.length;
        }

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error('Error fetching public videos:', error);
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

        const { title, description, category, course, semester, university, tags, isPublic, status, fileUrl } = await req.json();

        if (!title || !category || !status || !fileUrl) {
            return NextResponse.json({ success: false, message: "Required fields missing" }, { status: 400 });
        }

        const newVideo = new Video({
            title,
            description,
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

        await newVideo.save();
        return NextResponse.json({ success: true, message: 'Video uploaded successfully', data: newVideo }, { status: 201 });

    } catch (error) {
        console.error('Upload Video Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
