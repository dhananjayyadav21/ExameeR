import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import User from '@/models/User';
import { sendVerificationEamil } from '@/lib/services/sendEmails';

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

        if (user.isVerified) {
            return NextResponse.json({ success: false, message: "Email is already verified" }, { status: 400 });
        }

        const newVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.VerificationCode = newVerificationCode;
        await user.save();

        await sendVerificationEamil(user.Email, newVerificationCode);

        return NextResponse.json({
            success: true,
            message: "New verification code sent to your email."
        }, { status: 200 });

    } catch (error) {
        console.error("Resend OTP Error:", error);
        return NextResponse.json({ success: false, message: "Failed to resend verification code" }, { status: 500 });
    }
}
