import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import PYQ from '@/models/PYQ';
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

        const pyq = await PYQ.findById(id);
        if (!pyq) {
            return NextResponse.json({ success: false, message: "PYQ not found" }, { status: 404 });
        }

        const user = await User.findById(userData._id);
        if (user.Role !== 'Admin' && pyq.uploadedBy.toString() !== userData._id) {
            return NextResponse.json({ success: false, message: "Access denied" }, { status: 401 });
        }

        const updatedPYQ = await PYQ.findByIdAndUpdate(id, data, { new: true });
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
