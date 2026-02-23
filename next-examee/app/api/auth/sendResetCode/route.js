import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import User from '@/models/User';
import { sendForgotPasswordEmail } from '@/lib/services/sendEmails';

export async function POST(req) {
    try {
        await connectToMongo();
        const { Email } = await req.json();

        if (!Email) {
            return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
        }

        const user = await User.findOne({ Email: Email.toLowerCase() });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const ForgotPasswordCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.ForgotPasswordCode = ForgotPasswordCode;
        await user.save();

        await sendForgotPasswordEmail(Email, ForgotPasswordCode);

        return NextResponse.json({
            success: true,
            message: "Verification code sent to your email."
        }, { status: 200 });

    } catch (error) {
        console.error("Send Reset Code Error:", error);
        return NextResponse.json({ success: false, message: "Failed to send verification code" }, { status: 500 });
    }
}
