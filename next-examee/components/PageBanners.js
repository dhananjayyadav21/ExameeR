"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Type meta — icon + default color
const TYPE_META = {
    offer: { icon: 'fa-tag', label: 'OFFER', defaultColor: '#f59e0b' },
    new: { icon: 'fa-rocket', label: 'NEW', defaultColor: '#8b5cf6' },
    announcement: { icon: 'fa-bullhorn', label: 'ANNOUNCEMENT', defaultColor: '#0ea5e9' },
    alert: { icon: 'fa-triangle-exclamation', label: 'ALERT', defaultColor: '#ef4444' },
};

function SingleBanner({ banner, onDismiss }) {
    const router = useRouter();
    const meta = TYPE_META[banner.type] || TYPE_META.announcement;
    const bg = banner.bgColor || meta.defaultColor;

    const handleClick = () => {
        if (!banner.link) return;
        if (banner.link.startsWith('http')) {
            window.open(banner.link, '_blank');
        } else {
            router.push(banner.link);
        }
    };

    return (
        <div
            style={{
                background: `linear-gradient(135deg, ${bg}ee, ${bg}cc)`,
                borderRadius: '14px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                boxShadow: `0 4px 20px ${bg}40`,
                cursor: banner.link ? 'pointer' : 'default',
                position: 'relative',
                overflow: 'hidden',
            }}
            onClick={handleClick}
        >
            {/* Decorative blob */}
            <div style={{
                position: 'absolute', right: -30, top: -30,
                width: 120, height: 120,
                background: 'rgba(255,255,255,0.12)',
                borderRadius: '50%',
                pointerEvents: 'none',
            }} />

            {/* Icon badge */}
            <div style={{
                width: 40, height: 40, borderRadius: '10px',
                background: 'rgba(255,255,255,0.22)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
            }}>
                <i className={`fa-solid ${meta.icon}`} style={{ color: '#fff', fontSize: '1rem' }}></i>
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{
                        fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.08em',
                        color: 'rgba(255,255,255,0.85)',
                        background: 'rgba(255,255,255,0.2)',
                        padding: '2px 8px', borderRadius: '20px',
                    }}>{meta.label}</span>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>{banner.title}</span>
                </div>
                {banner.subtitle && (
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                        {banner.subtitle}
                    </p>
                )}
            </div>

            {/* CTA */}
            {banner.link && (
                <div style={{
                    flexShrink: 0,
                    background: 'rgba(255,255,255,0.22)',
                    border: '1.5px solid rgba(255,255,255,0.4)',
                    color: '#fff',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '6px 14px',
                    borderRadius: '8px',
                    whiteSpace: 'nowrap',
                    display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                    {banner.linkLabel || 'View Now'}
                    <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.65rem' }}></i>
                </div>
            )}

            {/* Dismiss */}
            <button
                onClick={(e) => { e.stopPropagation(); onDismiss(banner._id); }}
                style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none', cursor: 'pointer',
                    width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '0.65rem',
                }}
                title="Dismiss"
            >
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
    );
}

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {visible.map(b => (
                <SingleBanner key={b._id} banner={b} onDismiss={dismiss} />
            ))}
        </div>
    );
}
