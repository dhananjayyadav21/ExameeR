"use client";
import React, { useContext, useEffect, Suspense } from 'react'
import NotesItem from '../../components/NotesItem';
import VideoItem from '../../components/VideoItem';
import QPaperItem from '../../components/QPaperItem';
import ContentContext from '../../context/ContentContext';

function SearchContent({ setProgress = () => { } }) {
    const context = useContext(ContentContext);
    const { searchContentData = [] } = context

    useEffect(() => {
        setProgress(0);
        setProgress(100);
    }, []);

    return (
        <main className="bg-light min-vh-100 py-5">
            <div className="container px-4">
                <div className="bg-white rounded-4 shadow-sm border-0 p-5 mb-5 text-center position-relative overflow-hidden">
                    <div className="position-absolute top-0 start-0 w-100 h-100 opacity-5 bg-grid"></div>
                    <div className="position-relative z-1">
                        <h2 className="display-6 fw-bold mb-3">Found <span className="text-primary">{searchContentData.length}</span> Results</h2>
                        <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
                            "Your study material, just a click away. Smart search for smarter studies."
                        </p>
                    </div>
                </div>

                <div className="row g-4">
                    {searchContentData.length > 0 ? (
                        searchContentData.map((item, index) => {
                            const gridClass = item.type === 'video' ? 'col-lg-6' : 'col-xl-3 col-lg-4 col-md-6';
                            return (
                                <div key={index} className={gridClass}>
                                    {item.type === 'note' && <NotesItem notes={item} />}
                                    {item.type === 'pyq' && <QPaperItem pyq={item} />}
                                    {item.type === 'video' && <VideoItem video={item} />}
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-12 text-center py-5">
                            <div className="p-5 bg-white rounded-4 shadow-sm">
                                <i className="fa-solid fa-folder-open display-1 text-muted opacity-25 mb-4"></i>
                                <h4 className="text-muted">Oops! We couldn't find what you're looking for</h4>
                                <p className="text-secondary">Try adjusting your keywords or search for a different category.</p>
                                <a href="/" className="btn btn-primary rounded-pill px-5 mt-3">Back to Home</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .bg-grid { background-image: radial-gradient(var(--primary-color) 1px, transparent 1px); background-size: 20px 20px; }
            `}</style>
        </main>
    );
}

export default function SearchContentPage(props) {
    return (
        <Suspense fallback={<div className="container py-5 text-center p-5"><div className="spinner-border text-primary" role="status"></div></div>}>
            <SearchContent {...props} />
        </Suspense>
    );
}
