import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Course from '@/models/Course';
import User from '@/models/User';
import { verifyUser } from '@/lib/middleware/fetchUser';

export async function PUT(req, { params }) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const data = await req.json();

        const course = await Course.findById(id);
        if (!course) {
            return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
        }

        const user = await User.findById(userData._id);
        if (user.Role !== 'Admin' && course.uploadedBy.toString() !== userData._id) {
            return NextResponse.json({ success: false, message: "Access denied" }, { status: 401 });
        }

        const updatedCourse = await Course.findByIdAndUpdate(id, data, { new: true });
        return NextResponse.json({ success: true, message: "Course updated", data: updatedCourse }, { status: 200 });

    } catch (error) {
        console.error('Update Course Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const course = await Course.findById(id);
        if (!course) {
            return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
        }

        const user = await User.findById(userData._id);
        if (user.Role !== 'Admin' && course.uploadedBy.toString() !== userData._id) {
            return NextResponse.json({ success: false, message: "Access denied" }, { status: 401 });
        }

        await Course.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Course deleted" }, { status: 200 });

    } catch (error) {
        console.error('Delete Course Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
