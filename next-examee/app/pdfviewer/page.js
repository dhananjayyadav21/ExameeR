"use client";
import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function PdfViewerContent({ setProgress = () => { } }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const url = searchParams.get('view');
    const iframeUrl = `https://drive.google.com/file/d/${url}/preview`

    const onClose = () => {
        router.back();
    }

    useEffect(() => {
        setProgress(0);
        setProgress(100);
    }, []);

    return (
        <main>
            <div
                className="w-100 bg-white"
                style={{ height: 'calc(100vh - 64px)', backgroundColor: 'black', zIndex: 1050, margin: 0 }}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="pdfviewer-close-btn btn btn-dark position-fixed px-2 py-4"
                    style={{ zIndex: 1100 }}
                >
                    Close
                </button>

                {/* Iframe Container */}
                <iframe
                    src={iframeUrl}
                    className="w-100 h-100 border-0"
                    title="PDF Viewer"
                ></iframe>
            </div>
            <div style={{ backgroundColor: '#1E1E1E', minHeight: "10px" }}>
            </div>
        </main>
    );
}

export default function PdfViewerPage(props) {
    return (
        <Suspense fallback={<div className="container py-5 text-center">Loading PDF Viewer...</div>}>
            <PdfViewerContent {...props} />
        </Suspense>
    );
}
