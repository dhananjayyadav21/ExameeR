import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { verifyUser } from '@/lib/middleware/fetchUser';

// GET  – public (student pages call this)
export async function GET(req) {
    try {
        await connectToMongo();
        const { searchParams } = new URL(req.url);
        const page = searchParams.get('page'); // 'notes' | 'pyq' | 'course' | null

        const now = new Date();
        const query = {
            isActive: true,
            $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
        };
        if (page) {
            query.$and = [
                { pages: { $in: [page, 'all'] } },
            ];
        }
        const banners = await Banner.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, banners }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}

// POST – admin only
export async function POST(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const banner = new Banner({ ...body, createdBy: userData._id });
        await banner.save();
        return NextResponse.json({ success: true, banner }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}
