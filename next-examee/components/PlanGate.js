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
            {/* Blurred-out content underneath */}
            <div style={{ filter: 'blur(2px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.55 }}>
                {children}
            </div>

            {/* Lock overlay */}
            <div
                onClick={() => router.push('/plans')}
                style={{
                    position: 'absolute', inset: 0, borderRadius: 'inherit',
                    background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(3px)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', gap: 8, zIndex: 2,
                    transition: 'background 0.2s',
                }}
                title="Upgrade to unlock"
            >
                <div style={{ width: 36, height: 36, borderRadius: 10, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 12px ${meta.color}30` }}>
                    <i className="fa-solid fa-lock" style={{ color: meta.color, fontSize: '0.9rem' }} />
                </div>
                <p style={{ margin: 0, color: '#fff', fontWeight: 800, fontSize: '0.75rem', textAlign: 'center', lineHeight: 1.3 }}>
                    {meta.label} Plan required
                </p>
                <div style={{ background: meta.color, color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '4px 14px', borderRadius: 20 }}>
                    Upgrade →
                </div>
            </div>
        </div>
    );
}
