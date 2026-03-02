"use client";
import React, { useState, useEffect, useContext } from 'react';
import StudentLayout from '../../components/Home/StudentLayout';
import PageBanners from '../../components/PageBanners';
import ContentContext from '../../context/ContentContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const CATEGORIES = ['All Books', 'Engineering', 'Medical', 'Management', 'Law', 'Commerce', 'Science', 'Arts', 'Other'];

function getToken() {
    try { return localStorage.getItem('token') || ''; } catch { return ''; }
}

export default function BooksPage() {
    const { userData } = useContext(ContentContext);
    const userPlan = userData?.Plan || 'e0';
    const router = useRouter();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All Books');
    const [searchQuery, setSearchQuery] = useState('');

    const isLocked = userPlan === 'e0';

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/books');
            const data = await res.json();
            if (data.success) setBooks(data.books);
        } catch { /* silently fail */ }
        setLoading(false);
    };

    const handleOpenBook = async (book) => {
        if (isLocked) { router.push('/plans'); return; }
        if (book.isPremium && userPlan === 'e0') { router.push('/plans'); return; }

        // Track access in background
        const token = getToken();
        if (token) {
            fetch('/api/books/access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', AuthToken: token },
                body: JSON.stringify({ bookId: book._id, action: 'view' }),
            }).catch(() => { });
        }

        if (book.fileUrl) {
            window.open(book.fileUrl, '_blank');
        } else {
            toast.info('No file linked to this book yet.');
        }
    };

    const filteredBooks = books.filter(book =>
        (activeCategory === 'All Books' || book.category === activeCategory) &&
        (book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (book.author || '').toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const skeletons = [1, 2, 3, 4, 5, 6];

    return (
        <StudentLayout title="Examee Books">
            <div className="container-fluid px-0 pb-5 eb-container">
                {/* Banners */}
                <PageBanners page="books" />

                {/* Hero / Header */}
                <div className="eb-header mb-4">
                    <div className="eb-header-content">
                        <h1 className="eb-title mb-2">Examee Digital Library</h1>
                        <p className="eb-subtitle text-muted mb-4">Explore curated textbooks, reference books, and academic resources.</p>

                        <div className="eb-search-box shadow-sm">
                            <i className="fa-solid fa-magnifying-glass eb-search-icon"></i>
                            <input
                                type="text"
                                placeholder="Search by title or author..."
                                className="eb-search-input"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="eb-nav-scroller mb-4">
                    <div className="d-flex gap-2 pb-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`eb-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="row g-4" style={isLocked ? { filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none' } : {}}>
                    {loading ? (
                        skeletons.map(i => (
                            <div key={i} className="col-6 col-md-4 col-lg-3 col-xl-2">
                                <div className="eb-book-card">
                                    <div className="eb-book-cover-wrapper eb-skel"></div>
                                    <div className="pt-3">
                                        <div className="eb-skel" style={{ height: '13px', borderRadius: '6px', marginBottom: '8px', width: '80%' }}></div>
                                        <div className="eb-skel" style={{ height: '11px', borderRadius: '6px', width: '55%' }}></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : filteredBooks.map(book => (
                        <div key={book._id} className="col-6 col-md-4 col-lg-3 col-xl-2">
                            <div className="eb-book-card" onClick={() => handleOpenBook(book)} style={{ cursor: 'pointer' }}>
                                <div className="eb-book-cover-wrapper">
                                    {book.coverImage ? (
                                        <img src={book.coverImage} alt={book.title} className="eb-book-cover" />
                                    ) : (
                                        <div className="eb-book-no-cover">
                                            <i className="fa-solid fa-book"></i>
                                        </div>
                                    )}
                                    <div className="eb-book-overlay">
                                        <button className="eb-book-action-btn">
                                            <i className="fa-solid fa-eye me-1"></i> Open
                                        </button>
                                    </div>
                                    {book.isPremium && <span className="eb-badge-premium"><i className="fa-solid fa-crown me-1"></i>Premium</span>}
                                    {book.fileType && <span className="eb-badge-type">{book.fileType.toUpperCase()}</span>}
                                </div>
                                <div className="eb-book-info pt-3">
                                    <h3 className="eb-book-title mb-1">{book.title}</h3>
                                    <p className="eb-book-author mb-2">{book.author}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="eb-book-cat">{book.category}</span>
                                        <span className="eb-book-opens">
                                            <i className="fa-solid fa-eye me-1"></i>{book.accessCount || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {!loading && filteredBooks.length === 0 && !isLocked && (
                    <div className="text-center py-5">
                        <i className="fa-solid fa-book-open display-1 opacity-10 mb-4 d-block"></i>
                        <h4 className="text-muted">No books found</h4>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>Try a different category or search term.</p>
                    </div>
                )}

                {isLocked && (
                    <div className="eb-locked-overlay">
                        <div className="eb-locked-content text-center shadow-lg border">
                            <div className="eb-lock-icon mb-4">
                                <i className="fa-solid fa-crown"></i>
                            </div>
                            <h2 className="eb-locked-title fw-black mb-3">Examee Digital Library is Premium</h2>
                            <p className="eb-locked-text mb-4">Access textbooks, research journals, and study materials curated for your exams.</p>
                            <div className="eb-locked-badges mb-4 d-flex gap-2 justify-content-center">
                                <span className="badge rounded-pill bg-purple-soft text-purple px-3">Plus Access</span>
                                <span className="badge rounded-pill bg-amber-soft text-amber px-3">Pro Access</span>
                            </div>
                            <button className="btn btn-dark btn-lg fw-black px-5 rounded-pill" onClick={() => router.push('/plans')}>
                                UNLOCK LIBRARY NOW <i className="fa-solid fa-arrow-right ms-2"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .eb-container { max-width: 1400px; margin: 0 auto; }
                .eb-title { font-size: 1.8rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; }
                .eb-subtitle { font-size: 0.88rem; font-weight: 400; max-width: 600px; }

                .eb-search-box { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; display: flex; align-items: center; padding: 4px 16px; max-width: 500px; }
                .eb-search-icon { color: #94a3b8; margin-right: 12px; font-size: 0.9rem; }
                .eb-search-input { border: none; padding: 10px 0; width: 100%; font-size: 0.82rem; outline: none; }

                .eb-nav-scroller { overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
                .eb-nav-scroller::-webkit-scrollbar { display: none; }
                .eb-cat-btn { white-space: nowrap; padding: 8px 18px; border: 1px solid #e2e8f0; background: #fff; border-radius: 10px; font-size: 0.75rem; font-weight: 600; color: #64748b; transition: all 0.2s; cursor: pointer; }
                .eb-cat-btn:hover { border-color: #04bd20; color: #0f172a; }
                .eb-cat-btn.active { background: #0f172a; color: #fff; border-color: #0f172a; }

                .eb-book-card { height: 100%; transition: transform 0.3s; cursor: pointer; }
                .eb-book-card:hover { transform: translateY(-5px); }
                .eb-book-cover-wrapper { position: relative; aspect-ratio: 3/4; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); background: #f1f5f9; }
                .eb-book-cover { width: 100%; height: 100%; object-fit: cover; }
                .eb-book-no-cover { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: #94a3b8; background: linear-gradient(135deg, #e2e8f0, #f1f5f9); }
                .eb-book-overlay { position: absolute; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
                .eb-book-card:hover .eb-book-overlay { opacity: 1; }
                .eb-book-action-btn { padding: 8px 16px; background: #04bd20; color: #fff; border: none; border-radius: 8px; font-size: 0.72rem; font-weight: 700; cursor: pointer; }
                .eb-badge-premium { position: absolute; top: 10px; left: 10px; background: #0f172a; color: white; padding: 3px 8px; border-radius: 6px; font-size: 0.58rem; font-weight: 800; text-transform: uppercase; }
                .eb-badge-type { position: absolute; top: 10px; right: 10px; background: rgba(255,255,255,0.9); color: #475569; padding: 3px 7px; border-radius: 6px; font-size: 0.58rem; font-weight: 800; }

                .eb-book-title { font-size: 0.88rem; font-weight: 700; color: #0f172a; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 2.6rem; margin: 0; }
                .eb-book-author { font-size: 0.72rem; color: #64748b; margin: 0; }
                .eb-book-cat { font-size: 0.62rem; font-weight: 700; color: #4f46e5; background: #f0f4ff; padding: 2px 7px; border-radius: 6px; }
                .eb-book-opens { font-size: 0.65rem; font-weight: 700; color: #94a3b8; }

                .eb-skel { background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
                @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

                /* Locked */
                .eb-locked-overlay { position: relative; margin-top: -300px; z-index: 10; padding: 40px 20px; }
                .eb-locked-content { background: white; border-radius: 24px; max-width: 600px; margin: 0 auto; padding: 48px; }
                .eb-lock-icon { width: 70px; height: 70px; background: #fffbeb; color: #f59e0b; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto; font-size: 2rem; box-shadow: 0 10px 20px rgba(245,158,11,0.2); border: 1.5px solid #fef3c7; }
                .eb-locked-title { font-size: 1.6rem; color: #0f172a; }
                .eb-locked-text { color: #64748b; font-size: 0.95rem; line-height: 1.6; }
                .fw-black { font-weight: 900; }
                .bg-purple-soft { background: #faf5ff; border: 1px solid #e9d5ff; }
                .text-purple { color: #8b5cf6; }
                .bg-amber-soft { background: #fffbeb; border: 1px solid #fef3c7; }
                .text-amber { color: #f59e0b; }

                @media (max-width: 768px) {
                    .eb-title { font-size: 1.5rem; }
                    .eb-locked-content { padding: 32px 20px; }
                }
            `}</style>
        </StudentLayout>
    );
}
