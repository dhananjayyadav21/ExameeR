import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Usage from '@/models/Usage';
import { verifyUser } from '@/lib/middleware/fetchUser';

/**
 * GET - Fetch current month's usage for the user.
 */
export async function GET(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const month = new Date().toISOString().slice(0, 7); // "YYYY-MM"
        let usage = await Usage.findOne({ userId: userData._id, month });

        if (!usage) {
            usage = { mockTestsTaken: 0, callsBooked: 0 };
        }

        return NextResponse.json({ success: true, usage }, { status: 200 });

    } catch (error) {
        console.error('Fetch Usage Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

/**
 * POST - Increment usage for a specific feature.
 * body: { feature: 'mockTests' | 'calls' }
 */
export async function POST(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { feature } = await req.json();
        const month = new Date().toISOString().slice(0, 7);

        let update = {};
        if (feature === 'mockTests') {
            update = { $inc: { mockTestsTaken: 1 } };
        } else if (feature === 'calls') {
            update = { $inc: { callsBooked: 1 } };
        } else {
            return NextResponse.json({ success: false, message: "Invalid feature" }, { status: 400 });
        }

        const usage = await Usage.findOneAndUpdate(
            { userId: userData._id, month },
            update,
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, usage }, { status: 200 });

    } catch (error) {
        console.error('Update Usage Error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
