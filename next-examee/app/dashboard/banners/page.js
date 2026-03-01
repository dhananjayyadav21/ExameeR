"use client";
import React, { useState, useEffect, Suspense } from "react";
import { toast } from "react-toastify";

const TYPES = [
    { value: 'offer', label: '🏷️ Offer', color: '#f59e0b' },
    { value: 'new', label: '🚀 New Launch', color: '#8b5cf6' },
    { value: 'announcement', label: '📢 Announcement', color: '#0ea5e9' },
    { value: 'alert', label: '⚠️ Alert', color: '#ef4444' },
];

const PAGE_OPTIONS = [
    { value: 'all', label: 'All Pages' },
    { value: 'notes', label: 'Notes Page' },
    { value: 'pyq', label: 'PYQ Page' },
    { value: 'course', label: 'Course Page' },
];

const EMPTY_FORM = {
    title: '', subtitle: '', type: 'announcement', link: '', linkLabel: 'View Now',
    pages: ['all'], bgColor: '#0ea5e9', isActive: true, expiresAt: '',
};

function BannerForm({ initial = EMPTY_FORM, onSave, onCancel, saving }) {
    const [form, setForm] = useState(initial);

    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
    const togglePage = (p) => {
        if (p === 'all') { set('pages', ['all']); return; }
        const current = form.pages.filter(x => x !== 'all');
        if (current.includes(p)) {
            const next = current.filter(x => x !== p);
            set('pages', next.length ? next : ['all']);
        } else {
            set('pages', [...current, p]);
        }
    };

    const typeColor = TYPES.find(t => t.value === form.type)?.color || '#0ea5e9';

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Preview */}
            <div style={{
                background: `linear-gradient(135deg, ${form.bgColor}ee, ${form.bgColor}bb)`,
                borderRadius: '12px', padding: '14px 18px',
                boxShadow: `0 4px 20px ${form.bgColor}40`,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 800, color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 20 }}>
                        {TYPES.find(t => t.value === form.type)?.label || 'BANNER'}
                    </span>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem' }}>{form.title || 'Banner Title Preview'}</span>
                </div>
                {form.subtitle && <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem' }}>{form.subtitle}</p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div style={{ gridColumn: '1/-1' }}>
                    <label style={lbl}>Title *</label>
                    <input style={inp} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. 50% Off Premium Notes Pack!" required />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                    <label style={lbl}>Subtitle</label>
                    <input style={inp} value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Optional extra detail" />
                </div>
                <div>
                    <label style={lbl}>Type</label>
                    <select style={inp} value={form.type} onChange={e => set('type', e.target.value)}>
                        {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                </div>
                <div>
                    <label style={lbl}>Background Color</label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input type="color" value={form.bgColor} onChange={e => set('bgColor', e.target.value)}
                            style={{ width: 44, height: 38, border: '1.5px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', padding: 2 }} />
                        <input style={{ ...inp, flex: 1 }} value={form.bgColor} onChange={e => set('bgColor', e.target.value)} placeholder="#04bd20" />
                        <div style={{ display: 'flex', gap: 6 }}>
                            {['#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#04bd20', '#0f172a'].map(c => (
                                <div key={c} onClick={() => set('bgColor', c)} title={c}
                                    style={{ width: 22, height: 22, borderRadius: 6, background: c, cursor: 'pointer', border: form.bgColor === c ? '2.5px solid #0f172a' : '2px solid transparent' }} />
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <label style={lbl}>Link URL (on click)</label>
                    <input style={inp} value={form.link} onChange={e => set('link', e.target.value)} placeholder="/courses or https://..." />
                </div>
                <div>
                    <label style={lbl}>Button Label</label>
                    <input style={inp} value={form.linkLabel} onChange={e => set('linkLabel', e.target.value)} placeholder="View Now" />
                </div>
                <div>
                    <label style={lbl}>Expires At (blank = never)</label>
                    <input type="datetime-local" style={inp} value={form.expiresAt}
                        onChange={e => set('expiresAt', e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>
                        <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)}
                            style={{ width: 16, height: 16, accentColor: '#04bd20' }} />
                        Active (visible to students)
                    </label>
                </div>
            </div>

            {/* Target pages */}
            <div>
                <label style={lbl}>Show On Pages</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {PAGE_OPTIONS.map(p => {
                        const active = form.pages.includes(p.value);
                        return (
                            <button key={p.value} type="button" onClick={() => togglePage(p.value)}
                                style={{
                                    padding: '6px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700,
                                    border: `1.5px solid ${active ? '#04bd20' : '#e2e8f0'}`,
                                    background: active ? '#f0fdf4' : '#f8fafc',
                                    color: active ? '#04bd20' : '#64748b',
                                    cursor: 'pointer', transition: 'all 0.15s',
                                }}>
                                {p.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8 }}>
                <button type="button" onClick={onCancel}
                    style={{ padding: '9px 20px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: 'transparent', color: '#64748b', fontWeight: 700, cursor: 'pointer' }}>
                    Cancel
                </button>
                <button type="button" onClick={() => onSave(form)} disabled={saving || !form.title}
                    style={{
                        padding: '9px 22px', borderRadius: 10, border: 'none',
                        background: '#04bd20', color: '#fff', fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer',
                        opacity: saving || !form.title ? 0.6 : 1, display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                    {saving ? <span style={spinnerStyle}></span> : <i className="fa-solid fa-floppy-disk"></i>}
                    {saving ? 'Saving...' : 'Save Banner'}
                </button>
            </div>
        </div>
    );
}

function BannersContent() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editBanner, setEditBanner] = useState(null);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    const authHdr = { 'Content-Type': 'application/json', 'AuthToken': token };

    const load = async () => {
        setLoading(true);
        const r = await fetch('/api/banner');
        const d = await r.json();
        if (d.success) setBanners(d.banners);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const handleSave = async (form) => {
        setSaving(true);
        try {
            const payload = { ...form, expiresAt: form.expiresAt || null };
            let res;
            if (editBanner) {
                res = await fetch(`/api/banner/${editBanner._id}`, { method: 'PUT', headers: authHdr, body: JSON.stringify(payload) });
            } else {
                res = await fetch('/api/banner', { method: 'POST', headers: authHdr, body: JSON.stringify(payload) });
            }
            const d = await res.json();
            if (d.success) {
                toast.success(editBanner ? 'Banner updated!' : 'Banner created!');
                setShowForm(false); setEditBanner(null);
                load();
            } else {
                toast.error(d.message || 'Failed to save');
            }
        } catch { toast.error('Something went wrong'); }
        setSaving(false);
    };

    const toggleActive = async (b) => {
        const r = await fetch(`/api/banner/${b._id}`, { method: 'PUT', headers: authHdr, body: JSON.stringify({ isActive: !b.isActive }) });
        const d = await r.json();
        if (d.success) { toast.success(`Banner ${!b.isActive ? 'activated' : 'deactivated'}`); load(); }
    };

    const deleteBanner = async (id) => {
        if (!confirm('Delete this banner?')) return;
        const r = await fetch(`/api/banner/${id}`, { method: 'DELETE', headers: authHdr });
        const d = await r.json();
        if (d.success) { toast.success('Banner deleted'); load(); }
        else toast.error(d.message);
    };

    const TYPE_META = {
        offer: { icon: 'fa-tag', label: 'Offer', color: '#f59e0b' },
        new: { icon: 'fa-rocket', label: 'New', color: '#8b5cf6' },
        announcement: { icon: 'fa-bullhorn', label: 'Announce', color: '#0ea5e9' },
        alert: { icon: 'fa-triangle-exclamation', label: 'Alert', color: '#ef4444' },
    };

    return (
        <div style={{ padding: '28px 24px', maxWidth: 900, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                        <i className="fa-solid fa-rectangle-ad me-2" style={{ color: '#04bd20' }}></i>
                        Banners & Announcements
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.82rem', margin: '4px 0 0' }}>
                        Manage promotional banners shown on Notes, PYQ, and Course pages
                    </p>
                </div>
                <button onClick={() => { setShowForm(true); setEditBanner(null); }}
                    style={{ padding: '10px 18px', borderRadius: 12, border: 'none', background: '#04bd20', color: '#fff', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                    <i className="fa-solid fa-plus"></i> New Banner
                </button>
            </div>

            {/* Form modal */}
            {showForm && (
                <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #e2e8f0', boxShadow: '0 8px 40px rgba(0,0,0,0.09)', marginBottom: 24 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: 18 }}>
                        {editBanner ? '✏️ Edit Banner' : '✨ Create New Banner'}
                    </h3>
                    <BannerForm
                        initial={editBanner ? {
                            ...editBanner,
                            expiresAt: editBanner.expiresAt ? new Date(editBanner.expiresAt).toISOString().slice(0, 16) : '',
                        } : undefined}
                        onSave={handleSave}
                        onCancel={() => { setShowForm(false); setEditBanner(null); }}
                        saving={saving}
                    />
                </div>
            )}

            {/* Banner list */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
                    <div style={spinnerStyle}></div>
                    <p style={{ marginTop: 12 }}>Loading banners...</p>
                </div>
            ) : banners.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
                    <i className="fa-regular fa-rectangle-list" style={{ fontSize: '2.5rem', marginBottom: 12 }}></i>
                    <p style={{ fontWeight: 600 }}>No banners yet. Create your first one!</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {banners.map(b => {
                        const meta = TYPE_META[b.type] || TYPE_META.announcement;
                        return (
                            <div key={b._id} style={{
                                background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                                overflow: 'hidden', opacity: b.isActive ? 1 : 0.55,
                            }}>
                                {/* Color strip */}
                                <div style={{ height: 4, background: b.bgColor || meta.color }} />
                                <div style={{ padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'center' }}>
                                    {/* Icon */}
                                    <div style={{ width: 38, height: 38, borderRadius: 10, background: `${meta.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <i className={`fa-solid ${meta.icon}`} style={{ color: meta.color, fontSize: '1rem' }}></i>
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                            <span style={{ fontSize: '0.62rem', fontWeight: 800, color: meta.color, background: `${meta.color}15`, padding: '2px 8px', borderRadius: 20 }}>{meta.label.toUpperCase()}</span>
                                            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>{b.title}</span>
                                            {!b.isActive && <span style={{ fontSize: '0.62rem', background: '#f1f5f9', color: '#94a3b8', padding: '2px 8px', borderRadius: 20, fontWeight: 700 }}>PAUSED</span>}
                                        </div>
                                        {b.subtitle && <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b' }}>{b.subtitle}</p>}
                                        <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                                            {b.pages.map(p => (
                                                <span key={p} style={{ fontSize: '0.65rem', fontWeight: 700, color: '#475569', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1px 8px', borderRadius: 12 }}>{p}</span>
                                            ))}
                                            {b.link && <span style={{ fontSize: '0.65rem', color: '#04bd20', fontWeight: 700 }}>→ {b.link}</span>}
                                            {b.expiresAt && <span style={{ fontSize: '0.65rem', color: '#ef4444', fontWeight: 700 }}>⏰ Expires: {new Date(b.expiresAt).toLocaleDateString()}</span>}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                        <button onClick={() => toggleActive(b)} title={b.isActive ? 'Pause' : 'Activate'}
                                            style={{ ...actionBtn, background: b.isActive ? '#fef3c7' : '#f0fdf4', color: b.isActive ? '#d97706' : '#04bd20' }}>
                                            <i className={`fa-solid ${b.isActive ? 'fa-pause' : 'fa-play'}`}></i>
                                        </button>
                                        <button onClick={() => { setEditBanner(b); setShowForm(true); }} title="Edit"
                                            style={{ ...actionBtn, background: '#eff6ff', color: '#3b82f6' }}>
                                            <i className="fa-solid fa-pen"></i>
                                        </button>
                                        <button onClick={() => deleteBanner(b._id)} title="Delete"
                                            style={{ ...actionBtn, background: '#fff5f5', color: '#ef4444' }}>
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// Shared styles
const lbl = { fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: 6, display: 'block' };
const inp = { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '0.87rem', color: '#0f172a', background: '#f8fafc', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };
const actionBtn = { width: 34, height: 34, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700 };
const spinnerStyle = { width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' };

export default function BannersPage() {
    return (
        <Suspense fallback={<div style={{ padding: 24, color: '#94a3b8' }}>Loading...</div>}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <BannersContent />
        </Suspense>
    );
}
