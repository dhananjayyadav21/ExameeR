"use client";
import React, { useState, useEffect, useContext } from 'react';
import ContentContext from '@/context/ContentContext';

const GlobalLoader = () => {
    const { loading } = useContext(ContentContext);
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        let timer;
        if (loading) {
            timer = setTimeout(() => {
                setShowLoader(true);
            }, 1000); // Show only if loading takes more than 1 second
        } else {
            setShowLoader(false);
            if (timer) clearTimeout(timer);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [loading]);

    if (!showLoader) return null;

    return (
        <div className="global-loader-overlay">
            <div className="loader-content text-center">
                <div className="spinner-grow text-green mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="fw-semibold text-dark">Preparing your content...</h5>
                <p className="text-muted small">This is taking a bit longer than usual, please wait.</p>
            </div>

            <style jsx>{`
                .global-loader-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(5px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    animation: fadeIn 0.3s ease;
                }
                .text-green {
                    color: #04bd20 !important;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default GlobalLoader;
