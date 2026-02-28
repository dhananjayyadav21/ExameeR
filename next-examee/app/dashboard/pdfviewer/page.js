"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import '../../../styles/pdf-viewer.css';

function PdfViewerContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const url = searchParams.get('view');
    const iframeUrl = url && url.includes('http') ? url : `https://drive.google.com/file/d/${url}/preview`;

    const [loaded, setLoaded] = useState(false);

    if (!url) {
        return (
            <div className="container py-5 text-center">
                <h2>No document provided</h2>
                <button onClick={() => router.back()} className="btn btn-secondary mt-3">Go Back</button>
            </div>
        );
    }

    return (
        <div className="pdf-viewer-dashboard-container">
            {/* ── Toolbar ── */}
            <div style={{
                height: '60px', flexShrink: 0,
                background: 'linear-gradient(135deg, #0a1628 0%, #0d3320 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button
                        onClick={() => router.back()}
                        style={{
                            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                            color: 'white', borderRadius: '10px', padding: '6px 14px',
                            fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    >
                        <i className="fa-solid fa-arrow-left" style={{ fontSize: '0.8rem' }}></i>
                        Back to List
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                            background: 'rgba(4,189,32,0.15)', borderRadius: '8px',
                            padding: '6px 10px', display: 'flex', alignItems: 'center'
                        }}>
                            <i className="fa-solid fa-file-pdf" style={{ color: '#04bd20', fontSize: '1rem' }}></i>
                        </span>
                        <span style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '0.01em' }}>
                            Document Preview
                        </span>
                    </div>
                </div>

                <a
                    href={`https://drive.google.com/uc?export=download&id=${url}`}
                    download
                    style={{
                        background: '#04bd20', border: 'none', color: 'white',
                        borderRadius: '10px', padding: '8px 18px', fontSize: '0.85rem',
                        fontWeight: 700, cursor: 'pointer', textDecoration: 'none',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(4,189,32,0.3)'
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#03a61c'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = '#04bd20'; e.currentTarget.style.transform = 'none'; }}
                >
                    <i className="fa-solid fa-download" style={{ fontSize: '0.8rem' }}></i>
                    Download PDF
                </a>
            </div>

            {/* ── Viewer area ── */}
            <div style={{ flex: 1, position: 'relative', background: '#1e293b', overflow: 'hidden' }}>
                {!loaded && (
                    <div style={{
                        position: 'absolute', inset: 0, zIndex: 10,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center', gap: '16px',
                        background: '#f8fafc'
                    }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '16px',
                            background: 'rgba(4,189,32,0.1)', border: '1px solid rgba(4,189,32,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(4,189,32,0.15)'
                        }}>
                            <i className="fa-solid fa-file-pdf" style={{ color: '#04bd20', fontSize: '1.8rem' }}></i>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ color: '#0f172a', margin: 0, fontSize: '0.95rem', fontWeight: 600 }}>
                                Loading document...
                            </p>
                            <p style={{ color: '#64748b', margin: '4px 0 0', fontSize: '0.8rem' }}>
                                Establishing secure connection to Google Drive
                            </p>
                            <div className="mt-3 pdf-viewer-loading spin" style={{ width: '24px', height: '24px', border: '3px solid #e2e8f0', borderTopColor: '#04bd20', borderRadius: '50%', display: 'inline-block' }}></div>
                        </div>
                    </div>
                )}

                <iframe
                    src={iframeUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        display: loaded ? 'block' : 'none',
                        position: 'relative',
                        zIndex: 1,
                        background: 'transparent'
                    }}
                    title="PDF Viewer"
                    onLoad={() => setLoaded(true)}
                    allow="autoplay"
                />

                {loaded && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '56px',
                            height: '80px',
                            zIndex: 20,
                            cursor: 'default',
                            background: 'rgba(15,15,15,1)',
                        }}
                    />
                )}

            </div>
        </div>
    );
}

export default function DashboardPdfViewerPage() {
    return (
        <Suspense fallback={
            <div style={{ height: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '16px' }}>
                <div className="pdf-viewer-loading spin" style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#04bd20', borderRadius: '50%' }}></div>
            </div>
        }>
            <PdfViewerContent />
        </Suspense>
    );
}
