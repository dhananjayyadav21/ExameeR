import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import MyLearningContent from '@/models/MyLearningContent';
import Note from '@/models/Note';
import Video from '@/models/Video';
import PYQ from '@/models/PYQ';
import Course from '@/models/Course';
import CourseEnroll from '@/models/CourseEnroll';
import User from '@/models/User';
import { verifyUser } from '@/lib/middleware/fetchUser';

export async function GET(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const learningEntries = await MyLearningContent.find({ userId: userData._id });

        const notesIds = learningEntries.filter(e => e.contentType === 'Note').map(e => e.contentId);
        const videoIds = learningEntries.filter(e => e.contentType === 'Video').map(e => e.contentId);
        const pyqIds = learningEntries.filter(e => e.contentType === 'PYQ').map(e => e.contentId);

        const [notesData, videoData, pyqData] = await Promise.all([
            Note.find({ _id: { $in: notesIds } }),
            Video.find({ _id: { $in: videoIds } }),
            PYQ.find({ _id: { $in: pyqIds } }),
        ]);

        const enrollments = await CourseEnroll.find({ userId: userData._id });
        const courseIds = enrollments.map(e => e.courseId);
        const enrolledCoursesRaw = await Course.find({ _id: { $in: courseIds } });
        const enrolledCourses = enrolledCoursesRaw.map(c => ({ ...c.toObject(), isEnrolled: true }));

        return NextResponse.json({
            success: true,
            notesData,
            videoData,
            pyqData,
            enrolledCourses
        }, { status: 200 });

    } catch (error) {
        console.error('Fetch mylearning error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
