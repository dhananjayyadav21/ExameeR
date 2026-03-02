import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import User from '@/models/User';
import { verifyUser } from '@/lib/middleware/fetchUser';

export async function PUT(req) {
    try {
        await connectToMongo();
        const userData = verifyUser(req);
        if (!userData) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        console.log("UPDATE_PROFILE_REQUEST_BODY:", body);
        const allowedFields = ['Username', 'FirstName', 'LastName', 'Institution', 'Profile', 'NotificationPrefs', 'About', 'Phone', 'Gender', 'Location', 'Course', 'University', 'Semester', 'Category'];
        const updateFields = {};

        allowedFields.forEach(field => {
            if (body[field] !== undefined) {
                updateFields[field] = body[field];
            }
        });

        const user = await User.findById(userData._id);
        if (!user) {
            console.log("UPDATE_PROFILE_USER_NOT_FOUND:", userData._id);
            return NextResponse.json({ success: false, message: 'User not found!' }, { status: 404 });
        }

        // Only check username uniqueness if it's being changed
        if (updateFields.Username && updateFields.Username !== user.Username) {
            const existingUser = await User.findOne({
                Username: updateFields.Username,
                _id: { $ne: user._id }
            });
            if (existingUser) {
                return NextResponse.json({ success: false, message: 'Username is already taken' }, { status: 400 });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $set: updateFields },
            { new: true }
        ).select('-Password -ForgotPasswordCode');

        console.log("UPDATED_USER_RESULT_SUCCESS:", updatedUser._id);

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        }, { status: 200 });

    } catch (error) {
        console.error("UpdateProfile ERROR_STACK:", error);
        return NextResponse.json({
            success: false,
            message: 'Failed to update profile. ' + (error.message || 'Internal server error'),
            error: error.message
        }, { status: 500 });
    }
}
