"use client";
import React, { useState, useEffect, Suspense } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

/* ─── Responsive hook ─────────────────────────────────────────────────────── */
function useWindowWidth() {
    const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    useEffect(() => {
        const handler = () => setW(window.innerWidth);
        window.addEventListener('resize', handler);
        return () => window.removeEventListener('resize', handler);
    }, []);
    return w;
}

const PRESET_COLORS = ['#04bd20', '#8b5cf6', '#f59e0b', '#0ea5e9', '#ef4444', '#0f172a', '#ec4899', '#06b6d4'];
const EMPTY_PLAN = {
    planId: '', name: '', tagline: '', price: 0, priceSuffix: '/month', priceLabel: '',
    accent: '#04bd20', accentBg: '#f0fdf4', badge: '', ribbon: false,
    contentAccess: '', features: [{ text: '', ok: true }], isActive: true, sortOrder: 0
};

export default function PlansAdminPage() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editPlan, setEditPlan] = useState(null);
    const [saving, setSaving] = useState(false);

    const w = useWindowWidth();
    const isMobile = w < 640;
    const isTablet = w < 900;
    const router = useRouter();

    const getAuthHdr = () => ({
        'Content-Type': 'application/json',
        AuthToken: localStorage.getItem('token') || '',
    });

    const load = async () => {
        setLoading(true);
        try {
            const r = await fetch('/api/plans?admin=1');
            const d = await r.json();
            if (d.success) setPlans(d.plans);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editPlan?._id ? `/api/plans/${editPlan._id}` : '/api/plans';
            const method = editPlan?._id ? 'PUT' : 'POST';
            const r = await fetch(url, {
                method,
                headers: getAuthHdr(),
                body: JSON.stringify(editPlan || EMPTY_PLAN)
            });
            const d = await r.json();
            if (d.success) {
                toast.success(editPlan?._id ? 'Plan updated!' : 'Plan created!');
                setShowForm(false);
                setEditPlan(null);
                load();
            } else {
                toast.error(d.message || 'Failed to save');
            }
        } catch (e) { toast.error('Something went wrong'); }
        setSaving(false);
    };

    const deletePlan = async (id) => {
        if (!confirm('Permanently delete this plan?')) return;
        try {
            const r = await fetch(`/api/plans/${id}`, { method: 'DELETE', headers: getAuthHdr() });
            const d = await r.json();
            if (d.success) { toast.success('Plan deleted'); load(); }
            else toast.error(d.message);
        } catch (e) { toast.error('Delete failed'); }
    };

    const handleSeed = async () => {
        if (!confirm('This will restore the 3 default plans (E0, Plus, Pro). Continue?')) return;
        setLoading(true);
        try {
            const r = await fetch('/api/plans/seed', { method: 'POST', headers: getAuthHdr() });
            const d = await r.json();
            if (d.success) {
                toast.success('Default plans restored!');
                load();
            } else {
                toast.error(d.message);
            }
        } catch (e) { toast.error('Seeding failed'); }
        setLoading(false);
    };

    const toggleActive = async (p) => {
        try {
            const r = await fetch(`/api/plans/${p._id}`, {
                method: 'PUT',
                headers: getAuthHdr(),
                body: JSON.stringify({ isActive: !p.isActive })
            });
            const d = await r.json();
            if (d.success) { toast.success(`Plan ${!p.isActive ? 'activated' : 'paused'}`); load(); }
        } catch (e) { toast.error('Update failed'); }
    };

    const cardBox = { background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' };

    return (
        <div style={{ margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
                <div>
                    <h1 style={{ fontSize: isMobile ? '1.1rem' : '1.3rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 36, height: 36, borderRadius: 10, background: '#fffbeb', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fa-solid fa-crown" style={{ color: '#f59e0b', fontSize: '1rem' }} />
                        </span>
                        Manage Subscription Plans
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.78rem', margin: '6px 0 0', fontWeight: 550 }}>
                        Create and edit membership tiers, pricing, and features available to students
                    </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={handleSeed} style={{
                        padding: '10px 18px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff',
                        color: '#64748b', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem'
                    }}>
                        <i className="fa-solid fa-seedling" /> Reset to Defaults
                    </button>
                    <button onClick={() => { setShowForm(true); setEditPlan(EMPTY_PLAN); }} style={{
                        padding: '10px 20px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#04bd20,#029d1a)',
                        color: '#fff', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem'
                    }}>
                        <i className="fa-solid fa-plus" /> New Plan
                    </button>
                </div>
            </div>

            {/* Form */}
            {showForm && (
                <div style={{ ...cardBox, padding: 26, marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900 }}>{editPlan?._id ? 'Edit Plan' : 'Create New Plan'}</h3>
                        <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                            <i className="fa-solid fa-xmark fs-5" />
                        </button>
                    </div>
                    <form onSubmit={handleSave} className="row g-4">
                        <div className="col-md-6 text-start">
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: 8, display: 'block' }}>PLAN ID (SYSTEM)</label>
                            <input type="text" value={editPlan.planId} onChange={(e) => setEditPlan({ ...editPlan, planId: e.target.value.toLowerCase() })}
                                placeholder="e.g. basic, plus, pro" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', outline: 'none' }} required />
                        </div>
                        <div className="col-md-6 text-start">
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: 8, display: 'block' }}>PLAN NAME</label>
                            <input type="text" value={editPlan.name} onChange={(e) => setEditPlan({ ...editPlan, name: e.target.value })}
                                placeholder="e.g. Pro Membership" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', outline: 'none' }} required />
                        </div>
                        <div className="col-md-4 text-start">
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: 8, display: 'block' }}>PRICE (₹)</label>
                            <input type="number" value={editPlan.price} onChange={(e) => setEditPlan({ ...editPlan, price: parseInt(e.target.value) })}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', outline: 'none' }} required />
                        </div>
                        <div className="col-md-4 text-start">
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: 8, display: 'block' }}>BADGE (OPTIONAL)</label>
                            <input type="text" value={editPlan.badge} onChange={(e) => setEditPlan({ ...editPlan, badge: e.target.value })}
                                placeholder="e.g. Popular" style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', outline: 'none' }} />
                        </div>
                        <div className="col-md-4 text-start">
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: 8, display: 'block' }}>ORDER</label>
                            <input type="number" value={editPlan.sortOrder} onChange={(e) => setEditPlan({ ...editPlan, sortOrder: parseInt(e.target.value) })}
                                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e2e8f0', outline: 'none' }} />
                        </div>
                        <div className="col-md-6 text-start">
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: 8, display: 'block' }}>ACCENT COLOR</label>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {PRESET_COLORS.map(c => (
                                    <div key={c} onClick={() => setEditPlan({ ...editPlan, accent: c })} style={{
                                        width: 32, height: 32, borderRadius: '50%', background: c, cursor: 'pointer',
                                        border: editPlan.accent === c ? '3px solid #000' : 'none'
                                    }} />
                                ))}
                            </div>
                        </div>

                        <div className="col-12 text-start">
                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', marginBottom: 12, display: 'block' }}>FEATURES</label>
                            {editPlan.features.map((f, i) => (
                                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                                    <input type="text" value={f.text} onChange={(e) => {
                                        const n = [...editPlan.features];
                                        n[i].text = e.target.value;
                                        setEditPlan({ ...editPlan, features: n });
                                    }} placeholder="Feature text" style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1.5px solid #e2e8f0', outline: 'none' }} />
                                    <button type="button" onClick={() => {
                                        const n = [...editPlan.features]; n.splice(i, 1); setEditPlan({ ...editPlan, features: n });
                                    }} style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 8, width: 40, color: '#ef4444' }}>
                                        <i className="fa-solid fa-trash-can" />
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={() => setEditPlan({ ...editPlan, features: [...editPlan.features, { text: '', ok: true }] })}
                                style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#04bd20', borderRadius: 8, padding: '8px 16px', fontSize: '0.8rem', fontWeight: 700 }}>
                                + Add Feature
                            </button>
                        </div>

                        <div className="col-12 d-flex justify-content-end gap-3 pt-3">
                            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 24px', borderRadius: 10, border: '1px solid #e2e8f0', background: 'none', fontWeight: 700 }}>Cancel</button>
                            <button type="submit" disabled={saving} style={{ padding: '10px 32px', borderRadius: 10, border: 'none', background: '#0f172a', color: '#fff', fontWeight: 800 }}>
                                {saving ? 'Saving...' : 'Save Plan'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner-border text-success" /></div>
            ) : plans.length === 0 ? (
                <div style={{ ...cardBox, padding: 60, textAlign: 'center' }}>
                    <i className="fa-solid fa-layer-group fs-1 text-muted opacity-25" />
                    <p style={{ marginTop: 16, color: '#64748b', fontWeight: 600 }}>No plans found. Create your first subscription tier.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
                    {plans.map(p => (
                        <div key={p._id} style={{ ...cardBox, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ height: 6, background: p.accent }} />
                            <div style={{ padding: 20 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                    <div>
                                        <h4 style={{ margin: 0, fontWeight: 900, fontSize: '1.1rem' }}>{p.name}</h4>
                                        <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '0.75rem', fontWeight: 600 }}>{p.planId.toUpperCase()}</p>
                                    </div>
                                    <div style={{ display: 'flex', gap: 6 }}>
                                        {p.badge && <span style={{ background: `${p.accent}15`, color: p.accent, fontSize: '0.65rem', fontWeight: 800, padding: '3px 10px', borderRadius: 50 }}>{p.badge}</span>}
                                        <span style={{ background: p.isActive ? '#f0fdf4' : '#f8fafc', color: p.isActive ? '#04bd20' : '#94a3b8', fontSize: '0.65rem', fontWeight: 800, padding: '3px 10px', borderRadius: 50 }}>
                                            {p.isActive ? 'ACTIVE' : 'PAUSED'}
                                        </span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 16 }}>
                                    <span style={{ fontSize: '1.4rem', fontWeight: 900 }}>₹{p.price}</span>
                                    <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>/month</span>
                                </div>
                                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16, marginBottom: 20 }}>
                                    {p.features.slice(0, 3).map((f, i) => (
                                        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, fontSize: '0.78rem' }}>
                                            <i className="fa-solid fa-check text-success" />
                                            <span style={{ color: '#475569' }}>{f.text}</span>
                                        </div>
                                    ))}
                                    {p.features.length > 3 && <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: 0 }}>+ {p.features.length - 3} more features</p>}
                                </div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button onClick={() => { setEditPlan(p); setShowForm(true); }} style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>Edit</button>
                                    <button onClick={() => toggleActive(p)} style={{ width: 44, borderRadius: 10, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer' }}>
                                        <i className={`fa-solid ${p.isActive ? 'fa-pause text-warning' : 'fa-play text-success'}`} />
                                    </button>
                                    <button onClick={() => deletePlan(p._id)} style={{ width: 44, borderRadius: 10, border: '1.5px solid #fecaca', background: '#fff', cursor: 'pointer' }}>
                                        <i className="fa-solid fa-trash-can text-danger" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
