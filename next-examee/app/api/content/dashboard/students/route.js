import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import User from '@/models/User';
import Note from '@/models/Note';
import Video from '@/models/Video';
import PYQ from '@/models/PYQ';
import MyLearningContent from '@/models/MyLearningContent';
import bcrypt from 'bcrypt';
import { verifyUser } from '@/lib/middleware/fetchUser';

export async function GET(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const requester = await User.findById(userData._id);
        if (!requester || (requester.Role !== 'Admin' && requester.Role !== 'Instructor')) {
            return NextResponse.json({ success: false, message: 'Access denied' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status') || "";         // empty = all statuses
        const search = searchParams.get('search') || "";          // empty = all users
        const roleFilter = searchParams.get('role') || 'Student'; // Student | Instructor
        const regex = search ? new RegExp(search, 'i') : /.*/;

        if (requester.Role === 'Admin') {
            const targetRole = ['Student', 'Instructor'].includes(roleFilter) ? roleFilter : 'Student';
            const query = {
                Role: targetRole,
                $or: [{ Username: regex }, { Email: regex }]
            };
            if (status) query.Status = status; // only filter status if explicitly selected
            const students = await User.find(query).select('-Password -ForgotPasswordCode');
            return NextResponse.json({ success: true, students }, { status: 200 });
        }

        if (requester.Role === 'Instructor') {
            // role=Instructor → show all instructors
            if (roleFilter === 'Instructor') {
                const query = {
                    Role: 'Instructor',
                    $or: [{ Username: regex }, { Email: regex }]
                };
                if (status) query.Status = status;
                const students = await User.find(query).select('-Password -ForgotPasswordCode');
                return NextResponse.json({ success: true, students }, { status: 200 });
            }

            // role=Student (or empty) → their own enrolled students
            const [noteIds, videoIds, pyqIds] = await Promise.all([
                Note.find({ uploadedBy: userData._id }).select('_id'),
                Video.find({ uploadedBy: userData._id }).select('_id'),
                PYQ.find({ uploadedBy: userData._id }).select('_id'),
            ]);

            const contentIds = [...noteIds, ...videoIds, ...pyqIds].map(c => c._id.toString());
            const learningRecords = await MyLearningContent.find({ contentId: { $in: contentIds } }).select('userId');
            const studentIds = [...new Set(learningRecords.map(l => l.userId.toString()))];

            const studentQuery = {
                _id: { $in: studentIds },
                Role: 'Student',
                $or: [{ Username: regex }, { Email: regex }]
            };
            if (status) studentQuery.Status = status;

            const students = await User.find(studentQuery).select('-Password -ForgotPasswordCode');
            return NextResponse.json({ success: true, students }, { status: 200 });
        }

    } catch (error) {
        console.error('Get students error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const requester = await User.findById(userData._id);
        if (!requester || (requester.Role !== 'Admin' && requester.Role !== 'Instructor')) {
            return NextResponse.json({ success: false, message: 'Access denied' }, { status: 403 });
        }

        const { Username, Email, Password, Status, isVerified } = await req.json();

        if (!Username || !Email || !Password) {
            return NextResponse.json({ success: false, message: 'Required fields missing' }, { status: 400 });
        }

        const existingUser = await User.findOne({ Email: Email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        function userIdBasedOnEmail(userEmail) {
            const hash = [...userEmail].reduce((acc, char) => acc + char.charCodeAt(0), 0);
            return hash + Math.floor(Math.random() * 10000);
        }
        const ExmeeUserId = "Exa" + userIdBasedOnEmail(Email);

        const newUser = new User({
            Username,
            Email: Email.toLowerCase(),
            Password: hashedPassword,
            Role: 'Student',
            Status: Status || 'active',
            isVerified: isVerified || false,
            ExmeeUserId
        });

        await newUser.save();
        return NextResponse.json({ success: true, message: 'Student created successfully', user: newUser }, { status: 201 });

    } catch (error) {
        console.error('Add student error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
