import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import User from '@/models/User';
import { verifyUser } from '@/lib/middleware/fetchUser';

export async function GET(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(userData._id);
        if (!user || user.Role !== 'Admin') {
            return NextResponse.json({ success: false, message: 'Access denied' }, { status: 403 });
        }

        const users = await User.find().select('_id Email Username');
        return NextResponse.json({ success: true, data: users }, { status: 200 });

    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
