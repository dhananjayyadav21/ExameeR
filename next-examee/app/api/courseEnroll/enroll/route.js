import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import CourseEnroll from '@/models/CourseEnroll';
import Course from '@/models/Course';
import User from '@/models/User';
import { verifyUser } from '@/lib/middleware/fetchUser';

export async function POST(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { name, email, mobile, college, courseId } = await req.json();

        const existingEnrollment = await CourseEnroll.findOne({ userId: userData._id, courseId });
        if (existingEnrollment) {
            return NextResponse.json({ success: false, message: 'Already enrolled in this course.' }, { status: 400 });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return NextResponse.json({ success: false, message: 'Course not found!' }, { status: 404 });
        }

        if (course.offerPrice === 0) {
            const enrollment = new CourseEnroll({
                userId: userData._id,
                name,
                email,
                mobile,
                college,
                courseId
            });

            await enrollment.save();

            return NextResponse.json({
                success: true,
                message: 'Enrolled successfully',
                data: enrollment,
                courseData: course
            }, { status: 201 });
        } else {
            return NextResponse.json({ success: false, message: 'This course requires payment.' }, { status: 403 });
        }

    } catch (error) {
        console.error('Enrollment error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
