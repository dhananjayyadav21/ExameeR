import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import User from '@/models/User';
import MyLearningContent from '@/models/MyLearningContent';
import bcrypt from 'bcrypt';
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

        const requester = await User.findById(userData._id);
        if (!requester || (requester.Role !== 'Admin' && requester.Role !== 'Instructor')) {
            return NextResponse.json({ success: false, message: 'Access denied' }, { status: 403 });
        }

        const student = await User.findById(id);
        if (!student) {
            return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
        }

        if (data.Username) student.Username = data.Username;
        if (data.Email) student.Email = data.Email;
        if (data.FirstName !== undefined) student.FirstName = data.FirstName;
        if (data.LastName !== undefined) student.LastName = data.LastName;
        if (data.Password) {
            const salt = await bcrypt.genSalt(10);
            student.Password = await bcrypt.hash(data.Password, salt);
        }
        if (data.Status) student.Status = data.Status;
        if (data.isVerified !== undefined) student.isVerified = data.isVerified;

        await student.save();
        return NextResponse.json({ success: true, message: 'Student updated successfully' }, { status: 200 });

    } catch (error) {
        console.error('Update student error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const requester = await User.findById(userData._id);
        if (!requester || (requester.Role !== 'Admin' && requester.Role !== 'Instructor')) {
            return NextResponse.json({ success: false, message: 'Access denied' }, { status: 403 });
        }

        const student = await User.findById(id);
        if (!student) {
            return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
        }

        student.Status = student.Status === 'active' ? 'inactive' : 'active';
        await student.save();

        return NextResponse.json({ success: true, message: `Status changed to ${student.Status}`, user: student }, { status: 200 });

    } catch (error) {
        console.error('Patch student error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
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
        const requester = await User.findById(userData._id);
        if (!requester || (requester.Role !== 'Admin' && requester.Role !== 'Instructor')) {
            return NextResponse.json({ success: false, message: 'Access denied' }, { status: 403 });
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        await MyLearningContent.deleteMany({ userId: id });

        return NextResponse.json({ success: true, message: 'Student deleted successfully' }, { status: 200 });

    } catch (error) {
        console.error('Delete student error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
