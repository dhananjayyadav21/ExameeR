"use client";
import React, { useState, useEffect, useContext } from 'react';
import ContentContext from '@/context/ContentContext';
import { usePathname } from 'next/navigation';

const GlobalLoader = ({ contextLayout = 'root' }) => {
    const { loading } = useContext(ContentContext);
    const [showLoader, setShowLoader] = useState(false);
    const pathname = usePathname() || "";

    useEffect(() => {
        if (loading) {
            setShowLoader(true);
        } else {
            setShowLoader(false);
        }
    }, [loading]);

    if (!showLoader) return null;

    const isDashboard = pathname.startsWith('/dashboard');
    const isStudent = ['/cource', '/myLearning', '/notes', '/pyq', '/profile'].some(p => pathname.startsWith(p)) && !pathname.startsWith('/dashboard');

    let activeLayout = 'root';
    if (isDashboard) {
        activeLayout = 'dashboard';
    } else if (isStudent) {
        activeLayout = 'student';
    }

    if (contextLayout !== activeLayout) return null;

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
