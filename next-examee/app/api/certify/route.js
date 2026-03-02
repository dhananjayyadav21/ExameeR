import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import CertifyTest from '@/models/CertifyTest';
import CertifyResult from '@/models/CertifyResult';
import Certificate from '@/models/Certificate';
import Users from '@/models/User';
import jwt from 'jsonwebtoken';
import { sendCertificationEmail } from '@/lib/services/sendEmails';

// Seeder logic - Add default certification tests if none exist
const seedIfEmpty = async () => {
    const count = await CertifyTest.countDocuments();
    if (count === 0) {
        await CertifyTest.create([
            {
                title: "Advanced Data Science Professional",
                category: "Technology",
                description: "Pro-level certification covering ML, Neural Networks, and Big Data Analytics.",
                questions: [
                    { questionText: "What is the primary goal of PCA?", options: ["Clustering", "Dimensionality Reduction", "Supervised Learning", "Regression"], correctOptionIndex: 1 },
                    { questionText: "Which optimizer is adaptive?", options: ["SGD", "Momentum", "Adam", "Nesterov"], correctOptionIndex: 2 }
                ],
                passingScore: 75
            },
            {
                title: "Examee Certified Educator",
                category: "Teaching",
                description: "Validate your skills in curriculum design and student engagement strategies.",
                questions: [
                    { questionText: "What is Bloom's Taxonomy primarily used for?", options: ["Grading", "Classification of learning objectives", "Classroom management", "Parent communication"], correctOptionIndex: 1 }
                ],
                passingScore: 75
            }
        ]);
    }
};

export async function GET(req) {
    try {
        await connectToMongo();
        await seedIfEmpty();

        const token = req.headers.get('Authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ success: false }, { status: 401 });

        const decoded = jwt.verify(token, process.env.AUTHTOKEN_SECRATE);
        const userId = decoded._id;

        const tests = await CertifyTest.find();

        // Find user attempt history
        const attempts = await CertifyResult.find({ userId });

        return NextResponse.json({ success: true, tests, attempts }, { status: 200 });

    } catch (error) {
        console.error("Fetch Certify Tests Error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectToMongo();
        const { testId, answers, token } = await req.json();

        if (!token) return NextResponse.json({ success: false }, { status: 401 });
        const decoded = jwt.verify(token, process.env.AUTHTOKEN_SECRATE);
        const userId = decoded._id;

        const user = await Users.findById(userId);
        if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

        // Check for 1-week lockout
        const lastResult = await CertifyResult.findOne({ userId, testId }).sort({ createdAt: -1 });
        if (lastResult) {
            const oneWeek = 7 * 24 * 60 * 60 * 1000;
            const diff = Date.now() - new Date(lastResult.lastAttemptedAt).getTime();
            if (diff < oneWeek) {
                const daysLeft = Math.ceil((oneWeek - diff) / (24 * 60 * 60 * 1000));
                return NextResponse.json({
                    success: false,
                    message: `You must wait ${daysLeft} more day(s) before attempting this certification again.`
                }, { status: 403 });
            }
        }

        const test = await CertifyTest.findById(testId);
        if (!test) return NextResponse.json({ success: false, message: "Test not found" }, { status: 404 });

        // Calculate score
        let correctCount = 0;
        test.questions.forEach((q, idx) => {
            if (answers[idx] == q.correctOptionIndex) correctCount++;
        });

        const scorePercentage = (correctCount / test.questions.length) * 100;
        const passed = scorePercentage >= test.passingScore;

        // Save result
        const result = new CertifyResult({
            userId,
            testId,
            score: scorePercentage,
            passed,
            lastAttemptedAt: new Date()
        });
        await result.save();

        // Issue certificate if passed
        let certificateId = "";
        if (passed) {
            certificateId = "CERT-CERTIFY-" + Math.random().toString(36).substring(7).toUpperCase() + "-" + Date.now().toString().slice(-4);
            const certificate = new Certificate({
                userId,
                testTitle: test.title,
                category: test.category,
                score: correctCount,
                totalQuestions: test.questions.length,
                certificateId
            });
            await certificate.save();
        }

        // Send Email notification
        const userName = user.FirstName || user.Username;
        await sendCertificationEmail(user.Email, userName, test.title, Math.round(scorePercentage), passed, certificateId);

        return NextResponse.json({
            success: true,
            passed,
            score: scorePercentage,
            message: passed ? "Congratulations! You earned a certification." : "You did not meet the 75% threshold. Please try again after 1 week."
        }, { status: 200 });

    } catch (error) {
        console.error("Submit Certify Error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
