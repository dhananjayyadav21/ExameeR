"use client";
import React, { useState } from 'react';
import '../../../styles/dashboard-help.css';

export default function HelpCenterPage() {
    const [activeTab, setActiveTab] = useState('faq');
    const [searchQuery, setSearchQuery] = useState('');

    const faqs = [
        {
            category: "Getting Started",
            questions: [
                { q: "How do I create a new course?", a: "Navigate to the Courses section from the sidebar and click on the 'New Course' button. Fill in the required details, upload your curriculum, and hit publish!" },
                { q: "How can I upload study notes?", a: "Go to the Study Notes page and click 'Upload New'. You can drag and drop your PDF files and categorize them by subject." }
            ]
        },
        {
            category: "Account & Settings",
            questions: [
                { q: "How do I change my password?", a: "Go to the Settings page, navigate to the Security tab, and enter your current password along with your new password to update it." },
                { q: "Can I upgrade my plan?", a: "Yes, you can click on the 'Pro Plan' card in the sidebar or visit your Settings page to manage your subscription tier." }
            ]
        },
        {
            category: "Content Management",
            questions: [
                { q: "How do I edit an existing video lecture?", a: "Go to Video Lectures, find the video in the list, and click the edit (pencil) icon on the right side of the row." },
                { q: "Can I draft a course without publishing?", a: "Yes! When creating or editing a course, set the 'Publishing Status' to 'Draft (Internal Only)'." }
            ]
        }
    ];

    const filteredFaqs = faqs.map(category => ({
        ...category,
        questions: category.questions.filter(faq =>
            faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    return (
        <section className="hc-page">
            <div className="hc-header">
                <div className="hc-blob hc-blob1"></div>
                <div className="hc-blob hc-blob2"></div>

                <div className="hc-header-content text-center">
                    <div className="hc-icon-wrapper mb-3 mx-auto">
                        <i className="fa-solid fa-headset"></i>
                    </div>
                    <h1 className="hc-title">How can we help you?</h1>
                    <p className="hc-subtitle">Search for answers or browse our frequently asked questions.</p>

                    <div className="hc-search-box mx-auto mt-4">
                        <i className="fa-solid fa-magnifying-glass hc-search-icon"></i>
                        <input
                            type="text"
                            className="hc-search-input"
                            placeholder="Search articles, guides, or ask a question..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className="hc-search-clear" onClick={() => setSearchQuery('')}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="container" style={{ marginTop: '-40px', position: 'relative', zIndex: 10 }}>
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        {/* Quick Contact Cards */}
                        <div className="row g-4 mb-5">
                            <div className="col-md-4">
                                <div className="hc-contact-card">
                                    <div className="hc-cc-icon" style={{ background: 'rgba(14,165,233,0.1)', color: '#0ea5e9' }}>
                                        <i className="fa-solid fa-book-open-reader"></i>
                                    </div>
                                    <h3 className="hc-cc-title">Documentation</h3>
                                    <p className="hc-cc-desc">Read our detailed guides and tutorials.</p>
                                    <a href="#" className="hc-cc-link" style={{ color: '#0ea5e9' }}>Browse Docs <i className="fa-solid fa-arrow-right ms-1"></i></a>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="hc-contact-card">
                                    <div className="hc-cc-icon" style={{ background: 'rgba(4,189,32,0.1)', color: '#04bd20' }}>
                                        <i className="fa-solid fa-envelope-open-text"></i>
                                    </div>
                                    <h3 className="hc-cc-title">Email Support</h3>
                                    <p className="hc-cc-desc">Get help from our support team via email.</p>
                                    <a href="mailto:support@examee.com" className="hc-cc-link" style={{ color: '#04bd20' }}>Contact Us <i className="fa-solid fa-arrow-right ms-1"></i></a>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="hc-contact-card">
                                    <div className="hc-cc-icon" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                                        <i className="fa-brands fa-discord"></i>
                                    </div>
                                    <h3 className="hc-cc-title">Community</h3>
                                    <p className="hc-cc-desc">Join our Discord server to connect with others.</p>
                                    <a href="#" className="hc-cc-link" style={{ color: '#8b5cf6' }}>Join Discord <i className="fa-solid fa-arrow-right ms-1"></i></a>
                                </div>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="hc-tabs">
                            <button className={`hc-tab ${activeTab === 'faq' ? 'active' : ''}`} onClick={() => setActiveTab('faq')}>
                                <i className="fa-solid fa-clipboard-question me-2"></i> FAQs
                            </button>
                            <button className={`hc-tab ${activeTab === 'guides' ? 'active' : ''}`} onClick={() => setActiveTab('guides')}>
                                <i className="fa-solid fa-laptop-code me-2"></i> Video Guides
                            </button>
                            <button className={`hc-tab ${activeTab === 'ticket' ? 'active' : ''}`} onClick={() => setActiveTab('ticket')}>
                                <i className="fa-solid fa-ticket me-2"></i> Submit Ticket
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="hc-content-area">
                            {activeTab === 'faq' && (
                                <div className="hc-faq-section">
                                    {filteredFaqs.length > 0 ? (
                                        filteredFaqs.map((category, idx) => (
                                            <div key={idx} className="mb-4">
                                                <h4 className="hc-faq-cat-title">{category.category}</h4>
                                                <div className="hc-faq-list">
                                                    {category.questions.map((faq, fIdx) => (
                                                        <div className="hc-faq-item" key={fIdx}>
                                                            <div className="hc-faq-q">
                                                                <i className="fa-solid fa-circle-info hc-faq-bullet"></i>
                                                                {faq.q}
                                                            </div>
                                                            <div className="hc-faq-a">{faq.a}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-5">
                                            <i className="fa-solid fa-magnifying-glass-minus mb-3" style={{ fontSize: '2.5rem', color: '#cbd5e1' }}></i>
                                            <h4 style={{ color: '#64748b', fontWeight: 600 }}>No results found for "{searchQuery}"</h4>
                                            <p style={{ color: '#94a3b8' }}>Try adjusting your search terms.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'guides' && (
                                <div className="text-center py-5">
                                    <i className="fa-solid fa-person-digging mb-3" style={{ fontSize: '3rem', color: '#cbd5e1' }}></i>
                                    <h3 style={{ color: '#0f172a', fontWeight: 700 }}>Video Guides Coming Soon</h3>
                                    <p style={{ color: '#64748b' }}>We are currently building out a library of video tutorials to help you get the most out of Examee.</p>
                                </div>
                            )}

                            {activeTab === 'ticket' && (
                                <div className="hc-ticket-form">
                                    <h3 className="mb-4" style={{ fontWeight: 700, color: '#0f172a' }}>Open a Support Ticket</h3>
                                    <form>
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>Subject</label>
                                            <input type="text" className="hc-input" placeholder="What do you need help with?" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>Category</label>
                                            <select className="hc-input">
                                                <option>Technical Issue</option>
                                                <option>Billing Question</option>
                                                <option>Feature Request</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', color: '#374151' }}>Description</label>
                                            <textarea className="hc-input" rows="4" placeholder="Please provide as much detail as possible..."></textarea>
                                        </div>
                                        <button type="button" className="btn btn-success px-4 py-2" style={{ background: 'linear-gradient(135deg, #04bd20, #029d1a)', border: 'none', borderRadius: '10px', fontWeight: 700 }}>
                                            Submit Ticket <i className="fa-solid fa-paper-plane ms-2"></i>
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

        </section>
    );
}
