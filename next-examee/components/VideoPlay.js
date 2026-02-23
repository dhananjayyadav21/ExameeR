import React, { useState, useEffect } from 'react';

const VideoModalService = ({ videoUrl, show, onClose }) => {
    const [url, setUrl] = useState(videoUrl);
    const [isYouTubeUrl, setIsYouTubeUrl] = useState(false);

    useEffect(() => {
        if (!videoUrl) return;

        const isYT = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
        setIsYouTubeUrl(isYT);

        const isDriveUrl = videoUrl.includes("drive.google.com") || videoUrl.includes("drive");


        if (isYT) {
            const srcMatch = videoUrl.match(/src="([^"]+)"/);
            const srcUrl = srcMatch ? srcMatch[1] : videoUrl;

            if (srcUrl.includes('/embed/')) {
                const iframeVideoId = srcUrl.split('/embed/')[1];
                setUrl(iframeVideoId);
            } else if (srcUrl.includes('v=')) {
                setUrl(srcUrl.split('v=')[1].split('&')[0]);
            } else if (srcUrl.includes('youtu.be/')) {
                setUrl(srcUrl.split('youtu.be/')[1]);
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


    if (!show) return null;

    return (
        <>
            <div className="modal d-block fade show mt-0" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1060 }}>
                <div className="modal-dialog modal-dialog-centered z-3 px-2" role="document">
                    <div className="modal-content p-3 overflow-hidden">
                        <div className="text-center position-relative">
                            {!isYouTubeUrl ? (
                                <iframe
                                    src={`https://drive.google.com/file/d/${url}/preview`}
                                    width="100%"
                                    height="360"
                                    allow="autoplay"
                                    allowFullScreen
                                    title="Drive Video"
                                ></iframe>
                            ) : (
                                <iframe
                                    width="100%"
                                    height="360"
                                    src={`https://www.youtube.com/embed/${url}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            )}
                            <button
                                onClick={onClose}
                                className="btn btn-dark position-absolute cursor-pointer px-2 py-1"
                                style={{ top: 10, right: 10, zIndex: 1100, borderRadius: '50%' }}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VideoModalService;
