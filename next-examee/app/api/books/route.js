import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
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

// ── GET /api/books  — list all published books (students) or all books (admin/instructor) ──
export async function GET(req) {
    try {
        await connectToMongo();
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        const all = url.searchParams.get('all'); // admin mode

        if (id) {
            const book = await ExameeBook.findById(id).populate('uploadedBy', 'FirstName LastName Email');
            if (!book) return NextResponse.json({ success: false, message: 'Book not found' }, { status: 404 });
            return NextResponse.json({ success: true, book });
        }

        const query = all ? {} : { isPublished: true };
        const books = await ExameeBook.find(query)
            .populate('uploadedBy', 'FirstName LastName')
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, books, total: books.length });
    } catch (error) {
        console.error('Books GET error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch books' }, { status: 500 });
    }
}

// ── POST /api/books  — create book (admin/instructor only) ──
export async function POST(req) {
    try {
        await connectToMongo();
        const user = await getAuthorizedUser(req);
        if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { title, author, description, category, subject, coverImage, fileUrl, fileType, isPremium, tags } = body;

        if (!title || !author || !category) {
            return NextResponse.json({ success: false, message: 'Title, author and category are required' }, { status: 400 });
        }

        const book = new ExameeBook({
            title, author, description, category, subject,
            coverImage, fileUrl, fileType: fileType || 'pdf',
            isPremium: isPremium || false,
            tags: tags || [],
            uploadedBy: user._id,
        });
        await book.save();

        return NextResponse.json({ success: true, book }, { status: 201 });
    } catch (error) {
        console.error('Books POST error:', error);
        return NextResponse.json({ success: false, message: error?.message || 'Failed to create book' }, { status: 500 });
    }
}

// ── PUT /api/books  — update book ──
export async function PUT(req) {
    try {
        await connectToMongo();
        const user = await getAuthorizedUser(req);
        if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const { id, ...updates } = body;
        if (!id) return NextResponse.json({ success: false, message: 'Book id required' }, { status: 400 });

        const book = await ExameeBook.findByIdAndUpdate(id, updates, { new: true });
        if (!book) return NextResponse.json({ success: false, message: 'Book not found' }, { status: 404 });

        return NextResponse.json({ success: true, book });
    } catch (error) {
        console.error('Books PUT error:', error);
        return NextResponse.json({ success: false, message: 'Failed to update book' }, { status: 500 });
    }
}

// ── DELETE /api/books  — delete book ──
export async function DELETE(req) {
    try {
        await connectToMongo();
        const user = await getAuthorizedUser(req);
        if (!user) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        if (!id) return NextResponse.json({ success: false, message: 'id required' }, { status: 400 });

        await ExameeBook.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: 'Book deleted' });
    } catch (error) {
        console.error('Books DELETE error:', error);
        return NextResponse.json({ success: false, message: 'Failed to delete book' }, { status: 500 });
    }
}
