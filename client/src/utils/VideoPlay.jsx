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

            const iframeVideoId = srcUrl.split('/embed/')[1];
            setUrl(iframeVideoId);

        } else if (isDriveUrl) {

            const driveUrl = videoUrl.split('/d/')[1];
            const driveID = driveUrl.split('/view')[0];
            setUrl(driveID);

        } else {
            setUrl(videoUrl);
        }

    }, [videoUrl]);


    if (!show) return null;

    return (
        <>
            {!isYouTubeUrl ? (
                <div className="modal d-block fade show mt-0" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                    <div className="modal-dialog modal-dialog-centered z-3 px-2" role="document">
                        <div className="modal-content p-3">
                            <div className="text-center position-relative">
                                <iframe
                                    src={`https://drive.google.com/file/d/${url}/preview`}
                                    width="100%"
                                    height="360"
                                    allow="autoplay"
                                    allowFullScreen
                                    title="Drive Video"
                                ></iframe>
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="btn btn-dark position-absolute cursor-pointer px-1 py-2"
                                    style={{ top: 10, right: 10, zIndex: 1100 }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="modal d-block fade show mt-0" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                    <div className="modal-dialog modal-dialog-centered z-3 px-2" role="document">
                        <div className="modal-content p-4">
                            <div className="text-center">
                                <iframe
                                    width="100%"
                                    height="200"
                                    src={`https://www.youtube.com/embed/${url}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                                <span className='position-absolute top-0 right-0 cursor-pointer' onClick={onClose}>✕</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default VideoModalService;
