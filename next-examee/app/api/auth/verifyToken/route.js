import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const AuthToken_Secrate = process.env.AUTHTOKEN_SECRATE;

export async function GET(req) {
    try {
        const token = req.headers.get("AuthToken");
        if (!token) {
            return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
        }

        const data = jwt.verify(token, AuthToken_Secrate);
        if (data) {
            return NextResponse.json({ success: true, message: "Token Verified" }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, message: "Unauthorized User" }, { status: 401 });
    }
}
