"use client";
import React, { useState, useEffect, Suspense } from "react";
import { toast } from "react-toastify";

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

/* ─── Constants ───────────────────────────────────────────────────────────── */
const TYPES = [
    { value: 'offer', label: 'Offer', emoji: '🏷️', color: '#f59e0b', bg: '#fffbeb' },
    { value: 'new', label: 'New Launch', emoji: '🚀', color: '#8b5cf6', bg: '#faf5ff' },
    { value: 'announcement', label: 'Announcement', emoji: '📢', color: '#0ea5e9', bg: '#f0f9ff' },
    { value: 'alert', label: 'Alert', emoji: '⚠️', color: '#ef4444', bg: '#fff5f5' },
];
const PAGE_OPTIONS = [
    { value: 'all', label: 'All Pages', icon: 'fa-globe' },
    { value: 'notes', label: 'Notes', icon: 'fa-file-lines' },
    { value: 'pyq', label: 'PYQ', icon: 'fa-circle-question' },
    { value: 'course', label: 'Courses', icon: 'fa-book-open' },
    { value: 'video', label: 'Videos', icon: 'fa-circle-play' },
    { value: 'mock-test', label: 'Mock Tests', icon: 'fa-pen-to-square' },
    { value: 'books', label: 'Books', icon: 'fa-book' },
    { value: 'call-book', label: 'Book Calls', icon: 'fa-phone-volume' },
];
const PRESET_COLORS = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#04bd20', '#0f172a', '#ec4899', '#06b6d4'];
const EMPTY_FORM = {
    title: '', subtitle: '', type: 'announcement', link: '', linkLabel: 'View Now',
    pages: ['all'], bgColor: '#0ea5e9', isActive: true, expiresAt: '',
    bannerMode: 'text', imageUrl: '',
};

/* ─── Shared styles ───────────────────────────────────────────────────────── */
const lbl = { fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' };
const inp = { width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '0.87rem', color: '#0f172a', background: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };
const cardBox = { background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 1px 8px rgba(15,23,42,0.06)' };

/* ─── Live Preview ────────────────────────────────────────────────────────── */
function BannerPreview({ form }) {
    const typeMeta = TYPES.find(t => t.value === form.type) || TYPES[2];

    if (form.bannerMode === 'image' && form.imageUrl) {
        return (
            <div style={{ borderRadius: 14, overflow: 'hidden', position: 'relative', height: 160, boxShadow: '0 6px 24px rgba(0,0,0,0.15)' }}>
                <img src={form.imageUrl} alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
                {form.title && (
                    <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
                        <div>
                            <p style={{ margin: 0, color: '#fff', fontWeight: 800, fontSize: '1rem', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>{form.title}</p>
                            {form.subtitle && <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem' }}>{form.subtitle}</p>}
                        </div>
                        {form.link && <div style={{ background: 'rgba(255,255,255,0.22)', border: '1.5px solid rgba(255,255,255,0.4)', color: '#fff', fontSize: '0.73rem', fontWeight: 800, padding: '5px 12px', borderRadius: 8, whiteSpace: 'nowrap', flexShrink: 0 }}>{form.linkLabel || 'View Now'} →</div>}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div style={{ background: `linear-gradient(120deg,${form.bgColor}f0,${form.bgColor}c0)`, borderRadius: 14, padding: '16px 20px', boxShadow: `0 6px 24px ${form.bgColor}35`, display: 'flex', alignItems: 'center', gap: 14, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -40, top: -40, width: 140, height: 140, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{typeMeta.emoji}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: form.subtitle ? 3 : 0 }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.2)', padding: '2px 9px', borderRadius: 20 }}>{typeMeta.label.toUpperCase()}</span>
                    <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem' }}>{form.title || 'Banner Title Preview'}</span>
                </div>
                {form.subtitle && <p style={{ margin: 0, color: 'rgba(255,255,255,0.82)', fontSize: '0.78rem', fontWeight: 500 }}>{form.subtitle}</p>}
            </div>
            {form.link && <div style={{ background: 'rgba(255,255,255,0.22)', border: '1.5px solid rgba(255,255,255,0.38)', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '6px 14px', borderRadius: 8, whiteSpace: 'nowrap', flexShrink: 0 }}>{form.linkLabel || 'View Now'} →</div>}
        </div>
    );
}

/* ─── Banner Form ─────────────────────────────────────────────────────────── */
function BannerForm({ initial = EMPTY_FORM, onSave, onCancel, saving }) {
    const [form, setForm] = useState({ ...EMPTY_FORM, ...initial });
    const w = useWindowWidth();
    const isMobile = w < 640;
    const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

    const togglePage = (p) => {
        if (p === 'all') { set('pages', ['all']); return; }
        const cur = form.pages.filter(x => x !== 'all');
        const next = cur.includes(p) ? cur.filter(x => x !== p) : [...cur, p];
        set('pages', next.length ? next : ['all']);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── Mode Toggle ── */}
            <div>
                <p style={{ ...lbl, marginBottom: 10 }}>Banner Mode</p>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10 }}>
                    {[{ value: 'text', icon: 'fa-font', label: 'Text Banner', desc: 'Coloured gradient with text' },
                    { value: 'image', icon: 'fa-image', label: 'Image Banner', desc: 'Upload a custom image' }].map(m => {
                        const active = form.bannerMode === m.value;
                        return (
                            <button key={m.value} type="button" onClick={() => set('bannerMode', m.value)} style={{
                                padding: '13px 16px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                                border: `2px solid ${active ? '#04bd20' : '#e2e8f0'}`,
                                background: active ? '#f0fdf4' : '#f8fafc', transition: 'all 0.15s',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 4 }}>
                                    <div style={{ width: 28, height: 28, borderRadius: 8, background: active ? '#dcfce7' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <i className={`fa-solid ${m.icon}`} style={{ fontSize: '0.8rem', color: active ? '#04bd20' : '#94a3b8' }} />
                                    </div>
                                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: active ? '#04bd20' : '#374151' }}>{m.label}</span>
                                    {active && <i className="fa-solid fa-circle-check" style={{ color: '#04bd20', fontSize: '0.8rem', marginLeft: 'auto' }} />}
                                </div>
                                <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>{m.desc}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Live Preview ── */}
            <div>
                <p style={{ ...lbl, marginBottom: 8 }}>Live Preview</p>
                <BannerPreview form={form} />
            </div>

            <div style={{ height: 1, background: '#f1f5f9' }} />

            {/* ── Image Upload ── */}
            {form.bannerMode === 'image' && (
                <div>
                    <label style={lbl}>Upload Banner Image</label>
                    <label style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        gap: 10, border: `2px dashed ${form.imageUrl ? '#04bd20' : '#cbd5e1'}`,
                        borderRadius: 14, padding: '24px 16px', cursor: 'pointer', textAlign: 'center',
                        background: form.imageUrl ? '#f0fdf4' : '#f8fafc', transition: 'all 0.2s',
                    }}>
                        <input type="file" accept="image/*" style={{ display: 'none' }}
                            onChange={e => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.size > 2 * 1024 * 1024) { alert('Image too large — max 2 MB'); return; }
                                const reader = new FileReader();
                                reader.onload = ev => set('imageUrl', ev.target.result);
                                reader.readAsDataURL(file);
                            }}
                        />
                        {form.imageUrl ? (
                            <>
                                <img src={form.imageUrl} alt="preview" style={{ maxHeight: 120, maxWidth: '100%', borderRadius: 10, objectFit: 'cover' }} />
                                <span style={{ fontSize: '0.76rem', color: '#04bd20', fontWeight: 700 }}>✓ Image selected — click to change</span>
                            </>
                        ) : (
                            <>
                                <div style={{ width: 48, height: 48, borderRadius: 14, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '1.3rem', color: '#94a3b8' }} />
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: '#374151' }}>Click to upload image</p>
                                    <p style={{ margin: '3px 0 0', fontSize: '0.72rem', color: '#94a3b8' }}>PNG, JPG, WebP · Max 2 MB · Recommended: 1200×300 px</p>
                                </div>
                            </>
                        )}
                    </label>
                    {form.imageUrl && (
                        <button type="button" onClick={() => set('imageUrl', '')}
                            style={{ marginTop: 6, background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                            <i className="fa-solid fa-trash me-1" /> Remove image
                        </button>
                    )}
                </div>
            )}

            {/* ── Shared: Title & Subtitle (always show) ── */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
                <div>
                    <label style={lbl}>Title <span style={{ color: '#ef4444' }}>*</span></label>
                    <input style={inp} value={form.title} onChange={e => set('title', e.target.value)} placeholder={form.bannerMode === 'image' ? 'Overlay title on image' : 'e.g. 50% Off Premium Notes!'} />
                </div>
                <div>
                    <label style={lbl}>Subtitle</label>
                    <input style={inp} value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Optional supporting line" />
                </div>
            </div>

            {/* ── Text only: Type & Color ── */}
            {form.bannerMode === 'text' && (
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14 }}>
                    <div>
                        <label style={lbl}>Banner Type</label>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {TYPES.map(t => {
                                const active = form.type === t.value;
                                return (
                                    <button key={t.value} type="button" onClick={() => set('type', t.value)} style={{
                                        padding: '7px 12px', borderRadius: 10, fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
                                        border: `1.5px solid ${active ? t.color : '#e2e8f0'}`,
                                        background: active ? t.bg : '#f8fafc', color: active ? t.color : '#64748b',
                                    }}>
                                        {t.emoji} {t.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div>
                        <label style={lbl}>Banner Color</label>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                            <input type="color" value={form.bgColor} onChange={e => set('bgColor', e.target.value)}
                                style={{ width: 38, height: 38, borderRadius: 8, border: '1.5px solid #e2e8f0', cursor: 'pointer', padding: 2, flexShrink: 0 }} />
                            <input style={{ ...inp, width: 100, flex: 'none' }} value={form.bgColor} onChange={e => set('bgColor', e.target.value)} placeholder="#04bd20" />
                            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                                {PRESET_COLORS.map(c => (
                                    <div key={c} onClick={() => set('bgColor', c)} title={c} style={{
                                        width: 22, height: 22, borderRadius: 6, background: c, cursor: 'pointer',
                                        border: form.bgColor === c ? '2.5px solid #0f172a' : '2px solid transparent',
                                        transform: form.bgColor === c ? 'scale(1.15)' : 'scale(1)', transition: 'all 0.12s',
                                    }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Shared: Link & Label ── */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 14 }}>
                <div>
                    <label style={lbl}>Click Link <span style={{ color: '#94a3b8', fontWeight: 500, textTransform: 'none' }}>— where to navigate on click</span></label>
                    <div style={{ position: 'relative' }}>
                        <i className="fa-solid fa-link" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.75rem' }} />
                        <input style={{ ...inp, paddingLeft: 32 }} value={form.link} onChange={e => set('link', e.target.value)} placeholder="/courses  or  https://..." />
                    </div>
                </div>
                <div>
                    <label style={lbl}>Button Label</label>
                    <input style={inp} value={form.linkLabel} onChange={e => set('linkLabel', e.target.value)} placeholder="View Now" />
                </div>
            </div>

            {/* ── Shared: Pages & Expiry & Status ── */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: 14, alignItems: 'start' }}>
                <div>
                    <label style={lbl}>Show On Pages</label>
                    <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                        {PAGE_OPTIONS.map(p => {
                            const active = form.pages.includes(p.value);
                            return (
                                <button key={p.value} type="button" onClick={() => togglePage(p.value)} style={{
                                    padding: '6px 12px', borderRadius: 8, fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.14s',
                                    border: `1.5px solid ${active ? '#04bd20' : '#e2e8f0'}`,
                                    background: active ? '#f0fdf4' : '#f8fafc', color: active ? '#04bd20' : '#64748b',
                                    display: 'flex', alignItems: 'center', gap: 5,
                                }}>
                                    <i className={`fa-solid ${p.icon}`} style={{ fontSize: '0.65rem' }} />
                                    {p.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <label style={lbl}>Expires At <span style={{ color: '#94a3b8', fontWeight: 500, textTransform: 'none' }}>— blank = never</span></label>
                    <input type="datetime-local" style={inp} value={form.expiresAt} onChange={e => set('expiresAt', e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 2 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                        <div onClick={() => set('isActive', !form.isActive)} style={{
                            width: 42, height: 24, borderRadius: 20, background: form.isActive ? '#04bd20' : '#e2e8f0',
                            position: 'relative', transition: 'background 0.2s', flexShrink: 0,
                        }}>
                            <div style={{ position: 'absolute', top: 3, left: form.isActive ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>
                            {form.isActive ? 'Active' : 'Paused'}
                        </span>
                    </label>
                </div>
            </div>

            {/* ── Actions ── */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4, borderTop: '1px solid #f1f5f9' }}>
                <button type="button" onClick={onCancel} style={{
                    padding: '9px 20px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: 'transparent',
                    color: '#64748b', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem',
                }}>Cancel</button>
                <button type="button" onClick={() => onSave(form)} disabled={saving || !form.title} style={{
                    padding: '9px 22px', borderRadius: 10, border: 'none',
                    background: saving || !form.title ? '#a3e6b2' : '#04bd20',
                    color: '#fff', fontWeight: 800, cursor: saving || !form.title ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem',
                    boxShadow: form.title && !saving ? '0 4px 14px rgba(4,189,32,0.35)' : 'none', transition: 'all 0.15s',
                }}>
                    {saving
                        ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Saving...</>
                        : <><i className="fa-solid fa-floppy-disk" />  Save Banner</>
                    }
                </button>
            </div>
        </div>
    );
}

/* ─── Action Button ───────────────────────────────────────────────────────── */
function ActionBtn({ onClick, title, icon, color, bg }) {
    return (
        <button onClick={onClick} title={title} style={{
            width: 34, height: 34, borderRadius: 8, border: 'none',
            background: bg, color, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem',
        }}>
            <i className={`fa-solid ${icon}`} />
        </button>
    );
}

/* ─── Main Content ────────────────────────────────────────────────────────── */
function BannersContent() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editBanner, setEditBanner] = useState(null);
    const w = useWindowWidth();
    const isMobile = w < 640;
    const isTablet = w < 900;

    const getAuthHdr = () => ({
        'Content-Type': 'application/json',
        AuthToken: localStorage.getItem('token') || '',
    });

    const load = async () => {
        setLoading(true);
        try {
            // ?admin=1 → returns ALL banners including inactive
            const r = await fetch('/api/banner?admin=1');
            const d = await r.json();
            if (d.success) setBanners(d.banners);
            else console.error('Banner load failed:', d.message);
        } catch (e) { console.error(e); }
        setLoading(false);
    };
    useEffect(() => { load(); }, []);

    const handleSave = async (form) => {
        setSaving(true);
        try {
            const payload = { ...form, expiresAt: form.expiresAt || null };
            const url = editBanner ? `/api/banner/${editBanner._id}` : '/api/banner';
            const method = editBanner ? 'PUT' : 'POST';
            const r = await fetch(url, { method, headers: getAuthHdr(), body: JSON.stringify(payload) });
            const d = await r.json();
            if (d.success) {
                toast.success(editBanner ? 'Banner updated!' : 'Banner created!');
                setShowForm(false);
                setEditBanner(null);
                load();
            } else {
                toast.error(d.message || 'Failed to save');
            }
        } catch (e) { console.error(e); toast.error('Something went wrong'); }
        setSaving(false);
    };

    const toggleActive = async (b) => {
        try {
            const r = await fetch(`/api/banner/${b._id}`, {
                method: 'PUT',
                headers: getAuthHdr(),
                body: JSON.stringify({ isActive: !b.isActive }),
            });
            const d = await r.json();
            if (d.success) { toast.success(`Banner ${!b.isActive ? 'activated' : 'paused'}`); load(); }
            else toast.error(d.message || 'Update failed');
        } catch (e) { console.error(e); toast.error('Network error'); }
    };

    const deleteBanner = async (id) => {
        if (!confirm('Permanently delete this banner?')) return;
        try {
            const r = await fetch(`/api/banner/${id}`, { method: 'DELETE', headers: getAuthHdr() });
            const d = await r.json();
            if (d.success) { toast.success('Banner deleted'); load(); }
            else toast.error(d.message || 'Delete failed');
        } catch (e) { console.error(e); toast.error('Network error'); }
    };

    const TYPE_META = {
        offer: { icon: 'fa-tag', label: 'Offer', color: '#f59e0b', bg: '#fffbeb' },
        new: { icon: 'fa-rocket', label: 'New Launch', color: '#8b5cf6', bg: '#faf5ff' },
        announcement: { icon: 'fa-bullhorn', label: 'Announcement', color: '#0ea5e9', bg: '#f0f9ff' },
        alert: { icon: 'fa-triangle-exclamation', label: 'Alert', color: '#ef4444', bg: '#fff5f5' },
    };

    const activeCount = banners.filter(b => b.isActive).length;
    const pausedCount = banners.filter(b => !b.isActive).length;

    return (
        <div style={{ margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

            {/* ── Header ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h1 style={{ fontSize: isMobile ? '1rem' : '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ width: 34, height: 34, borderRadius: 10, background: '#f0fdf4', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <i className="fa-solid fa-rectangle-ad" style={{ color: '#04bd20', fontSize: '0.9rem' }} />
                        </span>
                        Banners &amp; Announcements
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '5px 0 0', fontWeight: 500 }}>
                        Manage promotional banners shown to students on Notes, PYQ &amp; Course pages
                    </p>
                </div>
                <button onClick={() => { setShowForm(true); setEditBanner(null); }} style={{
                    padding: isMobile ? '8px 14px' : '10px 18px', borderRadius: 10, border: 'none',
                    background: 'linear-gradient(135deg,#04bd20,#029d1a)', color: '#fff', fontWeight: 800, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 7, fontSize: isMobile ? '0.78rem' : '0.84rem',
                    boxShadow: '0 4px 14px rgba(4,189,32,0.3)', whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                    <i className="fa-solid fa-plus" /> New Banner
                </button>
            </div>

            {/* ── Stats ── */}
            {banners.length > 0 && !isMobile && (
                <div style={{ display: 'grid', gridTemplateColumns: isTablet ? '1fr 1fr' : 'repeat(3,1fr)', gap: 10, marginBottom: 18 }}>
                    {[{ label: 'Total', value: banners.length, icon: 'fa-layer-group', color: '#6366f1', bg: '#eef2ff' },
                    { label: 'Active', value: activeCount, icon: 'fa-circle-check', color: '#04bd20', bg: '#f0fdf4' },
                    { label: 'Paused', value: pausedCount, icon: 'fa-circle-pause', color: '#f59e0b', bg: '#fffbeb' },
                    ].map(s => (
                        <div key={s.label} style={{ ...cardBox, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <i className={`fa-solid ${s.icon}`} style={{ color: s.color, fontSize: '0.9rem' }} />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{s.value}</p>
                                <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, marginTop: 2 }}>{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Form ── */}
            {showForm && (
                <div style={{ ...cardBox, padding: isMobile ? '14px 12px' : 26, marginBottom: 18, border: '1.5px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <i className={`fa-solid ${editBanner ? 'fa-pen-to-square' : 'fa-sparkles'}`} style={{ color: '#04bd20' }} />
                            {editBanner ? 'Edit Banner' : 'Create New Banner'}
                        </h3>
                        <button type="button" onClick={() => { setShowForm(false); setEditBanner(null); }}
                            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                            <i className="fa-solid fa-xmark" style={{ fontSize: '0.8rem' }} />
                        </button>
                    </div>
                    <BannerForm
                        initial={editBanner ? {
                            ...EMPTY_FORM,         // safe defaults for new fields (bannerMode, imageUrl, etc.)
                            ...editBanner,         // real stored values override
                            expiresAt: editBanner.expiresAt
                                ? new Date(editBanner.expiresAt).toISOString().slice(0, 16)
                                : '',
                        } : undefined}
                        onSave={handleSave}
                        onCancel={() => { setShowForm(false); setEditBanner(null); }}
                        saving={saving}
                    />
                </div>
            )}

            {/* ── Banner List ── */}
            {loading ? (
                <div style={{ ...cardBox, padding: '60px 0', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ width: 26, height: 26, border: '3px solid #e2e8f0', borderTopColor: '#04bd20', borderRadius: '50%', animation: 'spin 0.7s linear infinite', margin: '0 auto' }} />
                    <p style={{ marginTop: 12, fontWeight: 600 }}>Loading banners...</p>
                </div>
            ) : banners.length === 0 ? (
                <div style={{ ...cardBox, padding: '70px 0', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ width: 60, height: 60, borderRadius: 18, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', border: '1.5px solid #e2e8f0' }}>
                        <i className="fa-regular fa-rectangle-list" style={{ fontSize: '1.6rem' }} />
                    </div>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: '0 0 5px', color: '#374151' }}>No banners yet</p>
                    <p style={{ fontSize: '0.76rem', margin: 0 }}>Click <strong>New Banner</strong> to create your first announcement</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {banners.map(b => {
                        const m = TYPE_META[b.type] || TYPE_META.announcement;
                        return (
                            <div key={b._id} style={{ ...cardBox, overflow: 'hidden', opacity: b.isActive ? 1 : 0.6, transition: 'opacity 0.2s' }}>
                                {/* Color/Image strip */}
                                {b.bannerMode === 'image' && b.imageUrl ? (
                                    <div style={{ height: 70, position: 'relative', overflow: 'hidden' }}>
                                        <img src={b.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.5), transparent)' }} />
                                        <span style={{ position: 'absolute', top: 10, left: 14, fontSize: '0.62rem', fontWeight: 800, background: 'rgba(0,0,0,0.4)', color: '#fff', padding: '2px 8px', borderRadius: 20, backdropFilter: 'blur(4px)' }}>IMAGE BANNER</span>
                                    </div>
                                ) : (
                                    <div style={{ height: 3, background: `linear-gradient(90deg,${b.bgColor || m.color},${b.bgColor || m.color}60)` }} />
                                )}

                                <div style={{ padding: isMobile ? '10px 12px' : '12px 18px', display: 'flex', gap: 12, alignItems: 'center' }}>
                                    {!isMobile && b.bannerMode !== 'image' && (
                                        <div style={{ width: 38, height: 38, borderRadius: 10, background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <i className={`fa-solid ${m.icon}`} style={{ color: m.color, fontSize: '0.9rem' }} />
                                        </div>
                                    )}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 3 }}>
                                            <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.05em', color: m.color, background: m.bg, border: `1px solid ${m.color}25`, padding: '2px 8px', borderRadius: 20 }}>{m.label.toUpperCase()}</span>
                                            <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>{b.title}</span>
                                            {!b.isActive && <span style={{ fontSize: '0.6rem', fontWeight: 800, background: '#f1f5f9', color: '#94a3b8', padding: '2px 8px', borderRadius: 20 }}>PAUSED</span>}
                                        </div>
                                        {b.subtitle && <p style={{ margin: '0 0 4px', fontSize: '0.74rem', color: '#64748b' }}>{b.subtitle}</p>}
                                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                                            {b.pages.map(p => <span key={p} style={{ fontSize: '0.62rem', fontWeight: 700, color: '#475569', background: '#f8fafc', border: '1px solid #e2e8f0', padding: '2px 8px', borderRadius: 20 }}>{PAGE_OPTIONS.find(o => o.value === p)?.label || p}</span>)}
                                            {b.link && <span style={{ fontSize: '0.62rem', color: '#04bd20', fontWeight: 700 }}><i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: '0.55rem', marginRight: 3 }} />{b.link}</span>}
                                            {b.expiresAt && <span style={{ fontSize: '0.62rem', color: '#ef4444', fontWeight: 700 }}><i className="fa-regular fa-clock" style={{ marginRight: 3 }} />{new Date(b.expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: isMobile ? 5 : 7, flexShrink: 0 }}>
                                        <ActionBtn onClick={() => toggleActive(b)} title={b.isActive ? 'Pause' : 'Activate'} icon={b.isActive ? 'fa-pause' : 'fa-play'} color={b.isActive ? '#d97706' : '#04bd20'} bg={b.isActive ? '#fef3c7' : '#f0fdf4'} />
                                        <ActionBtn onClick={() => { setEditBanner(b); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} title="Edit" icon="fa-pen" color="#3b82f6" bg="#eff6ff" />
                                        <ActionBtn onClick={() => deleteBanner(b._id)} title="Delete" icon="fa-trash" color="#ef4444" bg="#fff5f5" />
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

export default function BannersPage() {
    return (
        <Suspense fallback={<div style={{ padding: 32, color: '#94a3b8', textAlign: 'center' }}>Loading...</div>}>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <BannersContent />
        </Suspense>
    );
}
