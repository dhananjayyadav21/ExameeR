import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Certificate from '@/models/Certificate';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(req) {
    try {
        await connectToMongo();

        // Basic JWT Auth
        const token = req.headers.get('Authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ success: false, message: 'No token' }, { status: 401 });

        const decoded = jwt.verify(token, process.env.AUTHTOKEN_SECRATE);
        const userId = decoded._id;

        const certificates = await Certificate.find({ userId }).sort({ issueDate: -1 });

        return NextResponse.json({ success: true, certificates }, { status: 200 });

    } catch (error) {
        console.error("Fetch Certificates Error:", error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

// For demo purposes: issue a certificate
export async function POST(req) {
    try {
        await connectToMongo();
        const { token, testTitle, category, score, totalQuestions } = await req.json();

        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const decoded = jwt.verify(token, process.env.AUTHTOKEN_SECRATE);
        const userId = decoded._id;

        const certificateId = "CERT-" + Math.random().toString(36).substring(7).toUpperCase() + "-" + Date.now().toString().slice(-4);

        const newCert = new Certificate({
            userId,
            testTitle,
            category,
            score,
            totalQuestions,
            certificateId
        });

        await newCert.save();

        return NextResponse.json({ success: true, message: "Certificate issued!", certificate: newCert }, { status: 201 });

    } catch (error) {
        console.error("Issue Certificate Error:", error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
