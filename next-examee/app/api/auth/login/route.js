import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '@/lib/services/sendEmails';

export async function POST(req) {
    try {
        await connectToMongo();
        const { Email, Password } = await req.json();

        if (!Email || !Password) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        let user = await User.findOne({ Email: Email.toLowerCase() });
        if (!user) {
            return NextResponse.json({ success: false, message: "Invalid credentials." }, { status: 400 });
        }

        const isEqualPass = await bcrypt.compare(Password, user.Password);
        if (!isEqualPass) {
            return NextResponse.json({ success: false, message: "Invalid credentials." }, { status: 400 });
        }

        if (!user.isVerified) {
            return NextResponse.json({ success: false, message: "Email not verified!" }, { status: 400 });
        }

        const token = jwt.sign(
            { _id: user._id, Email: user.Email },
            process.env.AUTHTOKEN_SECRATE,
            { expiresIn: process.env.JWT_TIMEOUT || '7d' }
        );

        if (!user.lastActive) {
            await sendWelcomeEmail(user.Email, user.Username);
        }

        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.ip || null;
        user.lastActive = new Date();
        user.IPAddress = ip;
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Successfully logged in',
            token,
            user: {
                Email: user.Email,
                Role: user.Role,
                ExmeeUserId: user.ExmeeUserId
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
