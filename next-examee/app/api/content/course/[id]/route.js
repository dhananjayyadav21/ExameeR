import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Course from '@/models/Course';
import User from '@/models/User';
import { verifyUser } from '@/lib/middleware/fetchUser';

export async function GET(req, { params }) {
    try {
        await connectToMongo();
        const { id } = await params;
        const course = await Course.findById(id);
        if (!course) {
            return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: course }, { status: 200 });
    } catch (error) {
        console.error('Fetch Course Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const data = await req.json();

        const courseDoc = await Course.findById(id);
        if (!courseDoc) {
            return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
        }

        const user = await User.findById(userData._id);
        if (user.Role !== 'Admin' && courseDoc.uploadedBy.toString() !== userData._id) {
            return NextResponse.json({ success: false, message: "Access denied" }, { status: 401 });
        }

        const updateObject = {
            title: data.title,
            description: data.description,
            mentor: data.mentor,
            courseLevel: data.courseLevel,
            duration: data.duration,
            price: data.price,
            offerPercent: data.offerPercent,
            offerPrice: data.offerPrice,
            startDate: data.startDate,
            courseContents: data.courseContents,
            whyChoose: data.whyChoose,
            benefits: data.benefits,
            courseImage: data.courseImage,
            trialVideo: data.trialVideo,
            lectures: data.lectures,
            category: data.category,
            isPublic: data.isPublic !== undefined ? data.isPublic : true,
            status: data.status || 'public',
            course: data.course || '',
            semester: data.semester || '',
            university: data.university || ''
        };

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { $set: updateObject },
            { new: true, runValidators: true }
        );

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
