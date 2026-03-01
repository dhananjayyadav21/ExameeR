import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { verifyUser } from '@/lib/middleware/fetchUser';

// PUT – update banner
export async function PUT(req, { params }) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const banner = await Banner.findByIdAndUpdate(params.id, body, { new: true });
        if (!banner) return NextResponse.json({ success: false, message: 'Banner not found' }, { status: 404 });
        return NextResponse.json({ success: true, banner }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}

// DELETE – remove banner
export async function DELETE(req, { params }) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        await Banner.findByIdAndDelete(params.id);
        return NextResponse.json({ success: true, message: 'Banner deleted' }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}
