import { NextResponse } from 'next/server';
import connectToMongo from '@/lib/mongodb';
import Plan from '@/models/Plan';
import User from '@/models/User';
import { verifyUser } from '@/lib/middleware/fetchUser';

const DEFAULT_PLANS = [
    {
        planId: 'e0',
        name: 'E0 Free',
        tagline: 'Start for free, always',
        price: 0,
        priceSuffix: '',
        priceLabel: 'Free forever',
        accent: '#04bd20',
        accentBg: '#f0fdf4',
        badge: null,
        ribbon: false,
        contentAccess: 'Free-tier content only',
        features: [
            { text: 'All free notes & PDFs', ok: true },
            { text: 'Free video lectures', ok: true },
            { text: 'Free PYQ papers', ok: true },
            { text: 'Dashboard & profile', ok: true },
            { text: 'Mock test previews', ok: true },
            { text: 'Plus-tier content', ok: false },
            { text: 'Pro-tier content', ok: false },
            { text: 'Priority support', ok: false },
        ],
        sortOrder: 1,
        isActive: true
    },
    {
        planId: 'plus',
        name: 'Plus',
        tagline: 'More content. More growth.',
        price: 199,
        priceSuffix: '/month',
        priceLabel: '₹199 / month',
        accent: '#8b5cf6',
        accentBg: '#faf5ff',
        badge: 'Popular',
        ribbon: true,
        contentAccess: 'Free + Plus content',
        features: [
            { text: 'Everything in E0', ok: true },
            { text: 'Plus-tier notes & PDFs', ok: true },
            { text: 'Plus video lectures', ok: true },
            { text: 'Plus PYQ papers', ok: true },
            { text: 'Full mock test access', ok: true },
            { text: 'Books & resources', ok: true },
            { text: 'Pro-tier content', ok: false },
            { text: 'Priority 1-on-1 support', ok: false },
        ],
        sortOrder: 2,
        isActive: true
    },
    {
        planId: 'pro',
        name: 'Pro',
        tagline: 'Unlock everything. Dominate.',
        price: 499,
        priceSuffix: '/month',
        priceLabel: '₹499 / month',
        accent: '#f59e0b',
        accentBg: '#fffbeb',
        badge: 'Best Value',
        ribbon: false,
        contentAccess: 'All content — Free + Plus + Pro',
        features: [
            { text: 'Everything in Plus', ok: true },
            { text: 'Pro-tier notes & PDFs', ok: true },
            { text: 'Pro video lectures', ok: true },
            { text: 'Pro PYQ & model papers', ok: true },
            { text: 'Exclusive Pro mock tests', ok: true },
            { text: 'All books & resources', ok: true },
            { text: 'Book mentor calls (priority)', ok: true },
            { text: 'Priority 1-on-1 support', ok: true },
        ],
        sortOrder: 3,
        isActive: true
    },
];

export async function POST(req) {
    try {
        const decoded = verifyUser(req);
        if (!decoded) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        await connectToMongo();
        const user = await User.findById(decoded._id);
        if (!user || user.Role !== 'Admin') {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Delete existing ones to prevent duplicates or refresh them
        await Plan.deleteMany({ planId: { $in: ['e0', 'plus', 'pro'] } });

        // Insert default plans
        await Plan.insertMany(DEFAULT_PLANS);

        return NextResponse.json({ success: true, message: 'Default plans created successfully' });
    } catch (e) {
        console.error("Seed error:", e);
        return NextResponse.json({ success: false, message: e.message }, { status: 500 });
    }
}
