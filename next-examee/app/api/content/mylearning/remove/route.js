import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import MyLearningContent from '@/models/MyLearningContent';
import { verifyUser } from '@/lib/middleware/fetchUser';

export async function POST(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { contentId, contentType } = await req.json();

        const deletedEntry = await MyLearningContent.findOneAndDelete({
            userId: userData._id,
            contentId,
            contentType,
        });

        if (!deletedEntry) {
            return NextResponse.json({ success: false, message: 'Not found in My Learning' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Removed from My Learning' }, { status: 200 });

    } catch (error) {
        console.error('Remove from mylearning error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
