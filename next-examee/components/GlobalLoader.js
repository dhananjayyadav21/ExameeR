"use client";
import React, { useState, useEffect, useContext } from 'react';
import ContentContext from '@/context/ContentContext';

const GlobalLoader = () => {
    const { loading } = useContext(ContentContext);
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        if (loading) {
            setShowLoader(true);
        } else {
            setShowLoader(false);
        }
    }, [loading]);

    if (!showLoader) return null;

    return (
        <div className="global-loader-overlay">
            <div className="loader-container text-center">
                <div className="premium-spinner mb-2"></div>
                <div className="loader-text mt-3">
                    <h5 className="mb-1">Examee is preparing</h5>
                    <p className="mb-0">Crafting your premium experience...</p>
                </div>
            </div>
        </div>
    );
};

export default GlobalLoader;
