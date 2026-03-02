import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { verifyUser } from '@/lib/middleware/fetchUser';

// GET – admin (no page param) returns ALL banners; student pages filter by page + active + expiry
export async function GET(req) {
    try {
        await connectToMongo();
        const { searchParams } = new URL(req.url);
        const page = searchParams.get('page');  // student filter
        const admin = searchParams.get('admin'); // flag for dashboard

        let query = {};

        if (page && !admin) {
            // Student view: active + not expired + matching page
            const now = new Date();
            query = {
                isActive: true,
                $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
                pages: { $in: [page, 'all'] },
            };
        }
        // Admin view (no page param, or ?admin=1): return everything

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
