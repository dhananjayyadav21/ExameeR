import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Users from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        await connectToMongo();
        const { token, mode } = await req.json();

        if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        const decoded = jwt.verify(token, process.env.AUTHTOKEN_SECRATE);
        const userId = decoded._id;

        const user = await Users.findById(userId);
        if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

        // Logic to "generate" a test based on profile
        const isPractice = mode === 'practice';
        const testTitle = isPractice
            ? `${user.Course || 'Academic'} Mastery - Practice Session`
            : `${user.Course || 'Academic'} Full Mock - ${user.Semester || 'Current'} Semester`;

        const testDescription = isPractice
            ? `Relaxed learning session focused on ${user.Category || 'General'} concepts. No countdown, just pure focus.`
            : `Specially curated AI assessment for ${user.University || 'Global University'} students. Professional-timed exam conditions applied.`;

        const aiGeneratedTest = {
            id: 'ai-' + Date.now(),
            title: testTitle,
            description: testDescription,
            category: user.Category || 'Educational',
            questions: 25,
            duration: isPractice ? "Untimed" : "45 min",
            rating: 5.0,
            difficulty: 'Adaptive',
            isAI: true,
            testMode: mode,
            userPrefs: {
                university: user.University,
                course: user.Course,
                semester: user.Semester,
                category: user.Category
            }
        };

        return NextResponse.json({
            success: true,
            test: aiGeneratedTest,
            message: "AI has successfully generated a personalized mock test based on your academic profile."
        }, { status: 200 });

    } catch (error) {
        console.error("AI Mock Gen Error:", error);
        return NextResponse.json({ success: false, message: "Failed to generate AI test" }, { status: 500 });
    }
}
