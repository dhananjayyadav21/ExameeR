import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import PYQ from '@/models/PYQ';
import User from '@/models/User';
import { verifyUser } from '@/lib/middleware/fetchUser';

export async function GET(req, { params }) {
    try {
        await connectToMongo();
        const { id } = await params;
        const pyq = await PYQ.findById(id);
        if (!pyq) {
            return NextResponse.json({ success: false, message: "PYQ not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: pyq }, { status: 200 });
    } catch (error) {
        console.error('Fetch PYQ Error:', error);
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

        const pyq = await PYQ.findById(id);
        if (!pyq) {
            return NextResponse.json({ success: false, message: "PYQ not found" }, { status: 404 });
        }

        const user = await User.findById(userData._id);
        if (user.Role !== 'Admin' && pyq.uploadedBy.toString() !== userData._id) {
            return NextResponse.json({ success: false, message: "Access denied" }, { status: 401 });
        }

        const updateObject = {
            title: data.title,
            year: data.year,
            subject: data.subject,
            category: data.category,
            course: data.course || '',
            semester: data.semester || '',
            university: data.university || '',
            isPublic: data.isPublic !== undefined ? data.isPublic : true,
            status: data.status || 'public',
            accessTier: data.accessTier || 'free',
            fileUrl: data.fileUrl
        };

        if (data.tags) {
            updateObject.tags = Array.isArray(data.tags) ? data.tags : data.tags.split(',').map(tag => tag.trim());
        }

        const updatedPYQ = await PYQ.findByIdAndUpdate(
            id,
            { $set: updateObject },
            { new: true, runValidators: true }
        );

        console.log("Updated PYQ Result:", updatedPYQ);

        if (!updatedPYQ) {
            return NextResponse.json({ success: false, message: "Failed to update PYQ" }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "PYQ updated", data: updatedPYQ }, { status: 200 });

    } catch (error) {
        console.error('Update PYQ Error:', error);
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
        const pyq = await PYQ.findById(id);
        if (!pyq) {
            return NextResponse.json({ success: false, message: "PYQ not found" }, { status: 404 });
        }

        const user = await User.findById(userData._id);
        if (user.Role !== 'Admin' && pyq.uploadedBy.toString() !== userData._id) {
            return NextResponse.json({ success: false, message: "Access denied" }, { status: 401 });
        }

        await PYQ.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "PYQ deleted" }, { status: 200 });

    } catch (error) {
        console.error('Delete PYQ Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
