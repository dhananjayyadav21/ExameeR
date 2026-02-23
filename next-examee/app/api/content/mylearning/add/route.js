import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import MyLearningContent from '@/models/MyLearningContent';
import User from '@/models/User';
import { verifyUser } from '@/lib/middleware/fetchUser';

export async function POST(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { contentId, contentType } = await req.json();
        if (!contentId || !contentType) {
            return NextResponse.json({ success: false, message: 'Invalid data' }, { status: 400 });
        }

        const existing = await MyLearningContent.findOne({ userId: userData._id, contentId, contentType });
        if (existing) {
            return NextResponse.json({ success: false, message: 'Already exists in My Learning' }, { status: 409 });
        }

        const entry = new MyLearningContent({ userId: userData._id, contentId, contentType });
        await entry.save();

        return NextResponse.json({ success: true, message: 'Added to My Learning' }, { status: 201 });

    } catch (error) {
        console.error('Add in mylearning error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
