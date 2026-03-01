import { NextResponse } from "next/server";
import crypto from "crypto";
import connectToMongo from "@/lib/mongodb";
import { verifyUser } from "@/lib/middleware/fetchUser";
import CourseEnroll from "@/models/CourseEnroll";
import Course from "@/models/Course";

export async function POST(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId, formData } = await req.json();

        // Verify signature
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const generated_signature = crypto
            .createHmac("sha256", secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ success: false, message: "Signature verification failed" }, { status: 400 });
        }

        // Enrollment Logic
        const course = await Course.findById(courseId);
        if (!course) {
            return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
        }

        const existingEnrollment = await CourseEnroll.findOne({ userId: userData._id, courseId });
        if (existingEnrollment) {
            return NextResponse.json({ success: true, message: "Already enrolled", data: existingEnrollment }, { status: 200 });
        }

        const enrollment = new CourseEnroll({
            userId: userData._id,
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            college: formData.college,
            courseId,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            status: "enrolled",
        });

        await enrollment.save();

        return NextResponse.json({ success: true, message: "Payment verified and enrollment successful", data: enrollment }, { status: 201 });
    } catch (error) {
        console.error("Payment verification error:", error);
        return NextResponse.json({ success: false, message: "Failed to verify payment" }, { status: 500 });
    }
}
