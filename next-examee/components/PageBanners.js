"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const TYPE_META = {
    offer: { icon: 'fa-tag', label: 'OFFER', defaultColor: '#f59e0b' },
    new: { icon: 'fa-rocket', label: 'NEW', defaultColor: '#8b5cf6' },
    announcement: { icon: 'fa-bullhorn', label: 'ANNOUNCEMENT', defaultColor: '#0ea5e9' },
    alert: { icon: 'fa-triangle-exclamation', label: 'ALERT', defaultColor: '#ef4444' },
};

/* ─── Image Banner (tall, full-width) ─────────────────────────────────────── */
function ImageBanner({ banner, onDismiss }) {
    const router = useRouter();
    const handleClick = () => {
        if (!banner.link) return;
        banner.link.startsWith('http') ? window.open(banner.link, '_blank') : router.push(banner.link);
    };

    return (
        <div style={{
            borderRadius: 16, overflow: 'hidden', position: 'relative',
            height: 200, cursor: banner.link ? 'pointer' : 'default',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        }} onClick={handleClick}>
            {/* Background image */}
            <img src={banner.imageUrl} alt={banner.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />

            {/* Dark gradient overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />

            {/* Dismiss */}
            <button onClick={e => { e.stopPropagation(); onDismiss(banner._id); }}
                style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.35)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', backdropFilter: 'blur(4px)', zIndex: 1 }}>
                <i className="fa-solid fa-xmark" />
            </button>

            {/* Content overlay */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 20px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                    <p style={{ margin: '0 0 4px', color: '#fff', fontWeight: 900, fontSize: '1.05rem', textShadow: '0 1px 6px rgba(0,0,0,0.5)', lineHeight: 1.3 }}>{banner.title}</p>
                    {banner.subtitle && <p style={{ margin: 0, color: 'rgba(255,255,255,0.82)', fontSize: '0.78rem', fontWeight: 500 }}>{banner.subtitle}</p>}
                </div>
                {banner.link && (
                    <div style={{
                        flexShrink: 0, background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.45)',
                        color: '#fff', fontSize: '0.76rem', fontWeight: 800, padding: '7px 16px', borderRadius: 10,
                        whiteSpace: 'nowrap', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                        {banner.linkLabel || 'View Now'}
                        <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.65rem' }} />
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── Text Banner (gradient strip) ───────────────────────────────────────── */
function TextBanner({ banner, onDismiss }) {
    const router = useRouter();
    const meta = TYPE_META[banner.type] || TYPE_META.announcement;
    const bg = banner.bgColor || meta.defaultColor;

    const handleClick = () => {
        if (!banner.link) return;
        banner.link.startsWith('http') ? window.open(banner.link, '_blank') : router.push(banner.link);
    };

    return (
        <div onClick={handleClick} style={{
            background: `linear-gradient(135deg, ${bg}ee, ${bg}cc)`,
            borderRadius: 14, padding: '14px 18px',
            display: 'flex', alignItems: 'center', gap: 14,
            boxShadow: `0 4px 20px ${bg}40`,
            cursor: banner.link ? 'pointer' : 'default',
            position: 'relative', overflow: 'hidden',
        }}>
            {/* Blob */}
            <div style={{ position: 'absolute', right: -30, top: -30, width: 120, height: 120, background: 'rgba(255,255,255,0.12)', borderRadius: '50%', pointerEvents: 'none' }} />

            {/* Icon */}
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={`fa-solid ${meta.icon}`} style={{ color: '#fff', fontSize: '1rem' }} />
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: banner.subtitle ? 3 : 0 }}>
                    <span style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 20 }}>{meta.label}</span>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>{banner.title}</span>
                </div>
                {banner.subtitle && <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{banner.subtitle}</p>}
            </div>

            {/* CTA */}
            {banner.link && (
                <div style={{ flexShrink: 0, background: 'rgba(255,255,255,0.22)', border: '1.5px solid rgba(255,255,255,0.4)', color: '#fff', fontSize: '0.75rem', fontWeight: 800, padding: '6px 14px', borderRadius: 8, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {banner.linkLabel || 'View Now'}
                    <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.65rem' }} />
                </div>
            )}

            {/* Dismiss */}
            <button onClick={e => { e.stopPropagation(); onDismiss(banner._id); }}
                style={{ background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', width: 26, height: 26, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.65rem' }}>
                <i className="fa-solid fa-xmark" />
            </button>
        </div>
    );
}

/* ─── Root Component ──────────────────────────────────────────────────────── */
export default function PageBanners({ page }) {
    const [banners, setBanners] = useState([]);
    const [dismissed, setDismissed] = useState([]);

    useEffect(() => {
        fetch(`/api/banner?page=${page}`)
            .then(r => r.json())
            .then(d => { if (d.success) setBanners(d.banners); })
            .catch(() => { });
    }, [page]);

    const dismiss = (id) => setDismissed(prev => [...prev, id]);
    const visible = banners.filter(b => !dismissed.includes(b._id));

    if (visible.length === 0) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {visible.map(b =>
                b.bannerMode === 'image' && b.imageUrl
                    ? <ImageBanner key={b._id} banner={b} onDismiss={dismiss} />
                    : <TextBanner key={b._id} banner={b} onDismiss={dismiss} />
            )}
        </div>
    );
}
