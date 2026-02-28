import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
    try {
        await connectToMongo();
        const { Email, VerificationCode } = await req.json();

        if (!Email || !VerificationCode) {
            return NextResponse.json({ success: false, message: "Email and Verification Code are required" }, { status: 400 });
        }

        const user = await User.findOne({ Email: Email.toLowerCase() });
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ success: false, message: "Email is already verified" }, { status: 400 });
        }

        if (user.VerificationCode !== VerificationCode) {
            return NextResponse.json({ success: false, message: "Invalid Verification Code" }, { status: 400 });
        }

        user.isVerified = true;
        user.VerificationCode = undefined;
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Email successfully verified. You can now log in."
        }, { status: 200 });

    } catch (error) {
        console.error("Verify Email Error:", error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
