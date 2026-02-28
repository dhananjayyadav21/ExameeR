import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import User from '@/models/User';
import { oauth2Client } from '@/lib/googleConfig';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '@/lib/services/sendEmails';

async function getImageAsBase64(url) {
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = response.headers.get('content-type');
        const base64 = buffer.toString('base64');
        return `data:${mimeType};base64,${base64}`;
    } catch (err) {
        console.error('Failed to fetch image:', err.message);
        return url;
    }
}

export async function GET(req) {
    try {
        await connectToMongo();
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');

        if (!code) {
            return NextResponse.json({ success: false, message: "Code is required" }, { status: 400 });
        }

        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const userDataRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
        );

        const { email, name, picture } = userDataRes.data;

        let user = await User.findOne({ Email: email.toLowerCase() });

        if (!user) {
            function userIdBasedOnEmail(userEmail) {
                const hash = [...userEmail].reduce((acc, char) => acc + char.charCodeAt(0), 0);
                return hash + Math.floor(Math.random() * 10000);
            }
            const ExmeeUserId = "Exa" + userIdBasedOnEmail(email);

            user = new User({
                Username: name,
                Email: email.toLowerCase(),
                Profile: picture,
                isVerified: true,
                ExmeeUserId,
                Role: 'Student'
            });
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
        user.Profile = await getImageAsBase64(picture);
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Successfully authenticated with Google',
            token,
            user: {
                Email: user.Email,
                Role: user.Role,
                ExmeeUserId: user.ExmeeUserId,
                Profile: user.Profile
            }
        }, { status: 200 });

    } catch (error) {
        console.error("Google Auth Error:", error);
        return NextResponse.json({ success: false, message: 'Google authentication failed' }, { status: 500 });
    }
}
