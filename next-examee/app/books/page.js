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

                {/* Hero / Header Section */}
                <div className="eb-hero-explorer mb-4">
                    <div className="eb-hero-inner rounded-4 shadow-premium-v4 text-white">
                        <div className="row align-items-center g-4">
                            <div className="col-lg-7">
                                <div className="eb-hero-pre-v5 mb-3">
                                    <span className="eb-dot-pulse-v5"></span>
                                    <span className="eb-pre-text-v5">EXAMEE DIGITAL LIBRARY <i className="fa-solid fa-crown ms-1 text-warning"></i></span>
                                </div>
                                <h1 className="eb-hero-title-v5 mb-2">
                                    Curated Academic <span className="text-grad-v5">Excellence</span>
                                </h1>
                                <p className="eb-hero-sub-v5 mb-2 opacity-75">
                                    Explore 5,000+ textbooks and research materials designed for high-performance students.
                                </p>
                                <div className="eb-hero-stats-v5 d-flex gap-4">
                                    <div className="eb-s-item">
                                        <div className="eb-s-val">HD</div>
                                        <div className="eb-s-lbl">Quality</div>
                                    </div>
                                    <div className="eb-s-item">
                                        <div className="eb-s-val">24/7</div>
                                        <div className="eb-s-lbl">Access</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-5">
                                <div className="eb-search-box-v5 shadow-sm">
                                    <i className="fa-solid fa-magnifying-glass eb-s-icon-v5"></i>
                                    <input
                                        type="text"
                                        placeholder="Search title, author or tags..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="mt-3 d-flex gap-2 flex-wrap">
                                    {['Engineering', 'Medical', 'Management'].map(t => (
                                        <button key={t} className="eb-hero-tag" onClick={() => setSearchQuery(t)}>{t}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Filter Bar */}
                <div className="eb-filter-bar shadow-sm">
                    <div className="eb-filter-inner d-flex align-items-center justify-content-between">
                        <div className="eb-category-nav d-flex gap-1 overflow-auto">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    className={`eb-nav-item ${activeCategory === cat ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div className="eb-results-info d-none d-md-block">
                            <span className="fw-700">{filteredBooks.length}</span> Resources
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="eb-main-explorer mt-4">
                    {/* Grid Content */}
                    <div className="eb-grid-content" style={isLocked ? { filter: 'blur(8px)', pointerEvents: 'none', userSelect: 'none' } : {}}>
                        <div className="row g-3 g-md-4">
                            {loading ? (
                                skeletons.map(i => (
                                    <div key={i} className="col-6 col-sm-4 col-md-3 col-xl-2">
                                        <div className="eb-book-card-v5">
                                            <div className="eb-book-cover-wrap-v5 eb-skel"></div>
                                            <div className="pt-2">
                                                <div className="eb-skel" style={{ height: '12px', borderRadius: '4px', marginBottom: '6px', width: '85%' }}></div>
                                                <div className="eb-skel" style={{ height: '10px', borderRadius: '4px', width: '60%' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : filteredBooks.length > 0 ? (
                                filteredBooks.map(book => (
                                    <div key={book._id} className="col-6 col-sm-4 col-md-3 col-xl-2">
                                        <div className="eb-book-card-v5" onClick={() => handleOpenBook(book)}>
                                            <div className="eb-book-cover-wrap-v5">
                                                {book.coverImage ? (
                                                    <img src={book.coverImage} alt={book.title} className="eb-book-img" />
                                                ) : (
                                                    <div className="eb-book-no-cover">
                                                        <i className="fa-solid fa-book"></i>
                                                    </div>
                                                )}
                                                <div className="eb-book-overlay-v5">
                                                    <button className="eb-book-btn-v5 px-3 py-1 fw-700">Open</button>
                                                </div>
                                                {book.isPremium && <span className="eb-prem-badge-v5"><i className="fa-solid fa-crown"></i></span>}
                                            </div>
                                            <div className="eb-book-meta-v5 pt-2">
                                                <h3 className="eb-book-title-v5">{book.title}</h3>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="eb-book-author-v5">by {book.author.split(' ')[0]}</span>
                                                    <span className="eb-book-stats-v5"><i className="fa-solid fa-eye me-1"></i>{book.accessCount || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-12">
                                    <div className="eb-empty-v5 text-center py-5">
                                        <i className="fa-solid fa-book-open display-4 opacity-10 mb-3 d-block"></i>
                                        <h4 className="fw-800">No resources found</h4>
                                        <p className="text-muted smaller">Try adjusting your filters or search keywords.</p>
                                        <button className="btn btn-dark btn-sm rounded-pill px-4 mt-2" onClick={() => { setActiveCategory('All Books'); setSearchQuery(''); }}>Reset Explorer</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {isLocked && (
                    <div className="eb-locked-overlay-v5">
                        <div className="eb-locked-card-v5 text-center shadow-premium bg-white border">
                            <div className="eb-lock-ico mb-3">
                                <i className="fa-solid fa-lock"></i>
                            </div>
                            <h5 className="fw-900 mb-2">Library Locked</h5>
                            <p className="text-muted smaller mb-4">Upgrade to <span className="text-primary fw-bold">Plus or Pro</span> for instant access to 5,000+ textbooks and journals.</p>
                            <button className="btn btn-dark w-100 py-2 rounded-4 fw-800" onClick={() => router.push('/plans')}>
                                VIEW PLANS <i className="fa-solid fa-arrow-right ms-1"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .eb-container { max-width: 1600px; margin: 0 auto; position: relative; }
                
                /* Hero V5 Dashboard Style */
                .eb-hero-explorer { margin-bottom: 2rem; }
                .eb-hero-inner { }
                .eb-hero-pre-v5 { display: inline-flex; align-items: center; gap: 8px; background: rgba(119, 226, 221, 0.1); color: #0f172a; padding: 5px 12px; border-radius: 100px; }
                .eb-dot-pulse-v5 { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.4);  animation: pulse 2s infinite; }
                .eb-pre-text-v5 { font-size: 0.65rem; font-weight: 800; letter-spacing: 0.08em; }
                .eb-hero-title-v5 { font-size: 2.5rem; font-weight: 900; letter-spacing: -0.04em; color: #0f172a; }
                .text-grad-v5 { background: linear-gradient(135deg, #22c55e 0%, #10b981 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .eb-hero-sub-v5 { font-size: 1rem; max-width: 500px; color: #0f172a;}
                .eb-hero-stats-v5 { color: #22c55e;}
                .eb-s-item { }
                .eb-s-val { font-size: 1.25rem; font-weight: 900; }
                .eb-s-lbl { font-size: 0.65rem; font-weight: 700; color: #000000ff; opacity: 0.6; text-transform: uppercase; }

                .eb-search-box-v5 { background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px); border-radius: 50px; display: flex; align-items: center; gap: 12px; padding: 12px 20px; border: 1.5px solid #f1f5f9; }
                .eb-s-icon-v5 { color: #94a3b8; }
                .eb-search-box-v5 input { border: none; background: transparent; outline: none; width: 100%; font-size: 1rem; font-weight: 400; color: #0f172a; }
                .eb-hero-tag { background: rgba(154, 147, 147, 0.1); border: none; color: #000000ff; padding: 4px 14px; border-radius: 100px; font-size: 0.75rem; font-weight: 600; transition: 0.2s; }
                .eb-hero-tag:hover { background: rgba(149, 149, 149, 0.2); }

                /* Sticky Filter V5 */
                .eb-filter-bar { position: sticky; top: 0px; z-index: 100; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); padding: 12px 0; border-radius: 12px; border: 1px solid #f8fafc; margin: 0 -15px; padding: 10px 15px; }
                .eb-category-nav::-webkit-scrollbar { display: none; }
                .eb-nav-item { border: none; background: transparent; padding: 6px 16px; font-size: 0.82rem; font-weight: 700; color: #64748b; border-radius: 8px; white-space: nowrap; transition: 0.2s; }
                .eb-nav-item:hover { color: #04bd20; background: #f0fdf4; }
                .eb-nav-item.active { background: #0f172a; color: #fff; }
                .eb-results-info { font-size: 0.8rem; color: #94a3b8; }

                /* Dense Grid V5 */
                .eb-book-card-v5 { cursor: pointer; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .eb-book-card-v5:hover { transform: translateY(-6px); }
                .eb-book-cover-wrap-v5 { position: relative; aspect-ratio: 1/1.4; border-radius: 8px; overflow: hidden; background: transparent; }
                .eb-book-img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
                .eb-book-card-v5:hover .eb-book-img { transform: scale(1.08); }
                .eb-book-overlay-v5 { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; }
                .eb-book-card-v5:hover .eb-book-overlay-v5 { opacity: 1; }
                .eb-book-btn-v5 { border: none; background: #fff; color: #0f172a; border-radius: 6px; font-size: 0.8rem; }
                .eb-prem-badge-v5 { position: absolute; top: 8px; left: 8px; width: 22px; height: 22px; background: #f59e0b; color: #fff; display: flex; align-items: center; justify-content: center; border-radius: 4px; font-size: 0.7rem; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
                
                .eb-book-title-v5 { font-size: 0.85rem; font-weight: 700; color: #1e293b; margin-bottom: 2px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 2.3rem; line-height: 1.35; }
                .eb-book-author-v5 { font-size: 0.68rem; font-weight: 600; color: #94a3b8; }
                .eb-book-stats-v5 { font-size: 0.68rem; font-weight: 700; color: #cbd5e1; }

                .eb-skel { background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 8px; }
                @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
                @keyframes pulse {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
                    70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
                }

                /* Locked V5 */
                .eb-locked-overlay-v5 { position: absolute; top: 400px; left: 0; right: 0; z-index: 50; display: flex; justify-content: center; padding: 0 20px; }
                .eb-locked-card-v5 { background: #fff; border-radius: 12px; width: 100%; max-width: 360px; padding: 32px; }
                .eb-lock-ico { width: 48px; height: 48px; background: #fff1f2; color: #f43f5e; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin: 0 auto; font-size: 1.4rem; border: 1.5px solid #ffe4e6; }

                @media (max-width: 768px) {
                    .eb-hero-title-v5 { font-size: 1.8rem; }
                    .eb-hero-sub-v5 { font-size: 0.85rem; }
                    .eb-locked-overlay-v5 { top: 320px; }
                }
            `}</style>


        </StudentLayout>
    );
}
