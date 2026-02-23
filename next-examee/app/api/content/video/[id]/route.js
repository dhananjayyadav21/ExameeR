import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Video from '@/models/Video';
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

        const video = await Video.findById(id);
        if (!video) {
            return NextResponse.json({ success: false, message: "Video not found" }, { status: 404 });
        }

        const user = await User.findById(userData._id);
        if (user.Role !== 'Admin' && video.uploadedBy.toString() !== userData._id) {
            return NextResponse.json({ success: false, message: "Access denied" }, { status: 401 });
        }

        const updatedVideo = await Video.findByIdAndUpdate(id, data, { new: true });
        return NextResponse.json({ success: true, message: "Video updated", data: updatedVideo }, { status: 200 });

    } catch (error) {
        console.error('Update Video Error:', error);
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
        const video = await Video.findById(id);
        if (!video) {
            return NextResponse.json({ success: false, message: "Video not found" }, { status: 404 });
        }

        const user = await User.findById(userData._id);
        if (user.Role !== 'Admin' && video.uploadedBy.toString() !== userData._id) {
            return NextResponse.json({ success: false, message: "Access denied" }, { status: 401 });
        }

        await Video.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Video deleted" }, { status: 200 });

    } catch (error) {
        console.error('Delete Video Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
