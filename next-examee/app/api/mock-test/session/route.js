import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import MockTest from '@/models/MockTest';
import jwt from 'jsonwebtoken';

export async function GET(req) {
    try {
        await connectToMongo();
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        const token = url.searchParams.get('token');

        if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        jwt.verify(token, process.env.AUTHTOKEN_SECRATE); // verify token

        // Fetch test WITH questions (unlike the main GET endpoint) since they are actually taking it
        const test = await MockTest.findById(id).lean();

        if (!test) {
            return NextResponse.json({ success: false, message: "Test not found" }, { status: 404 });
        }

        // We can optionally strip out correctAnswerIndex here to prevent cheating, 
        // but for demo MVP we will leave it since the client-side calculator uses it. 

        return NextResponse.json({ success: true, test }, { status: 200 });

    } catch (error) {
        console.error("Fetch Mock Test Session Error:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch test details" }, { status: 500 });
    }
}
