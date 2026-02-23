import React, { useState, useEffect } from 'react';

const VideoTemplate = ({ videoUrl, footer, header, videoContainerRef, handleFullscreen }) => {
    const [url, setUrl] = useState(videoUrl);
    const [isDriveUrl, setIsDriveUrl] = useState(false);
    const [isYouTubeUrl, setIsYouTubeUrl] = useState(false);

    useEffect(() => {
        if (!videoUrl) return;

        const isYT = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
        setIsYouTubeUrl(isYT);

        const isDriveUrl = videoUrl.includes("drive.google.com") || videoUrl.includes("drive");
        setIsDriveUrl(isDriveUrl);


        if (isYT) {
            const srcMatch = videoUrl.match(/src="([^"]+)"/);
            const srcUrl = srcMatch ? srcMatch[1] : videoUrl;

            if (srcUrl.includes('/embed/')) {
                let iframeVideoId = srcUrl.split('/embed/')[1];
                iframeVideoId = iframeVideoId.split('&')[0].split('?')[0];
                setUrl(iframeVideoId);
            } else if (srcUrl.includes('v=')) {
                setUrl(srcUrl.split('v=')[1].split('&')[0]);
            } else if (srcUrl.includes('youtu.be/')) {
                setUrl(srcUrl.split('youtu.be/')[1].split('?')[0]);
            } else {
                setUrl(srcUrl);
            }

        } else if (isDriveUrl) {
            if (videoUrl.includes('/d/')) {
                const driveUrl = videoUrl.split('/d/')[1];
                const driveID = driveUrl.split('/view')[0].split('/')[0];
                setUrl(driveID);
            } else {
                setUrl(videoUrl);
            }
        } else {
            setUrl(videoUrl);
        }

    }, [videoUrl]);

    const headerText = header ? header.slice(0, 50) : "";
    const footerText = footer ? footer.slice(0, 120) : "";

    return (
        <div className="card shadow-sm video-item my-3 p-2 rounded-3" style={{ minHeight: "400px" }}>
            <div className='position-relative video-container' ref={videoContainerRef}>
                <div className="video-player-header bg-white d-flex justify-content-start align-items-center p-1">
                    <div className="video-zoom bg-light cursor-pointer d-flex justify-content-center align-items-center" onClick={handleFullscreen} style={{ width: '40px', height: '40px', borderRadius: '4px' }}>
                        <i className="fa-solid fa-expand"></i>
                    </div>
                    <h6 className="card-title px-2 m-0">{headerText}..</h6>
                </div>

                <iframe
                    className='video-frame w-100'
                    style={{ height: '300px' }}
                    src={isDriveUrl ? `https://drive.google.com/file/d/${url}/preview` : `https://www.youtube.com/embed/${url}`}
                    title="Video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>

                <div className="video-player-footer bg-white d-flex justify-content-start p-2">
                    <h6 className="fw-bold m-0 px-1">Benefits:</h6>
                </div>
            </div>

            <div className="border-top p-2">
                <p className="card-body text-muted p-0 m-0">{footerText}..</p>
            </div>
        </div>
    );
};

export default VideoTemplate;
