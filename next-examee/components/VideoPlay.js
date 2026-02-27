"use client";
import React, { useState, useEffect } from 'react';

// Parses any video URL (YouTube / Google Drive) into an embed-ready ID or URL
function parseVideoUrl(videoUrl) {
    if (!videoUrl) return { id: '', isYT: false };
    const isYT = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
    const isDrive = videoUrl.includes('drive.google.com') || videoUrl.includes('/d/');

    if (isYT) {
        const srcMatch = videoUrl.match(/src="([^"]+)"/);
        const srcUrl = srcMatch ? srcMatch[1] : videoUrl;
        if (srcUrl.includes('/embed/')) return { id: srcUrl.split('/embed/')[1].split(/[?&]/)[0], isYT: true };
        if (srcUrl.includes('v=')) return { id: srcUrl.split('v=')[1].split('&')[0], isYT: true };
        if (srcUrl.includes('youtu.be/')) return { id: srcUrl.split('youtu.be/')[1].split('?')[0], isYT: true };
        return { id: srcUrl, isYT: true };
    }
    if (isDrive) {
        if (videoUrl.includes('/d/')) {
            const after = videoUrl.split('/d/')[1];
            return { id: after.split('/')[0].split('?')[0], isYT: false };
        }
    }
    return { id: videoUrl, isYT: false };
}

const VideoModalService = ({ videoUrl, show, onClose }) => {
    const [parsed, setParsed] = useState({ id: '', isYT: false });

    useEffect(() => {
        setParsed(parseVideoUrl(videoUrl));
    }, [videoUrl]);

    if (!show) return null;

    const embedSrc = parsed.isYT
        ? `https://www.youtube.com/embed/${parsed.id}?autoplay=1&rel=0`
        : `https://drive.google.com/file/d/${parsed.id}/preview`;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', zIndex: 1060 }}
            />

            {/* Modal */}
            <div style={{
                position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                zIndex: 1070, width: 'min(680px, 96vw)',
                animation: 'modalPop 0.2s ease'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg,#0f172a,#064e3b)',
                    borderRadius: '16px 16px 0 0', padding: '12px 18px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ background: 'rgba(4,189,32,0.2)', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="fa-solid fa-circle-play" style={{ color: '#04bd20', fontSize: '0.9rem' }}></i>
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: '0.875rem' }}>Video Preview</span>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                            color: 'white', borderRadius: '8px', width: '32px', height: '32px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600
                        }}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Video content */}
                <div style={{ background: '#000', borderRadius: '0 0 16px 16px', overflow: 'hidden', lineHeight: 0 }}>
                    <iframe
                        src={embedSrc}
                        width="100%"
                        height="360"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        title="Video Player"
                        style={{ border: 'none', display: 'block' }}
                    />
                </div>
            </div>

            <style jsx>{`
                @keyframes modalPop { from { opacity: 0; transform: translate(-50%,-48%) scale(0.96); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
            `}</style>
        </>
    );
};

export default VideoModalService;
