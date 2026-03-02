import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
    try {
        await connectToMongo();
        const userCount = await User.countDocuments();
        return NextResponse.json({ success: true, userCount });
    } catch (e) {
        return NextResponse.json({ success: false, message: e.message, stack: e.stack });
    }
}
