import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Note from '@/models/Note';
import PYQ from '@/models/PYQ';
import Video from '@/models/Video';
import Course from '@/models/Course';
import User from '@/models/User';
import { verifyUser } from '@/lib/middleware/fetchUser';

export async function GET(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category') || "sciTechnology";
        const status = searchParams.get('status') || "public";
        const searchType = searchParams.get('type') || "notes";
        const search = searchParams.get('search') || "";

        if (!search) {
            return NextResponse.json({ success: false, message: 'Search Field is empty!' }, { status: 400 });
        }

        const regex = new RegExp(search, 'i');
        const user = await User.findById(userData._id);
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found!' }, { status: 404 });
        }

        let filter = { status, category };
        if (user.Role === "Instructor") {
            filter.ExmeeUserId = user.ExmeeUserId;
        }

        let results = [];
        let typeLabel = searchType;

        if (searchType === "notes") {
            results = await Note.find({ ...filter, $or: [{ title: regex }, { description: regex }, { professor: regex }] });
        } else if (searchType === "pyq") {
            results = await PYQ.find({ ...filter, $or: [{ title: regex }, { subject: regex }] });
        } else if (searchType === "video") {
            results = await Video.find({ ...filter, $or: [{ title: regex }, { description: regex }] });
        } else if (searchType === "course") {
            results = await Course.find({ ...filter, $or: [{ title: regex }, { description: regex }] });
        }

        return NextResponse.json({
            success: true,
            message: 'Search results found!',
            type: typeLabel,
            results: results.map(r => ({ ...r.toObject(), type: searchType.slice(0, -1) })) // singularize if needed
        }, { status: 200 });

    } catch (error) {
        console.error('Dashboard content search error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
