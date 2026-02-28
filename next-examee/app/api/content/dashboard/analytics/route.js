import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Note from '@/models/Note';
import Video from '@/models/Video';
import PYQ from '@/models/PYQ';
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
        if (user.Role !== 'Instructor' && user.Role !== 'Admin') {
            return NextResponse.json({ success: false, message: 'Access denied' }, { status: 403 });
        }

        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(today.getMonth() - 1);

        const models = { notes: Note, videos: Video, pyqs: PYQ };
        const results = {};

        const calcGrowth = (current, previous) => {
            if (previous === 0) return current === 0 ? 0 : 100;
            return (((current - previous) / previous) * 100).toFixed(2);
        };

        for (const key in models) {
            const Model = models[key];
            const baseFilter = { deletedAt: null };
            if (user.Role === 'Instructor') {
                baseFilter.uploadedBy = userData._id;
            }

            const currentMonthCount = await Model.countDocuments({ ...baseFilter, createdAt: { $gte: oneMonthAgo } });
            const lastMonthCount = await Model.countDocuments({ ...baseFilter, createdAt: { $lt: oneMonthAgo } });
            const totalCount = await Model.countDocuments(baseFilter);

            results[key] = {
                total: totalCount,
                growth: calcGrowth(currentMonthCount, lastMonthCount)
            };
        }

        return NextResponse.json({
            success: true,
            data: results
        }, { status: 200 });

    } catch (error) {
        console.error('Dashboard analytics error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
