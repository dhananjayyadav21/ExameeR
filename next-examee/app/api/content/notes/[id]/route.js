import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Note from '@/models/Note';
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

        const note = await Note.findById(id);
        if (!note) {
            return NextResponse.json({ success: false, message: "Note not found" }, { status: 404 });
        }

        const user = await User.findById(userData._id);
        if (user.Role !== 'Admin' && note.uploadedBy.toString() !== userData._id) {
            return NextResponse.json({ success: false, message: "Access denied" }, { status: 401 });
        }

        const updatedNote = await Note.findByIdAndUpdate(id, data, { new: true });
        return NextResponse.json({ success: true, message: "Note updated", data: updatedNote }, { status: 200 });

    } catch (error) {
        console.error('Update Note Error:', error);
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
        const note = await Note.findById(id);
        if (!note) {
            return NextResponse.json({ success: false, message: "Note not found" }, { status: 404 });
        }

        const user = await User.findById(userData._id);
        if (user.Role !== 'Admin' && note.uploadedBy.toString() !== userData._id) {
            return NextResponse.json({ success: false, message: "Access denied" }, { status: 401 });
        }

        await Note.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Note deleted" }, { status: 200 });

    } catch (error) {
        console.error('Delete Note Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
