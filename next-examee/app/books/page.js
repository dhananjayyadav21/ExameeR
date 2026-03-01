"use client";
import React, { useState } from 'react';
import StudentLayout from '../../components/Home/StudentLayout';

const CATEGORIES = ['All Books', 'Engineering', 'Medical', 'Management', 'Law', 'Commerce'];

const DUMMY_BOOKS = [
    { id: 1, title: "Advanced Engineering Mathematics", author: "Dr. R.K. Jain", category: "Engineering", price: "Free", rating: 4.8, image: "https://images.unsplash.com/photo-1543003919-a995d5255782?auto=format&fit=crop&q=80&w=300&h=400" },
    { id: 2, title: "Modern Physics for Scientists", author: "Arthur Beiser", category: "Engineering", price: "Premium", rating: 4.9, image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=300&h=400" },
    { id: 3, title: "Principles of Marketing", author: "Philip Kotler", category: "Management", price: "Free", rating: 4.7, image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&q=80&w=300&h=400" },
    { id: 4, title: "Anatomy & Physiology", author: "Kevin T. Patton", category: "Medical", price: "Free", rating: 4.6, image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=300&h=400" },
    { id: 5, title: "Corporate Law Essentials", author: "James Chen", category: "Law", price: "Premium", rating: 4.5, image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=300&h=400" },
    { id: 6, title: "Financial Accounting", author: "Jerry J. Weygandt", category: "Commerce", price: "Free", rating: 4.7, image: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=300&h=400" },
];

export default function BooksPage() {
    const [activeCategory, setActiveCategory] = useState('All Books');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredBooks = DUMMY_BOOKS.filter(book =>
        (activeCategory === 'All Books' || book.category === activeCategory) &&
        (book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <StudentLayout title="Examee Books">
            <div className="container-fluid px-0 pb-5 eb-container">
                {/* Hero / Header */}
                <div className="eb-header mb-5">
                    <div className="eb-header-content">
                        <h1 className="eb-title mb-2">Examee Digital Library</h1>
                        <p className="eb-subtitle text-muted mb-4">Explore thousands of academic resources, textbooks, and research papers.</p>

                        <div className="eb-search-box shadow-sm">
                            <i className="fa-solid fa-magnifying-glass eb-search-icon"></i>
                            <input
                                type="text"
                                placeholder="Search by title, author, or ISBN..."
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
                <div className="row g-4">
                    {filteredBooks.map(book => (
                        <div key={book.id} className="col-6 col-md-4 col-lg-3 col-xl-2">
                            <div className="eb-book-card">
                                <div className="eb-book-cover-wrapper">
                                    <img src={book.image} alt={book.title} className="eb-book-cover" />
                                    <div className="eb-book-overlay">
                                        <button className="eb-book-action-btn">
                                            <i className="fa-solid fa-plus me-1"></i> Add
                                        </button>
                                    </div>
                                    {book.price === 'Premium' && <span className="eb-badge-premium">Premium</span>}
                                </div>
                                <div className="eb-book-info pt-3">
                                    <h3 className="eb-book-title mb-1">{book.title}</h3>
                                    <p className="eb-book-author mb-2 text-muted">{book.author}</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="eb-book-rating">
                                            <i className="fa-solid fa-star text-warning me-1"></i> {book.rating}
                                        </span>
                                        <span className={`eb-book-price ${book.price === 'Free' ? 'text-green' : 'text-primary'}`}>
                                            {book.price}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredBooks.length === 0 && (
                    <div className="text-center py-5">
                        <i className="fa-solid fa-book-open display-1 opacity-10 mb-4 d-block"></i>
                        <h4 className="text-muted">No books found matching your criteria</h4>
                    </div>
                )}
            </div>

            <style jsx>{`
                .eb-container { max-width: 1400px; margin: 0 auto; }
                .eb-title { font-size: 1.8rem; font-weight: 700; color: #0f172a; letter-spacing: -0.02em; }
                .eb-subtitle { font-size: 0.88rem; font-weight: 400; max-width: 600px; }

                .eb-search-box {
                    background: #fff;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    padding: 4px 16px;
                    max-width: 500px;
                }
                .eb-search-icon { color: #94a3b8; margin-right: 12px; font-size: 0.9rem; }
                .eb-search-input { border: none; padding: 10px 0; width: 100%; font-size: 0.82rem; outline: none; }

                .eb-nav-scroller { overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
                .eb-nav-scroller::-webkit-scrollbar { display: none; }

                .eb-cat-btn {
                    white-space: nowrap;
                    padding: 8px 18px;
                    border: 1px solid #e2e8f0;
                    background: #fff;
                    border-radius: 10px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #64748b;
                    transition: all 0.2s;
                }
                .eb-cat-btn:hover { border-color: #04bd20; color: #0f172a; }
                .eb-cat-btn.active { background: #0f172a; color: #fff; border-color: #0f172a; }

                .eb-book-card { height: 100%; transition: transform 0.3s; }
                .eb-book-card:hover { transform: translateY(-5px); }
                
                .eb-book-cover-wrapper {
                    position: relative;
                    aspect-ratio: 3/4;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    background: #f1f5f9;
                }
                .eb-book-cover { width: 100%; height: 100%; object-fit: cover; }
                .eb-book-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .eb-book-card:hover .eb-book-overlay { opacity: 1; }
                .eb-book-action-btn {
                    padding: 8px 16px;
                    background: #04bd20;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-size: 0.72rem;
                    font-weight: 700;
                }

                .eb-badge-premium {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: #0f172a;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-size: 0.6rem;
                    font-weight: 800;
                    text-transform: uppercase;
                }

                .eb-book-title { font-size: 0.88rem; font-weight: 600; color: #0f172a; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 2.6rem; }
                .eb-book-author { font-size: 0.75rem; }
                .eb-book-rating { font-size: 0.72rem; font-weight: 700; color: #475569; }
                .eb-book-price { font-size: 0.72rem; font-weight: 700; }
                .text-green { color: #04bd20; }

                @media (max-width: 768px) {
                    .eb-title { font-size: 1.5rem; }
                }
            `}</style>
        </StudentLayout>
    );
}
