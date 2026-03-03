import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import MockTestAttempt from '@/models/MockTestAttempt';
import '@/models/User';
import mongoose from 'mongoose';

/**
 * GET /api/mock-test/attempters?testId=xxx
 * Returns all students who attempted a specific mock test,
 * grouped by user with attempt count, best score, and profile info.
 */
export async function GET(req) {
    try {
        await connectToMongo();
        const url = new URL(req.url);
        const testId = url.searchParams.get('testId');

        if (!testId) {
            return NextResponse.json({ success: false, message: 'testId is required' }, { status: 400 });
        }

        // Aggregate all attempts for this test, grouped by user
        const attempters = await MockTestAttempt.aggregate([
            { $match: { mockTestId: new mongoose.Types.ObjectId(testId) } },
            { $sort: { attemptedAt: -1 } },
            {
                $group: {
                    _id: '$userId',
                    attempts: { $sum: 1 },
                    bestScore: { $max: '$percentage' },
                    lastAttemptedAt: { $first: '$attemptedAt' },
                    isPassed: { $max: { $cond: ['$isPassed', 1, 0] } },
                    scores: {
                        $push: {
                            score: '$score',
                            totalScore: '$totalScore',
                            percentage: '$percentage',
                            isPassed: '$isPassed',
                            attemptedAt: '$attemptedAt',
                            durationTaken: '$durationTaken'
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    userId: '$_id',
                    attempts: 1,
                    bestScore: 1,
                    lastAttemptedAt: 1,
                    isPassed: { $toBool: '$isPassed' },
                    scores: { $slice: ['$scores', 5] }, // latest 5
                    'user.FirstName': 1,
                    'user.LastName': 1,
                    'user.Email': 1,
                    'user.Username': 1,
                    'user.Profile': 1,
                    'user.Course': 1,
                    'user.Institution': 1,
                    'user.Plan': 1,
                }
            },
            { $sort: { bestScore: -1 } }
        ]);

        return NextResponse.json({ success: true, attempters, total: attempters.length }, { status: 200 });

    } catch (error) {
        console.error('Attempters Error:', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch attempters' }, { status: 500 });
    }
}
