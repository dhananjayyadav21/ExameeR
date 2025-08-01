import React, { useState, useEffect } from 'react';

const VideoModalService = ({ videoUrl, footer, header, videoContainerRef, handleFullscreen }) => {
    const [url, setUrl] = useState(videoUrl);
    const [isDriveUrl, setIsDriveUrl] = useState(false);
    const [isYouTubeUrl, setIsYouTubeUrl] = useState(false);

    console.log("url---", videoUrl)

    useEffect(() => {
        if (!videoUrl) return;

        const isYT = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
        setIsYouTubeUrl(isYT);

        const isDriveUrl = videoUrl.includes("drive.google.com") || videoUrl.includes("drive");
        setIsDriveUrl(isDriveUrl);


        if (isYT) {
            const srcMatch = videoUrl.match(/src="([^"]+)"/);
            const srcUrl = srcMatch ? srcMatch[1] : videoUrl;

            let iframeVideoId = srcUrl.split('/embed/')[1];
            iframeVideoId = iframeVideoId.split('&&')[0];
            setUrl(iframeVideoId);
            console.log("iframeVideoId---", iframeVideoId)


        } else if (isDriveUrl) {

            const driveUrl = videoUrl.split('/d/')[1];
            const driveID = driveUrl.split('/view')[0];
            setUrl(driveID);

        } else {
            setUrl(videoUrl);
        }

    }, [videoUrl]);

    return (
        <>
            {isYouTubeUrl && (
                <>
                    <div className="card shadow-sm video-item my-3 p-2 rounded-3" style={{ minHeight: "400px" }}>
                        <div className='position-relative video-container' ref={videoContainerRef}>
                            <div className="video-player-header bg-white d-flex justify-content-start align-items-center p-1">
                                <div className="video-zoom bg-light cursor-pointer d-flex justify-content-center align-items-center" onClick={handleFullscreen}>
                                    <img src="assets/img/zoom-in.png" alt="zoom" height={30} width={30} />
                                </div>
                                <h6 className="card-title px-2">{(header).slice(0, 50)}..</h6>
                            </div>
                            {/* <div className="video-zoom-mobile bg-danger d-none">
                                    <img src="assets/img/zoom-in.png" alt="zoom" height={20} width={20} />
                                </div> */
                            }
                            <iframe
                                className='video-frame'
                                src={`https://www.youtube.com/embed/${url}`}
                                title="YouTube video player"
                                FrameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                            <div className="video-player-footer bg-white d-flex justify-content-start">
                                <h6 class="fw-bold px-2">Benefits:</h6>
                            </div>
                        </div>

                        <div className="border-top">
                            <p className="card-body text-muted">{(footer).slice(0, 120)}..</p>
                        </div>

                    </div>
                </>
            )}

            {isDriveUrl &&
                (
                    <div className="card shadow-sm video-item my-3 p-2 rounded-3" style={{ minHeight: "400px" }}>
                        <div className='position-relative video-container' ref={videoContainerRef}>
                            <div className="video-player-header bg-white d-flex justify-content-start align-items-center p-1">
                                <div className="video-zoom bg-light cursor-pointer d-flex justify-content-center align-items-center" onClick={handleFullscreen}>
                                    <img src="assets/img/zoom-in.png" alt="zoom" height={30} width={30} />
                                </div>
                                <h6 className="card-title px-2">{(header).slice(0, 50)}..</h6>
                            </div>
                            {/* <div className="video-zoom-mobile bg-danger d-none">
                                    <img src="assets/img/zoom-in.png" alt="zoom" height={20} width={20} />
                                </div> */
                            }
                            <iframe
                                className='video-frame'
                                src={`https://drive.google.com/file/d/${url}/preview`}
                                title="YouTube video player"
                                FrameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                            <div className="video-player-footer bg-white d-flex justify-content-start">
                                <h6 class="fw-bold px-2">Benefits:</h6>
                            </div>
                        </div>

                        <div className="border-top">
                            <p className="card-body text-muted">{(footer).slice(0, 120)}..</p>
                        </div>
                    </div>
                )}


            {!isDriveUrl && !isYouTubeUrl &&
                (
                    <div className="card shadow-sm video-item my-3 p-2 rounded-3" style={{ minHeight: "400px" }}>
                        <div className='position-relative video-container' ref={videoContainerRef}>
                            <div className="video-player-header bg-white d-flex justify-content-start align-items-center p-1">
                                <div className="video-zoom bg-light cursor-pointer d-flex justify-content-center align-items-center" onClick={handleFullscreen}>
                                    <img src="assets/img/zoom-in.png" alt="zoom" height={30} width={30} />
                                </div>
                                <h6 className="card-title px-2">{(header).slice(0, 50)}..</h6>
                            </div>
                            {/* <div className="video-zoom-mobile bg-danger d-none">
                                    <img src="assets/img/zoom-in.png" alt="zoom" height={20} width={20} />
                                </div> */
                            }
                            <iframe
                                className='video-frame'
                                src={`https://www.youtube.com/embed/${url}`}
                                title="YouTube video player"
                                FrameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                            <div class="video-player-footer bg-white d-flex justify-content-start">
                                <h6 class="fw-bold px-2">Benefits:</h6>
                            </div>
                        </div>

                        <div className="border-top">
                            <p className="card-body text-muted">{(footer).slice(0, 120)}..</p>
                        </div>
                    </div>
                )}
        </>
    );
};

export default VideoModalService;
