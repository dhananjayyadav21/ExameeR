// FILE RE-WRITTEN TO FIX IMPORTS - SYNC CHECK OK
import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Plan from '@/models/Plan';
import User from '@/models/User';
import { verifyUser } from '@/lib/middleware/fetchUser';

/**
 * GET - Public: Fetch all active plans.
 * GET ?admin=1 - Admin: Fetch all plans including inactive ones.
 */
export async function GET(req) {
    try {
        await connectToMongo();
        const { searchParams } = new URL(req.url);
        const isAdminQuery = searchParams.get('admin') === '1';

        const filter = isAdminQuery ? {} : { isActive: true };
        const plans = await Plan.find(filter).sort({ sortOrder: 1 });

        return NextResponse.json({ success: true, plans });
    } catch (e) {
        return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    }
}

/**
 * POST - Admin: Create a new plan.
 */
export async function POST(req) {
    try {
        const decoded = verifyUser(req);
        if (!decoded) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        await connectToMongo();
        const user = await User.findById(decoded._id);
        if (!user || user.Role !== 'Admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const plan = await Plan.create({ ...body, createdBy: user._id });

        return NextResponse.json({ success: true, plan });
    } catch (e) {
        return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    }
}
