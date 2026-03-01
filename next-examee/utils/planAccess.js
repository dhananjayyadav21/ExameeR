/**
 * planAccess.js
 * Shared utility for plan-based access control.
 *
 * Plans:
 *   e0   → free tier  (default for all users)
 *   plus → Plus plan
 *   pro  → Pro plan
 *
 * Content tiers:
 *   free → accessible to E0, Plus, Pro
 *   plus → accessible to Plus and Pro
 *   pro  → accessible to Pro only
 */

export const PLAN_HIERARCHY = { e0: 0, plus: 1, pro: 2 };
export const TIER_HIERARCHY = { free: 0, plus: 1, pro: 2 };

/**
 * Returns true if the user's plan can access the given content tier.
 * @param {string} userPlan   - 'e0' | 'plus' | 'pro'
 * @param {string} contentTier - 'free' | 'plus' | 'pro'
 */
export function canAccess(userPlan = 'e0', contentTier = 'free') {
    const planLevel = PLAN_HIERARCHY[userPlan] ?? 0;
    const tierLevel = TIER_HIERARCHY[contentTier] ?? 0;
    return planLevel >= tierLevel;
}

export const TIER_LABELS = {
    free: { label: 'Free', short: 'E0', color: '#04bd20', bg: '#f0fdf4' },
    plus: { label: 'Plus', short: 'Plus', color: '#8b5cf6', bg: '#faf5ff' },
    pro: { label: 'Pro', short: 'Pro', color: '#f59e0b', bg: '#fffbeb' },
};

export const PLAN_LABELS = {
    e0: { label: 'E0 Free', color: '#04bd20' },
    plus: { label: 'Plus', color: '#8b5cf6' },
    pro: { label: 'Pro', color: '#f59e0b' },
};
