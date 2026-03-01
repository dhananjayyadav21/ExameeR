// FILE RE-WRITTEN TO FIX IMPORTS - SYNC CHECK OK
import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Plan from '@/models/Plan';
import User from '@/models/User';
import { verifyUser } from '@/lib/middleware/fetchUser';

/**
 * PUT - Admin: Update an existing plan.
 * DELETE - Admin: Delete an existing plan.
 */
export async function PUT(req, { params }) {
    try {
        const decoded = verifyUser(req);
        if (!decoded) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        await connectToMongo();
        const user = await User.findById(decoded._id);
        if (!user || user.Role !== 'Admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();

        const plan = await Plan.findByIdAndUpdate(id, { $set: body }, { new: true });
        if (!plan) return NextResponse.json({ success: false, message: 'Plan not found' }, { status: 404 });

        return NextResponse.json({ success: true, plan });
    } catch (e) {
        return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const decoded = verifyUser(req);
        if (!decoded) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        await connectToMongo();
        const user = await User.findById(decoded._id);
        if (!user || user.Role !== 'Admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        const plan = await Plan.findByIdAndDelete(id);
        if (!plan) return NextResponse.json({ success: false, message: 'Plan not found' }, { status: 404 });

        return NextResponse.json({ success: true, message: 'Plan deleted' });
    } catch (e) {
        return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    }
}
