"use client";
import React, { useState } from 'react';

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

            <style jsx>{`
                .hc-page { min-height: 100vh; padding-bottom: 60px; }
                
                .hc-header {
                    background: linear-gradient(135deg, #0a1628 0%, #0d3320 100%);
                    padding: 60px 20px 80px;
                    border-radius: 24px;
                    color: white;
                    position: relative;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                    margin: 0 0 20px;
                }
                
                .hc-blob { position: absolute; border-radius: 50%; filter: blur(50px); opacity: 0.35; pointer-events: none; animation: float 10s infinite ease-in-out alternate; }
                @keyframes float { 0% { transform: translate(0, 0) scale(1); } 100% { transform: translate(20px, -20px) scale(1.1); } }
                .hc-blob1 { width: 300px; height: 300px; background: #04bd20; top: -100px; right: 5%; animation-delay: 0s; }
                .hc-blob2 { width: 200px; height: 200px; background: #0ea5e9; bottom: -50px; left: 10%; animation-delay: -5s; }
                
                .hc-header-content { position: relative; z-index: 2; max-width: 600px; }
                
                .hc-icon-wrapper {
                    width: 64px; height: 64px; border-radius: 20px;
                    background: rgba(255,255,255,0.1); backdrop-filter: blur(10px);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.8rem; border: 1px solid rgba(255,255,255,0.2);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
                }
                
                .hc-title { font-size: 2.2rem; font-weight: 800; color: white; margin: 0; letter-spacing: -0.02em; }
                .hc-subtitle { font-size: 1rem; color: rgba(255,255,255,0.7); margin: 8px 0 0; }
                
                .hc-search-box {
                    position: relative;
                    width: 100%;
                    max-width: 500px;
                    box-shadow: 0 12px 30px rgba(0,0,0,0.2);
                    border-radius: 16px;
                }
                
                .hc-search-icon {
                    position: absolute; left: 20px; top: 50%; transform: translateY(-50%);
                    color: #94a3b8; font-size: 1.1rem; z-index: 2;
                }
                
                .hc-search-input {
                    width: 100%;
                    padding: 16px 20px 16px 52px;
                    border-radius: 16px;
                    border: 2px solid transparent;
                    font-size: 1rem;
                    background: white;
                    color: #0f172a;
                    outline: none;
                    transition: all 0.3s;
                }
                
                .hc-search-input:focus { border-color: #04bd20; box-shadow: 0 0 0 4px rgba(4,189,32,0.15); }
                
                .hc-search-clear {
                    position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
                    background: #f1f5f9; border: none; width: 28px; height: 28px; border-radius: 50%;
                    color: #64748b; display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: 0.2s;
                }
                .hc-search-clear:hover { background: #e2e8f0; color: #ef4444; }

                /* Contact Cards */
                .hc-contact-card {
                    background: white; border-radius: 20px; padding: 24px;
                    border: 1px solid rgba(226, 232, 240, 0.8);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    height: 100%;
                    display: flex; flex-direction: column; align-items: center; text-align: center;
                }
                
                .hc-contact-card:hover { transform: translateY(-6px); box-shadow: 0 12px 30px rgba(0,0,0,0.08); border-color: #cbd5e1; }
                
                .hc-cc-icon {
                    width: 56px; height: 56px; border-radius: 16px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.5rem; margin-bottom: 16px;
                }
                
                .hc-cc-title { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0 0 6px; }
                .hc-cc-desc { font-size: 0.85rem; color: #64748b; margin: 0 0 16px; flex: 1; }
                .hc-cc-link { font-size: 0.85rem; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; }
                .hc-cc-link:hover i { transform: translateX(4px); }
                .hc-cc-link i { transition: transform 0.2s; }

                /* Tabs */
                .hc-tabs {
                    display: flex; justify-content: center; gap: 12px;
                    margin-bottom: 24px; padding-bottom: 12px;
                    border-bottom: 1px solid #f1f5f9;
                    flex-wrap: wrap;
                }
                
                .hc-tab {
                    padding: 10px 20px;
                    border-radius: 12px;
                    border: 1px solid transparent;
                    background: transparent;
                    color: #64748b;
                    font-size: 0.95rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex; align-items: center;
                }
                
                .hc-tab:hover { background: #f8fafc; color: #0f172a; }
                .hc-tab.active { background: white; color: #04bd20; border-color: #e2e8f0; box-shadow: 0 2px 10px rgba(0,0,0,0.03); }

                /* Content Area */
                .hc-content-area {
                    background: white; border-radius: 20px; padding: 32px;
                    border: 1px solid rgba(226, 232, 240, 0.8);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03);
                }

                .hc-faq-cat-title { font-size: 1rem; font-weight: 800; color: #0f172a; margin: 0 0 16px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px; }
                
                .hc-faq-list { display: flex; flex-direction: column; gap: 16px; }
                
                .hc-faq-item {
                    padding: 20px; border-radius: 16px;
                    border: 1px solid #f1f5f9; background: #f8fafc;
                    transition: all 0.2s;
                }
                
                .hc-faq-item:hover { background: white; border-color: #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
                
                .hc-faq-q { font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 8px; display: flex; align-items: flex-start; gap: 10px; }
                .hc-faq-bullet { color: #04bd20; font-size: 1.1rem; margin-top: 2px; }
                .hc-faq-a { font-size: 0.9rem; color: #475569; padding-left: 28px; line-height: 1.6; }

                /* Inputs */
                .hc-input {
                    display: block; width: 100%;
                    padding: 12px 16px; border-radius: 12px;
                    border: 1px solid #e2e8f0; background: #f8fafc;
                    font-size: 0.9rem; color: #0f172a;
                    transition: all 0.3s;
                    outline: none;
                }
                .hc-input:focus { border-color: #04bd20; background: white; box-shadow: 0 0 0 3px rgba(4,189,32,0.1); }
            `}</style>
        </section>
    );
}
