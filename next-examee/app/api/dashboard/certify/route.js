import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import CertifyTest from '@/models/CertifyTest';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        await connectToMongo();

        const token = req.headers.get('Authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const decoded = jwt.verify(token, process.env.AUTHTOKEN_SECRATE);
        // Add proper admin role verification here if needed in production
        const { title, category, description, questions, passingScore } = await req.json();

        const newTest = new CertifyTest({
            title,
            category,
            description,
            questions,
            passingScore
        });

        await newTest.save();

        return NextResponse.json({ success: true, message: "Certification created successfully!" }, { status: 201 });

    } catch (error) {
        console.error("Create Certification Error:", error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectToMongo();

        const token = req.headers.get('Authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const decoded = jwt.verify(token, process.env.AUTHTOKEN_SECRATE);
        const { id, title, category, description, questions, passingScore } = await req.json();

        const updated = await CertifyTest.findByIdAndUpdate(id, {
            title,
            category,
            description,
            questions,
            passingScore
        }, { new: true });

        if (!updated) return NextResponse.json({ success: false, message: "Test not found" }, { status: 404 });

        return NextResponse.json({ success: true, message: "Certification updated successfully!" }, { status: 200 });

    } catch (error) {
        console.error("Update Certification Error:", error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
