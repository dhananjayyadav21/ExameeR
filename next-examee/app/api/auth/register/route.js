import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import { sendVerificationEamil } from '@/lib/services/sendEmails';

export async function POST(req) {
    try {
        await connectToMongo();
        const { Username, Email, Password, ConfirmPassword } = await req.json();

        if (!Username || !Email || !Password || !ConfirmPassword) {
            return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
        }

        if (Username.toLowerCase() === "admin") {
            return NextResponse.json({ success: false, message: "You cannot create an account with the username 'admin'!" }, { status: 400 });
        }

        if (Password !== ConfirmPassword) {
            return NextResponse.json({ success: false, message: "Password & Confirm Password do not match" }, { status: 400 });
        }

        let user = await User.findOne({ Email: Email.toLowerCase() });
        if (user) {
            return NextResponse.json({ success: false, message: "User already exists. Please try to login." }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(Password.toString(), salt);
        const VerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        function userIdBasedOnEmail(userEmail) {
            const hash = [...userEmail].reduce((acc, char) => acc + char.charCodeAt(0), 0);
            return hash + Math.floor(Math.random() * 10000);
        }
        const ExmeeUserIdBasedOnEmail = userIdBasedOnEmail(Email);
        const ExmeeUserId = "Exa" + ExmeeUserIdBasedOnEmail;

        user = new User({
            Username,
            Email: Email.toLowerCase(),
            Password: securePassword,
            VerificationCode,
            ExmeeUserId: ExmeeUserId,
        });

        await sendVerificationEamil(user.Email, user.VerificationCode);
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Successfully registered. Please verify your email.',
            user: { Email: user.Email }
        }, { status: 200 });

    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
