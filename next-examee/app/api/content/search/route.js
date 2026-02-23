import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Note from '@/models/Note';
import PYQ from '@/models/PYQ';
import Video from '@/models/Video';

export async function GET(req) {
    try {
        await connectToMongo();
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search');
        const searchType = searchParams.get('type') || "notes";

        if (!search) {
            return NextResponse.json({ success: false, message: 'Search query is empty.!' }, { status: 400 });
        }

        const regex = new RegExp(search, 'i');
        const filter = { status: 'public', deletedAt: null };

        let results = [];
        let typeLabel = searchType;

        if (searchType === "notes") {
            results = await Note.find({
                ...filter,
                $or: [
                    { title: regex },
                    { description: regex },
                    { professor: regex },
                    { tags: regex }
                ]
            }).lean();
            results = results.map(item => ({ ...item, type: 'note' }));
        } else if (searchType === "pyq") {
            results = await PYQ.find({
                ...filter,
                $or: [
                    { title: regex },
                    { subject: regex },
                    { tags: regex }
                ]
            }).lean();
            results = results.map(item => ({ ...item, type: 'pyq' }));
        } else if (searchType === "video") {
            results = await Video.find({
                ...filter,
                $or: [
                    { title: regex },
                    { description: regex },
                    { tags: regex }
                ]
            }).lean();
            results = results.map(item => ({ ...item, type: 'video' }));
        }

        if (results.length === 0) {
            return NextResponse.json({ success: false, message: 'No matching content found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Here found some result!',
            type: typeLabel,
            results
        }, { status: 200 });

    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
