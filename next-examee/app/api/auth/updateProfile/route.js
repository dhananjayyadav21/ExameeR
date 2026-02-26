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
        const { Username, FirstName, LastName, Institution, Profile, NotificationPrefs } = body;

        // Check if username is being changed and if it's already taken
        if (Username) {
            const existingUser = await User.findOne({ Username, _id: { $ne: userData._id } });
            if (existingUser) {
                return NextResponse.json({ success: false, message: 'Username is already taken' }, { status: 400 });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            userData._id,
            {
                $set: {
                    Username,
                    FirstName,
                    LastName,
                    Institution,
                    Profile,
                    NotificationPrefs
                }
            },
            { new: true }
        ).select('-Password -ForgotPasswordCode');

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: 'User not found!' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        }, { status: 200 });

    } catch (error) {
        console.error("UpdateProfile Error:", error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
