import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import User from '@/models/User';
import { verifyUser } from '@/lib/middleware/fetchUser';

export async function DELETE(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const deletedUser = await User.findByIdAndDelete(userData._id);
        if (!deletedUser) {
            return NextResponse.json({ success: false, message: 'User not found!' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Account deleted successfully'
        }, { status: 200 });

    } catch (error) {
        console.error("DeleteAccount Error:", error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
