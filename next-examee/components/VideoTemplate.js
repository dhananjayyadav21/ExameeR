import React, { useState, useEffect } from 'react';

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
    if (isDrive && videoUrl.includes('/d/')) {
        const after = videoUrl.split('/d/')[1];
        return { id: after.split('/')[0].split('?')[0], isYT: false };
    }
    return { id: videoUrl, isYT: false };
}

const VideoTemplate = ({ videoUrl, footer, header, videoContainerRef, handleFullscreen }) => {
    const [parsed, setParsed] = useState({ id: '', isYT: false });

    useEffect(() => {
        setParsed(parseVideoUrl(videoUrl));
    }, [videoUrl]);

    const embedSrc = parsed.isYT
        ? `https://www.youtube.com/embed/${parsed.id}?rel=0`
        : `https://drive.google.com/file/d/${parsed.id}/preview`;

    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            {/* Player header */}
            <div style={{ background: '#0f172a', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                    onClick={handleFullscreen}
                    title="Toggle fullscreen"
                    style={{
                        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                        color: 'rgba(255,255,255,0.8)', borderRadius: '8px', width: '34px', height: '34px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.8rem'
                    }}>
                    <i className="fa-solid fa-expand"></i>
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, minWidth: 0 }}>
                    <i className="fa-solid fa-circle-play" style={{ color: '#04bd20', fontSize: '0.8rem', flexShrink: 0 }}></i>
                    <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {header ? header.slice(0, 60) + (header.length > 60 ? '…' : '') : 'Now Playing'}
                    </span>
                </div>
            </div>

            {/* iframe */}
            <div ref={videoContainerRef} style={{ background: '#000', lineHeight: 0 }}>
                <iframe
                    src={embedSrc}
                    className="w-100"
                    style={{ height: '340px', border: 'none', display: 'block' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    title="Video Player"
                />
            </div>

            {/* Benefits footer */}
            {footer && (
                <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f1f1' }}>
                    <p className="fw-semibold mb-1" style={{ fontSize: '0.78rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Benefits</p>
                    <p className="mb-0 text-muted" style={{ fontSize: '0.82rem', lineHeight: '1.6' }}>
                        {footer.slice(0, 140)}{footer.length > 140 ? '…' : ''}
                    </p>
                </div>
            )}
        </div>
    );
};

export default VideoTemplate;
