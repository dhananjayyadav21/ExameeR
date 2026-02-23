"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function PdfViewerContent({ setProgress = () => { } }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const url = searchParams.get('view');
    const iframeUrl = `https://drive.google.com/file/d/${url}/preview`;
    const [loaded, setLoaded] = useState(false);

    useEffect(() => { setProgress(0); setProgress(100); }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0f172a' }}>

            {/* ── Toolbar ── */}
            <div style={{
                height: '52px', flexShrink: 0,
                background: 'linear-gradient(135deg,#0f172a,#064e3b)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 16px', borderBottom: '1px solid rgba(255,255,255,0.07)'
            }}>
                {/* Left: Back + title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={() => router.back()}
                        style={{
                            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                            color: 'white', borderRadius: '8px', padding: '5px 14px',
                            fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    >
                        <i className="fa-solid fa-arrow-left" style={{ fontSize: '0.75rem' }}></i>
                        Back
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            background: 'rgba(4,189,32,0.2)', borderRadius: '6px',
                            padding: '4px 8px', display: 'flex', alignItems: 'center'
                        }}>
                            <i className="fa-solid fa-file-pdf" style={{ color: '#04bd20', fontSize: '0.9rem' }}></i>
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.84rem', fontWeight: 500 }}>
                            PDF Document Viewer
                        </span>
                    </div>
                </div>

                {/* Right: Download */}
                <a
                    href={`https://drive.google.com/uc?export=download&id=${url}`}
                    download
                    style={{
                        background: '#04bd20', border: 'none', color: 'white',
                        borderRadius: '8px', padding: '6px 16px', fontSize: '0.82rem',
                        fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
                        display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#03a61c'}
                    onMouseOut={e => e.currentTarget.style.background = '#04bd20'}
                >
                    <i className="fa-solid fa-download" style={{ fontSize: '0.72rem' }}></i>
                    Download
                </a>
            </div>

            {/* ── Viewer area ── */}
            <div style={{ flex: 1, position: 'relative', background: '#1a1a2e', overflow: 'hidden' }}>

                {/* Loading state */}
                {!loaded && (
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 10,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: '16px'
                    }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '16px',
                            background: 'rgba(4,189,32,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <i className="fa-solid fa-file-pdf" style={{ color: '#04bd20', fontSize: '1.5rem' }}></i>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>
                                Loading document…
                            </p>
                            <div className="spinner-border spinner-border-sm mt-2" style={{ color: '#04bd20' }}></div>
                        </div>
                    </div>
                )}

                {/* The PDF iframe */}
                <iframe
                    src={iframeUrl}
                    style={{ width: '100%', height: '100%', border: 'none', display: loaded ? 'block' : 'none' }}
                    title="PDF Viewer"
                    onLoad={() => setLoaded(true)}
                    allow="autoplay"
                />

                {/*
                  ── Pop-out button blocker ──
                  Google Drive's iframe renders a native "Pop out" button in its
                  bottom-right corner. We cannot remove it via JS (cross-origin),
                  so we layer a transparent div exactly over that area to intercept
                  all pointer events there, making it unclickable.
                */}
                {loaded && (
                    <div
                        title=""
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            right: 0,
                            width: '90px',
                            height: '40px',
                            zIndex: 20,
                            cursor: 'default',
                            background: '#1a1a2e',   /* matches viewer bg — hides the button visually */
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default function PdfViewerPage(props) {
    return (
        <Suspense fallback={
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
                <div className="spinner-border" style={{ color: '#04bd20' }}></div>
            </div>
        }>
            <PdfViewerContent {...props} />
        </Suspense>
    );
}
