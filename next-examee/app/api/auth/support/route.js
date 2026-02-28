import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import User from '@/models/User';
import Support from '@/models/Support';
import { verifyUser } from '@/lib/middleware/fetchUser';
import { sendSupportEmail } from '@/lib/services/sendEmails';

export async function POST(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { name, email, subject, body } = await req.json();
        if (!name || !email || !subject || !body) {
            return NextResponse.json({ success: false, message: "Please fill the complete form!" }, { status: 400 });
        }

        const userSupport = new Support({
            name,
            email: email.toLowerCase(),
            subject,
            body,
            user: userData._id
        });

        await sendSupportEmail(name, email, subject, body);
        await userSupport.save();

        return NextResponse.json({
            success: true,
            message: 'Successfully sent support message.',
            userSupport
        }, { status: 200 });

    } catch (error) {
        console.error("Support API Error:", error);
        return NextResponse.json({ success: false, message: "Failed to send support message" }, { status: 500 });
    }
}
