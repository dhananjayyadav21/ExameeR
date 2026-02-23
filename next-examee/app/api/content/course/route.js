import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Course from '@/models/Course';
import User from '@/models/User';
import CourseEnroll from '@/models/CourseEnroll';
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

        const courses = await Course.find(criteria).sort(sortOption);

        let response = {
            success: true,
            message: "Fetch All Public Courses",
            count: courses.length,
            data: courses,
        };

        if (user.Role === "Instructor" || user.Role === "Admin") {
            const myCourse = await Course.find({ ExmeeUserId: user.ExmeeUserId, category: category }).select("-uploadedBy");
            response.myCourse = myCourse;
            response.myCourseCount = myCourse.length;
        }

        if (user.Role === "Admin") {
            const allCourse = await Course.find({ category: category }).sort(sortOption);
            response.allCourse = allCourse;
            response.allCourseCount = allCourse.length;
        }

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error('Error fetching public courses:', error);
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

        const data = await req.json();

        if (!data.title || !data.mentor || !data.price || !data.courseImage || !data.trialVideo) {
            return NextResponse.json({ success: false, message: "Required fields missing" }, { status: 400 });
        }

        const newCourse = new Course({
            ...data,
            uploadedBy: userData._id,
        });

        await newCourse.save();
        return NextResponse.json({ success: true, message: 'Course uploaded successfully!', data: newCourse }, { status: 201 });

    } catch (error) {
        console.error('Upload Course Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
