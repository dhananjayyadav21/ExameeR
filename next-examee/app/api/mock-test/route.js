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
        const validRoles = ['admin', 'Admin', 'instructor', 'Instructor'];
        if (!user || !validRoles.includes(user.Role)) {
            return NextResponse.json({ success: false, message: "Only Admin or Instructor can create mock tests." }, { status: 403 });
        }

        // --- AI (Simulated) Question Generation ---
        let generatedQuestions = questions;
        if (!generatedQuestions || generatedQuestions.length === 0) {
            generatedQuestions = [];
            const numQ = parseInt(totalQuestions) || 5;

            const prefixes = [
                "What is the primary function of",
                "Which methodology is most applicable to",
                "Identify the core component of",
                "What is the main advantage of using",
                "Explain the fundamental principle behind"
            ];

            for (let i = 0; i < numQ; i++) {
                const prefix = prefixes[i % prefixes.length];
                const subject = i % 2 === 0 ? title : course;

                generatedQuestions.push({
                    questionText: `${prefix} ${subject} in a standard application context?`,
                    options: [
                        `Option A related to ${subject} concepts`,
                        `Alternative B for ${title} frameworks`,
                        `Option C demonstrating ${course} fundamentals`,
                        `None of the above`
                    ],
                    correctAnswerIndex: i % 3,
                    marks: 1
                });
            }
        }
        // -------------------------------------------

        const mockTest = new MockTest({
            title,
            description,
            category,
            course,
            semester,
            difficulty,
            durationMinutes,
            totalQuestions,
            questions: generatedQuestions, // Assign the generated questions
            createdBy: user._id,
            isPublished: true,
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

        let query = {}; // define query
        // add logic depending on filterStr if needed later

        const testList = await MockTest.find(query).select('-questions').populate('createdBy', 'FirstName LastName').sort({ createdAt: -1 });

        return NextResponse.json({ success: true, tests: testList }, { status: 200 });

    } catch (error) {
        console.error("Fetch Mock Tests Error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch mock tests" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectToMongo();
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        const { token, title, description, category, course, semester, difficulty, durationMinutes, totalQuestions } = await req.json();

        if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        const decoded = jwt.verify(token, process.env.AUTHTOKEN_SECRATE);

        const user = await Users.findById(decoded._id);
        const validRoles = ['admin', 'Admin', 'instructor', 'Instructor'];
        if (!user || !validRoles.includes(user.Role)) {
            return NextResponse.json({ success: false, message: "Only Admin or Instructor can edit mock tests." }, { status: 403 });
        }

        const existingTest = await MockTest.findById(id);
        if (!existingTest) {
            return NextResponse.json({ success: false, message: "Test not found." }, { status: 404 });
        }

        // We only update the basic info here, questions are not re-generated for simplicity in this MVP edit form
        existingTest.title = title || existingTest.title;
        existingTest.description = description || existingTest.description;
        existingTest.category = category || existingTest.category;
        existingTest.course = course || existingTest.course;
        existingTest.semester = semester || existingTest.semester;
        existingTest.difficulty = difficulty || existingTest.difficulty;
        existingTest.durationMinutes = durationMinutes || existingTest.durationMinutes;
        existingTest.totalQuestions = totalQuestions || existingTest.totalQuestions;

        await existingTest.save();
        return NextResponse.json({ success: true, message: "Mock test updated successfully", test: existingTest }, { status: 200 });

    } catch (error) {
        console.error("Update Mock Test Error:", error);
        return NextResponse.json({ success: false, message: "Failed to update mock test" }, { status: 500 });
    }
}
