import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function POST(req) {
    try {
        await connectToMongo();
        const { Email, ForgotPasswordCode, NewPassword, ConfirmNewPassword } = await req.json();

        if (!Email || !ForgotPasswordCode || !NewPassword || !ConfirmNewPassword) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        if (NewPassword !== ConfirmNewPassword) {
            return NextResponse.json({ success: false, message: "Passwords do not match" }, { status: 400 });
        }

        if (NewPassword.length < 6) {
            return NextResponse.json({ success: false, message: "Password must be at least 6 characters long" }, { status: 400 });
        }

        const user = await User.findOne({ Email: Email.toLowerCase() });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        if (user.ForgotPasswordCode !== ForgotPasswordCode) {
            return NextResponse.json({ success: false, message: "Invalid or expired verification code" }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(NewPassword, salt);

        user.Password = hashedNewPassword;
        user.ForgotPasswordCode = undefined;
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Password reset successfully. You can now log in with your new password."
        }, { status: 200 });

    } catch (error) {
        console.error("Reset Password Error:", error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
