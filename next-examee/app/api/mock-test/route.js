import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import MockTest from '@/models/MockTest';
import Users from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        await connectToMongo();
        const { token, title, description, category, course, semester, difficulty, durationMinutes, totalQuestions, questions } = await req.json();

        if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        const decoded = jwt.verify(token, process.env.AUTHTOKEN_SECRATE);

        const user = await Users.findById(decoded._id);
        if (!user || (user.Role !== 'instructor' && user.Role !== 'admin')) {
            return NextResponse.json({ success: false, message: "Only Admin or Instructor can create mock tests." }, { status: 403 });
        }

        const mockTest = new MockTest({
            title,
            description,
            category,
            course,
            semester,
            difficulty,
            durationMinutes,
            totalQuestions,
            questions, // structure: [{questionText, options[], correctAnswerIndex, marks, explanation}]
            createdBy: user._id,
            isPublished: true, // Auto publish for now
        });

        await mockTest.save();
        return NextResponse.json({ success: true, message: "Mock test created successfully", test: mockTest }, { status: 201 });

    } catch (error) {
        console.error("Create Mock Test Error:", error);
        return NextResponse.json({ success: false, message: "Failed to create mock test" }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await connectToMongo();
        const url = new URL(req.url);
        const filterStr = url.searchParams.get('filter'); // 'instructor' or 'all'

        const testList = await MockTest.find(query).select('-questions').populate('createdBy', 'FirstName LastName').sort({ createdAt: -1 });

        return NextResponse.json({ success: true, tests: testList }, { status: 200 });

    } catch (error) {
        console.error("Fetch Mock Tests Error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch mock tests" }, { status: 500 });
    }
}
