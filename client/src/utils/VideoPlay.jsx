import React from 'react';

const VideoModalService = ({ videoUrl, show, onClose }) => {
    if (!show) return null;

    return (
        <>
            <div className="modal d-block fade show mt-0" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                <div className="modal-dialog modal-dialog-centered z-3 px-2" role="document">
                    <div className="modal-content p-3">
                        <div className="text-center">
                            <video controls autoPlay className="videoPlayer object-contain rounded-4 position-relative">
                                <source src={videoUrl} type="video/mp4" />
                            </video>
                            <span className='position-absolute top-0 right-0 cursor-pointer' onClick={onClose}>
                                ✕
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VideoModalService;
