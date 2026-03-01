"use client";
import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StudentLayout from '../../components/Home/StudentLayout';
import ContentContext from '../../context/ContentContext';
import Link from 'next/link';

const FALLBACK_PLANS = [
    {
        id: 'e0',
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
    },
    {
        id: 'plus',
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
    },
    {
        id: 'pro',
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
    },
];

const ACCESS_TABLE = [
    { tier: 'Free content', e0: true, plus: true, pro: true },
    { tier: 'Plus content', e0: false, plus: true, pro: true },
    { tier: 'Pro content', e0: false, plus: false, pro: true },
];

export default function PlansPage() {
    const router = useRouter();
    const { userData } = useContext(ContentContext);
    const userPlan = userData?.Plan || 'e0';
    const [hovered, setHovered] = useState(null);
    const [plans, setPlans] = useState(FALLBACK_PLANS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const r = await fetch('/api/plans');
                const d = await r.json();
                if (d.success && d.plans?.length > 0) {
                    setPlans(d.plans.map(p => ({ ...p, id: p.planId })));
                }
            } catch (e) {
                console.error("Plan load error:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleSelect = (plan) => {
        if (plan.id === 'e0') return; // already free
        if (plan.id === userPlan) return; // already on this plan
        router.push(`/plan-detail?plan=${plan.id}`);
    };

    if (loading) return (
        <StudentLayout title="Plans">
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <div className="spinner-border text-success" />
                <p style={{ marginTop: 12, color: '#64748b', fontWeight: 600 }}>Loading plans...</p>
            </div>
        </StudentLayout>
    );

    return (
        <StudentLayout title="Plans">
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 4px 60px' }}>

                {/* ── Header ── */}
                <div style={{ textAlign: 'center', marginBottom: 48 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: '5px 16px', marginBottom: 16 }}>
                        <i className="fa-solid fa-crown" style={{ color: '#04bd20', fontSize: '0.75rem' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#04bd20' }}>Examee Plans</span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, color: '#0f172a', margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                        Choose the plan that&apos;s right for you
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: 520, margin: '0 auto', fontWeight: 500 }}>
                        All students start on E0 Free. Upgrade anytime to unlock more content and features.
                    </p>
                    {/* Current plan badge */}
                    <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 20, padding: '6px 16px' }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Current plan:</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: plans.find(p => p.id === userPlan)?.accent || '#04bd20' }}>
                            {plans.find(p => p.id === userPlan)?.name || 'E0 Free'}
                        </span>
                    </div>
                </div>

                {/* ── Plan Cards ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 52 }}>
                    {plans.map(plan => {
                        const isCurrentPlan = plan.id === userPlan;
                        const isHover = hovered === plan.id;
                        const isFeatured = plan.ribbon;
                        return (
                            <div key={plan.id}
                                onMouseEnter={() => setHovered(plan.id)}
                                onMouseLeave={() => setHovered(null)}
                                style={{
                                    background: '#fff',
                                    borderRadius: 20,
                                    border: `2px solid ${isCurrentPlan ? plan.accent : isFeatured ? `${plan.accent}60` : '#e2e8f0'}`,
                                    boxShadow: isHover || isFeatured ? `0 16px 48px ${plan.accent}22` : '0 2px 12px rgba(0,0,0,0.05)',
                                    transform: isHover ? 'translateY(-6px)' : 'translateY(0)',
                                    transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
                                    position: 'relative', overflow: 'hidden',
                                    display: 'flex', flexDirection: 'column',
                                }}>

                                {/* Top accent bar */}
                                <div style={{ height: 4, background: `linear-gradient(90deg, ${plan.accent}, ${plan.accent}80)` }} />

                                {/* Popular badge */}
                                {plan.badge && (
                                    <div style={{ position: 'absolute', top: 16, right: 16, background: plan.accent, color: '#fff', fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.08em', padding: '4px 10px', borderRadius: 20 }}>
                                        {plan.badge.toUpperCase()}
                                    </div>
                                )}

                                <div style={{ padding: '24px 24px 0' }}>
                                    {/* Icon */}
                                    <div style={{ width: 44, height: 44, borderRadius: 12, background: plan.accentBg || `${plan.accent}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                                        <i className={`fa-solid ${plan.id === 'e0' ? 'fa-bolt' : plan.id === 'plus' ? 'fa-star' : 'fa-crown'}`} style={{ color: plan.accent, fontSize: '1.1rem' }} />
                                    </div>

                                    <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', color: plan.accent, margin: '0 0 4px', textTransform: 'uppercase' }}>{plan.id === 'e0' ? 'E0 FREE' : plan.id.toUpperCase()}</p>
                                    <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>{plan.name}</h2>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0 0 18px', fontWeight: 500 }}>{plan.tagline}</p>

                                    {/* Price */}
                                    <div style={{ marginBottom: 20 }}>
                                        {plan.price === 0 ? (
                                            <p style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Free</p>
                                        ) : (
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                                                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b' }}>₹</span>
                                                <span style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>{plan.price}</span>
                                                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>{plan.priceSuffix || '/month'}</span>
                                            </div>
                                        )}
                                        <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: plan.accent, fontWeight: 700 }}>
                                            <i className="fa-solid fa-shield-halved me-1" />
                                            {plan.contentAccess || 'Standard Content Access'}
                                        </p>
                                    </div>

                                    {/* CTA */}
                                    <button
                                        onClick={() => handleSelect(plan)}
                                        disabled={isCurrentPlan}
                                        style={{
                                            width: '100%', padding: '12px', borderRadius: 12, border: 'none',
                                            background: isCurrentPlan ? '#f1f5f9' : `linear-gradient(135deg, ${plan.accent}, ${plan.accent}cc)`,
                                            color: isCurrentPlan ? '#94a3b8' : '#fff',
                                            fontWeight: 800, fontSize: '0.88rem', cursor: isCurrentPlan ? 'default' : 'pointer',
                                            boxShadow: !isCurrentPlan ? `0 4px 16px ${plan.accent}40` : 'none',
                                            transition: 'all 0.2s',
                                            marginBottom: 20,
                                        }}>
                                        {isCurrentPlan ? '✓ Current Plan' : plan.price === 0 ? 'Get Started Free' : `Upgrade to ${plan.name}`}
                                    </button>
                                </div>

                                {/* Features */}
                                <div style={{ padding: '0 24px 24px', borderTop: '1px solid #f1f5f9', paddingTop: 16, flex: 1 }}>
                                    <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 12px' }}>What&apos;s included</p>
                                    {plan.features.map((f, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 9, opacity: f.ok ? 1 : 0.4 }}>
                                            <div style={{ width: 18, height: 18, borderRadius: 5, background: f.ok ? (plan.accentBg || `${plan.accent}10`) : '#f8fafc', border: `1px solid ${f.ok ? plan.accent + '40' : '#e2e8f0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <i className={`fa-solid ${f.ok ? 'fa-check' : 'fa-xmark'}`} style={{ fontSize: '0.6rem', color: f.ok ? plan.accent : '#94a3b8' }} />
                                            </div>
                                            <span style={{ fontSize: '0.8rem', fontWeight: f.ok ? 600 : 400, color: f.ok ? '#374151' : '#94a3b8' }}>{f.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Access Table ── */}
                <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: 40 }}>
                    <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #f1f5f9' }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                            <i className="fa-solid fa-table-cells me-2" style={{ color: '#04bd20' }} />
                            Content Access by Plan
                        </h3>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc' }}>
                                    <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 700, color: '#64748b', width: '40%' }}>Content Tier</th>
                                    {plans.map(p => (
                                        <th key={p.id} style={{ padding: '12px 20px', textAlign: 'center', fontWeight: 800, color: p.accent }}>
                                            {p.name}
                                            {p.id === userPlan && <span style={{ display: 'block', fontSize: '0.6rem', fontWeight: 700, color: p.accent, opacity: 0.75 }}>← Your Plan</span>}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {ACCESS_TABLE.map((row, i) => (
                                    <tr key={row.tier} style={{ borderTop: '1px solid #f1f5f9', background: i % 2 === 1 ? '#fafafa' : '#fff' }}>
                                        <td style={{ padding: '13px 20px', fontWeight: 600, color: '#374151' }}>{row.tier}</td>
                                        {plans.map(p => {
                                            const ok = row[p.id] !== undefined ? row[p.id] : (p.id === 'pro' ? true : (p.id === 'plus' && row.tier !== 'Pro content'));
                                            return (
                                                <td key={p.id} style={{ padding: '13px 20px', textAlign: 'center' }}>
                                                    <div style={{ width: 24, height: 24, borderRadius: 6, background: ok ? `${p.accent}18` : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
                                                        <i className={`fa-solid ${ok ? 'fa-check' : 'fa-xmark'}`} style={{ color: ok ? p.accent : '#cbd5e1', fontSize: '0.75rem' }} />
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── FAQ note ── */}
                <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
                    <i className="fa-solid fa-lock me-2" />
                    Locked content shows a lock badge — upgrade your plan to unlock it instantly.
                    <Link href="/contact" style={{ color: '#04bd20', fontWeight: 700, marginLeft: 8 }}>Contact Us</Link>
                </div>
            </div>
        </StudentLayout>
    );
}
