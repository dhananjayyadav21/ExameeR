import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import User from '@/models/User';
import { verifyUser } from '@/lib/middleware/fetchUser';
import bcrypt from 'bcrypt';

export async function POST(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();

        const user = await User.findById(userData._id);
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found!' }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(currentPassword.toString(), user.Password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: 'Incorrect current password' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(newPassword.toString(), salt);

        user.Password = securePassword;
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Password updated successfully'
        }, { status: 200 });

    } catch (error) {
        console.error("UpdatePassword Error:", error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
