import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Note from '@/models/Note';
import PYQ from '@/models/PYQ';
import Video from '@/models/Video';
import Course from '@/models/Course';
import { verifyUser } from '@/lib/middleware/fetchUser';

export async function GET(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const latestNotes = await Note.find({ isPublic: true, status: 'public' }).sort({ createdAt: -1 }).limit(10);
        const latestPYQs = await PYQ.find({ isPublic: true, status: 'public' }).sort({ createdAt: -1 }).limit(10);
        const latestVideos = await Video.find({ isPublic: true, status: 'public' }).sort({ createdAt: -1 }).limit(10);
        const latestCourses = await Course.find({ isPublic: true, status: 'public' }).sort({ createdAt: -1 }).limit(10);

        const data = [
            ...latestNotes.map(n => ({ ...n._doc, type: 'note' })),
            ...latestPYQs.map(p => ({ ...p._doc, type: 'pyq' })),
            ...latestVideos.map(v => ({ ...v._doc, type: 'video' })),
            ...latestCourses.map(c => ({ ...c._doc, type: 'course' }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 20);

        return NextResponse.json({ success: true, data }, { status: 200 });

    } catch (error) {
        console.error('Latest uploads error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
