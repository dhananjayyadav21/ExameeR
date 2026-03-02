"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { canAccess, TIER_LABELS } from '../utils/planAccess';

/* ─── Small tier badge (shown on every card) ──────────────────────────────── */
export function TierBadge({ tier = 'free', style = {} }) {
    const meta = TIER_LABELS[tier] || TIER_LABELS.free;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.06em',
            padding: '2px 8px', borderRadius: 20,
            background: meta.bg, color: meta.color,
            border: `1px solid ${meta.color}30`,
            textTransform: 'uppercase',
            ...style,
        }}>
            <i className={`fa-solid ${tier === 'free' ? 'fa-bolt' : tier === 'plus' ? 'fa-star' : 'fa-crown'}`}
                style={{ fontSize: '0.55rem' }} />
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
                    background: 'rgba(15, 23, 42, 0.25)', // Subtle dark tint
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', gap: 12, zIndex: 5,
                    transition: 'all 0.2s',
                    backdropFilter: 'grayscale(0.3) contrast(1.1)', // Slight aesthetic tint without blurring
                }}
                className="plan-gate-overlay"
                title="Upgrade to unlock"
            >
                <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    color: meta.color,
                }}>
                    <i className="fa-solid fa-lock" style={{ fontSize: '1.2rem' }} />
                </div>

                <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: 0, color: '#fff', fontWeight: 900, fontSize: '0.85rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                        {meta.label} Plan required
                    </p>
                    <div style={{
                        marginTop: 8,
                        background: meta.color, color: '#fff',
                        fontSize: '0.7rem', fontWeight: 800,
                        padding: '6px 18px', borderRadius: 20,
                        boxShadow: `0 4px 12px ${meta.color}50`,
                        display: 'inline-block'
                    }}>
                        UPGRADE NOW →
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
