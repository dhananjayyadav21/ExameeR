import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import BookAccess from '@/models/BookAccess';
import ExameeBook from '@/models/ExameeBook';
import User from '@/models/User';
import { verifyUser } from '@/lib/middleware/fetchUser';

const ADMIN_ROLES = ['Admin', 'Instructor'];

async function getAuthorizedUser(req) {
    const decoded = verifyUser(req);
    if (!decoded) return null;
    const user = await User.findById(decoded._id).select('Role');
    if (!user || !ADMIN_ROLES.includes(user.Role)) return null;
    return user;
}

// ── GET /api/books/access?bookId=xxx  — who accessed a book (admin only) ──
export async function GET(req) {
    try {
        await connectToMongo();
        const user = await getAuthorizedUser(req);
        if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const url = new URL(req.url);
        const bookId = url.searchParams.get('bookId');
        if (!bookId) return NextResponse.json({ success: false, message: 'bookId required' }, { status: 400 });

        const accessLogs = await BookAccess.find({ bookId })
            .populate('userId', 'FirstName LastName Email Profile Course Plan Username')
            .sort({ accessedAt: -1 });

        // Aggregate: unique users + counts
        const userMap = {};
        for (const log of accessLogs) {
            const uid = log.userId?._id?.toString();
            if (!uid) continue;
            if (!userMap[uid]) {
                userMap[uid] = {
                    user: log.userId,
                    accessCount: 0,
                    lastAccessedAt: log.accessedAt,
                    action: log.action,
                };
            }
            userMap[uid].accessCount++;
        }

        const accessors = Object.values(userMap);
        return NextResponse.json({ success: true, accessors, totalLogs: accessLogs.length });
    } catch (error) {
        console.error('BookAccess GET error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch access logs' }, { status: 500 });
    }
}

// ── POST /api/books/access  — record a book access (any logged-in student) ──
export async function POST(req) {
    try {
        await connectToMongo();
        const decoded = verifyUser(req);
        if (!decoded) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const { bookId, action } = await req.json();
        if (!bookId) return NextResponse.json({ success: false, message: 'bookId required' }, { status: 400 });

        // Log the access
        await BookAccess.create({ bookId, userId: decoded._id, action: action || 'view' });

        // Increment book access counter
        await ExameeBook.findByIdAndUpdate(bookId, { $inc: { accessCount: 1 } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('BookAccess POST error:', error);
        return NextResponse.json({ success: false, message: 'Failed to log access' }, { status: 500 });
    }
}
