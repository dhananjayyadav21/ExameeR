import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import MockTestAttempt from '@/models/MockTestAttempt';
import jwt from 'jsonwebtoken';

export async function GET(req) {
    try {
        await connectToMongo();

        // Simple token extraction (assuming header usage)
        const token = req.headers.get('authorization')?.split(' ')[1] || new URL(req.url).searchParams.get('token');
        if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

        const decoded = jwt.verify(token, process.env.AUTHTOKEN_SECRATE);

        const attempts = await MockTestAttempt.find({ userId: decoded._id })
            .populate('mockTestId', 'title category course difficulty durationMinutes totalQuestions')
            .sort({ attemptedAt: -1 });

        // Calculate aggregates
        const totalTaken = attempts.length;
        const totalPassed = attempts.filter(a => a.isPassed).length;
        const avgPercentage = totalTaken > 0 ? (attempts.reduce((acc, curr) => acc + curr.percentage, 0) / totalTaken).toFixed(1) : 0;

        return NextResponse.json({
            success: true,
            history: attempts,
            stats: { totalTaken, totalPassed, avgPercentage }
        });

    } catch (error) {
        console.error("Performance Stats Error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch stats" }, { status: 500 });
    }
}
