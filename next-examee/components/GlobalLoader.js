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
                <p className="text-muted smaller">Building your premium experience.</p>
            </div>
        </div>
    );
};

export default GlobalLoader;
