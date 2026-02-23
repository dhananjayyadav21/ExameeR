import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Note from '@/models/Note';
import PYQ from '@/models/PYQ';
import Video from '@/models/Video';
import Course from '@/models/Course';

export async function GET(req) {
    try {
        await connectToMongo();
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q') || "";

        if (!query) {
            return NextResponse.json({ success: true, results: [] }, { status: 200 });
        }

        const regex = new RegExp(query, 'i');

        const [notes, pyqs, videos, courses] = await Promise.all([
            Note.find({ $or: [{ title: regex }, { description: regex }] }).limit(10),
            PYQ.find({ $or: [{ title: regex }, { subject: regex }] }).limit(10),
            Video.find({ $or: [{ title: regex }, { description: regex }] }).limit(10),
            Course.find({ $or: [{ title: regex }, { description: regex }] }).limit(10),
        ]);

        const results = [
            ...notes.map(n => ({ ...n._doc, type: 'note' })),
            ...pyqs.map(p => ({ ...p._doc, type: 'pyq' })),
            ...videos.map(v => ({ ...v._doc, type: 'video' })),
            ...courses.map(c => ({ ...c._doc, type: 'course' }))
        ];

        return NextResponse.json({ success: true, results }, { status: 200 });

    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
