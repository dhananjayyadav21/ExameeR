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
        const category = searchParams.get('category') || "";   // empty = all categories
        const status = searchParams.get('status') || "";   // empty = all statuses
        const searchType = searchParams.get('type') || "notes";
        const search = searchParams.get('search') || "";   // empty = no text filter
        const course = searchParams.get('course') || "";
        const semester = searchParams.get('semester') || "";
        const university = searchParams.get('university') || "";

        const user = await User.findById(userData._id);
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found!' }, { status: 404 });
        }

        // Build base filter — only add fields that were actually provided
        const filter = {};
        if (category) filter.category = category;
        if (status) filter.status = status;
        if (course) filter.course = course;
        if (semester) filter.semester = semester;
        if (university) filter.university = university;
        if (user.Role === "Instructor") filter.ExmeeUserId = user.ExmeeUserId;

        // Text search — if empty, match everything (no $or restriction)
        const regex = search ? new RegExp(search, 'i') : null;
        const textCond = (fields) => regex ? { $or: fields.map(f => ({ [f]: regex })) } : {};

        let results = [];
        if (searchType === "notes") {
            results = await Note.find({ ...filter, ...textCond(['title', 'description', 'professor']) });
        } else if (searchType === "pyq") {
            results = await PYQ.find({ ...filter, ...textCond(['title', 'subject']) });
        } else if (searchType === "video") {
            results = await Video.find({ ...filter, ...textCond(['title', 'description']) });
        } else if (searchType === "course") {
            results = await Course.find({ ...filter, ...textCond(['title', 'description']) });
        }

        return NextResponse.json({
            success: true,
            message: `Found ${results.length} result(s)`,
            type: searchType,
            results: results.map(r => ({ ...r.toObject(), type: searchType }))
        }, { status: 200 });

    } catch (error) {
        console.error('Dashboard content search error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
