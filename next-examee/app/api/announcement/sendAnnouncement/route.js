import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import User from '@/models/User';
import { verifyUser } from '@/lib/middleware/fetchUser';
import { announceMentEmail } from '@/lib/services/sendEmails';

export async function POST(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const sender = await User.findById(userData._id);
        if (!sender || sender.Role !== 'Admin') {
            return NextResponse.json({ success: false, message: 'Access denied' }, { status: 403 });
        }

        const { userIds, subject, emailBody } = await req.json();

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0 || !emailBody) {
            return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
        }

        const recipients = await User.find({ _id: { $in: userIds } }).select('Email');

        for (const recipient of recipients) {
            await announceMentEmail(recipient.Email, subject, emailBody);
        }

        return NextResponse.json({
            success: true,
            message: `Announcement sent to ${recipients.length} users.`,
        }, { status: 200 });

    } catch (error) {
        console.error('Send announcement error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
