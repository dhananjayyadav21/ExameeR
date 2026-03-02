import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { verifyUser } from "@/lib/middleware/fetchUser";
import connectToMongo from "@/lib/mongodb";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { amount, currency = "INR", receipt } = await req.json();

        if (!amount) {
            return NextResponse.json({ success: false, message: "Amount is required" }, { status: 400 });
        }

        const options = {
            amount: Math.round(amount * 100), // convert to paisa
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({ success: true, order }, { status: 200 });
    } catch (error) {
        console.error("Razorpay order creation error:", error);
        return NextResponse.json({ success: false, message: "Failed to create order" }, { status: 500 });
    }
}
