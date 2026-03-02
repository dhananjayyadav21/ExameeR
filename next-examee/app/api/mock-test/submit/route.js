import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import MockTest from '@/models/MockTest';
import MockTestAttempt from '@/models/MockTestAttempt';
import jwt from 'jsonwebtoken';
import Users from '@/models/User';

export async function POST(req) {
    try {
        await connectToMongo();
        const { token, mockTestId, score, durationTaken } = await req.json();

        if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        const decoded = jwt.verify(token, process.env.AUTHTOKEN_SECRATE);

        const test = await MockTest.findById(mockTestId);
        if (!test) {
            return NextResponse.json({ success: false, message: "Test not found" }, { status: 404 });
        }

        const percentage = Math.round((score / test.totalQuestions) * 100);
        const isPassed = percentage >= 40; // Pass criteria

        const attempt = new MockTestAttempt({
            userId: decoded._id,
            mockTestId: test._id,
            score: score,
            totalScore: test.totalQuestions,
            percentage,
            durationTaken,
            isPassed
        });

        await attempt.save();

        // Increment user's mock test usage
        await Users.findByIdAndUpdate(decoded._id, { $inc: { 'usage.mockTestsTaken': 1 } });

        return NextResponse.json({ success: true, attempt }, { status: 201 });

    } catch (error) {
        console.error("Submit Test Error:", error);
        return NextResponse.json({ success: false, message: "Failed to submit test" }, { status: 500 });
    }
}
