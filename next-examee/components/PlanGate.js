"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { canAccess, TIER_LABELS } from '../utils/planAccess';

/* ─── Small tier badge (shown on every card) ──────────────────────────────── */
export function TierBadge({ tier = 'free', style = {} }) {
    const meta = TIER_LABELS[tier] || TIER_LABELS.free;

    // Gradient definitions for icons
    const iconGradients = {
        free: 'linear-gradient(135deg, #04bd20 0%, #059669 100%)',
        plus: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
        pro: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)'
    };

    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: '0.6rem', fontStyle: 'normal', fontWeight: 800,
            letterSpacing: '0.04em',
            padding: '3px 10px', borderRadius: 20,
            background: meta.bg, color: meta.color,
            border: `1px solid ${meta.color}40`,
            textTransform: 'uppercase',
            boxShadow: `0 2px 4px ${meta.color}15`,
            ...style,
        }}>
            <i className={`fa-solid ${tier === 'free' ? 'fa-bolt' : tier === 'plus' ? 'fa-star' : 'fa-crown'}`}
                style={{
                    fontSize: '0.65rem',
                    background: iconGradients[tier],
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }} />
            {meta.short}
        </span>
    );
}

/* ─── Lock overlay (wraps any card) ──────────────────────────────────────── */
export function PlanGate({ userPlan = 'e0', contentTier = 'free', children }) {
    const router = useRouter();
    const allowed = canAccess(userPlan, contentTier);
    const meta = TIER_LABELS[contentTier] || TIER_LABELS.free;

    if (allowed) return children;

    return (
        <div style={{ position: 'relative', borderRadius: 'inherit' }}>
            {/* Sharper content underneath - NO BLUR */}
            <div style={{ pointerEvents: 'none', userSelect: 'none' }}>
                {children}
            </div>

            {/* Premium Lock overlay */}
            <div
                onClick={() => router.push('/plans')}
                style={{
                    position: 'absolute', inset: 0, borderRadius: 'inherit',
                    background: 'rgba(15, 23, 42, 0.3)', // Subtle dark tint
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', gap: 12, zIndex: 5,
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    backdropFilter: 'grayscale(0.4) contrast(1.1) blur(0px)',
                }}
                className="plan-gate-overlay"
                title="Upgrade to unlock"
            >
                <div style={{
                    width: 54, height: 54, borderRadius: 18,
                    background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 10px 25px -5px ${meta.color}40, 0 8px 10px -6px rgba(0,0,0,0.1)`,
                    position: 'relative'
                }}>
                    {/* The Crown Icon with Gradient */}
                    <i className="fa-solid fa-crown" style={{
                        fontSize: '1.6rem',
                        background: contentTier === 'pro'
                            ? 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)' // Gold/Amber
                            : 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', // Purple/Violet
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }} />

                    {/* Small lock indicator */}
                    <div style={{
                        position: 'absolute', bottom: -4, right: -4,
                        width: 22, height: 22, borderRadius: '50%',
                        background: '#1e293b', border: '2px solid #fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '0.7rem'
                    }}>
                        <i className="fa-solid fa-lock" />
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <p style={{
                        margin: 0, color: '#fff', fontWeight: 900, fontSize: '0.9rem',
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                        textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                    }}>
                        {meta.label} Access
                    </p>
                    <div style={{
                        marginTop: 10,
                        background: 'linear-gradient(135deg, #fff 0%, #f1f5f9 100%)',
                        color: meta.color,
                        fontSize: '0.72rem', fontWeight: 800,
                        padding: '7px 20px', borderRadius: 20,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        display: 'inline-flex', alignItems: 'center', gap: 6
                    }}>
                        UNLOCK NOW <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.65rem' }} />
                    </div>
                </div>
            </div>

            <style jsx>{`
                .plan-gate-overlay:hover {
                    background: rgba(15, 23, 42, 0.35) !important;
                }
                .plan-gate-overlay:hover div {
                    transform: scale(1.05);
                }
            `}</style>
        </div>
    );
}
