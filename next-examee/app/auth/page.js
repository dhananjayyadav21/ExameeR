"use client";
import React, { useState, useEffect } from 'react'
import Login from '../../components/Login'
import Register from '../../components/Register'

export default function AuthPage({ setProgress = () => { } }) {
    useEffect(() => {
        setProgress(0);
        setProgress(100);
    }, []);

    const [activeTab, setActiveTab] = useState('login');

    return (
        <div className="auth-page-wrapper">
            {/* Background decoration */}
            <div className="auth-bg-decor">
                <div className="auth-blob auth-blob-1"></div>
                <div className="auth-blob auth-blob-2"></div>
                <div className="auth-blob auth-blob-3"></div>
            </div>

            <div className="auth-container">
                {/* Left panel — branding */}
                <div className="auth-left d-none d-lg-flex">
                    <div className="auth-left-content">
                        <div className="auth-brand mb-5">
                            <img src="/assets/img/brandlog.png" alt="Examee" style={{ height: '40px', filter: 'brightness(0) invert(1)' }} />
                        </div>

                        <div className="auth-hero-text mb-5">
                            <h1 className="auth-hero-title">
                                Unlock Your <br />
                                <span className="auth-hero-accent">Academic Potential</span>
                            </h1>
                            <p className="auth-hero-subtitle">
                                Join thousands of students who ace their exams with expert-curated notes, HD video lectures, and real past papers.
                            </p>
                        </div>

                        <div className="auth-stats">
                            <div className="auth-stat-item">
                                <span className="auth-stat-num">10K+</span>
                                <span className="auth-stat-label">Students</span>
                            </div>
                            <div className="auth-stat-divider"></div>
                            <div className="auth-stat-item">
                                <span className="auth-stat-num">500+</span>
                                <span className="auth-stat-label">Resources</span>
                            </div>
                            <div className="auth-stat-divider"></div>
                            <div className="auth-stat-item">
                                <span className="auth-stat-num">98%</span>
                                <span className="auth-stat-label">Pass Rate</span>
                            </div>
                        </div>

                        <div className="auth-features mt-5">
                            {['Premium Study Notes', 'HD Video Lectures', 'Previous Year Papers', 'Expert Instructors'].map((f, i) => (
                                <div key={i} className="auth-feature-item">
                                    <span className="auth-feature-icon"><i className="fa-solid fa-circle-check"></i></span>
                                    <span>{f}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right panel — form */}
                <div className="auth-right">
                    <div className="auth-form-wrapper">
                        {/* Mobile logo */}
                        <div className="d-lg-none text-center mb-4">
                            <img src="/assets/img/brandlog.png" alt="Examee" style={{ height: '34px' }} />
                        </div>

                        {/* Tab switcher */}
                        <div className="auth-tab-switcher mb-5">
                            <button
                                className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                                onClick={() => setActiveTab('login')}
                            >
                                Sign In
                            </button>
                            <button
                                className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                                onClick={() => setActiveTab('register')}
                            >
                                Create Account
                            </button>
                            <div className={`auth-tab-indicator ${activeTab === 'register' ? 'right' : ''}`}></div>
                        </div>

                        {/* Forms */}
                        <div className={`auth-form-slide ${activeTab === 'login' ? 'visible' : 'hidden'}`}>
                            {activeTab === 'login' && <Login onSwitchToRegister={() => setActiveTab('register')} />}
                        </div>
                        <div className={`auth-form-slide ${activeTab === 'register' ? 'visible' : 'hidden'}`}>
                            {activeTab === 'register' && <Register onSwitchToLogin={() => setActiveTab('login')} />}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .auth-page-wrapper {
                    min-height: 100vh;
                    background: #f8fafc;
                    display: flex;
                    align-items: stretch;
                    position: relative;
                    overflow: hidden;
                }
                .auth-bg-decor {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 0;
                }
                .auth-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    opacity: 0.35;
                }
                .auth-blob-1 {
                    width: 500px; height: 500px;
                    background: radial-gradient(circle, #04bd2055, #04bd2000);
                    top: -200px; left: -150px;
                    animation: floatBlob 8s ease-in-out infinite;
                }
                .auth-blob-2 {
                    width: 400px; height: 400px;
                    background: radial-gradient(circle, #1e40af33, #1e40af00);
                    bottom: -100px; right: 100px;
                    animation: floatBlob 10s ease-in-out infinite reverse;
                }
                .auth-blob-3 {
                    width: 300px; height: 300px;
                    background: radial-gradient(circle, #7c3aed22, #7c3aed00);
                    top: 40%; left: 40%;
                    animation: floatBlob 12s ease-in-out infinite 2s;
                }
                @keyframes floatBlob {
                    0%, 100% { transform: translate(0,0) scale(1); }
                    33% { transform: translate(20px,-30px) scale(1.05); }
                    66% { transform: translate(-15px,20px) scale(0.97); }
                }
                .auth-container {
                    display: flex;
                    width: 100%;
                    min-height: 100vh;
                    position: relative;
                    z-index: 1;
                }
                /* ---- LEFT PANEL ---- */
                .auth-left {
                    flex: 0 0 48%;
                    background: linear-gradient(145deg, #0f172a 0%, #064e3b 55%, #065f46 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 56px;
                    position: relative;
                    overflow: hidden;
                }
                .auth-left::before {
                    content: '';
                    position: absolute;
                    width: 600px; height: 600px;
                    background: radial-gradient(circle, rgba(4,189,32,0.15), transparent 70%);
                    top: -100px; right: -200px;
                    border-radius: 50%;
                }
                .auth-left::after {
                    content: '';
                    position: absolute;
                    width: 400px; height: 400px;
                    background: radial-gradient(circle, rgba(99,102,241,0.12), transparent 70%);
                    bottom: -80px; left: -100px;
                    border-radius: 50%;
                }
                .auth-left-content { position: relative; z-index: 1; max-width: 420px; }
                .auth-hero-title {
                    font-size: clamp(2rem, 3vw, 2.8rem);
                    font-weight: 800;
                    color: #fff;
                    line-height: 1.2;
                    letter-spacing: -0.02em;
                    margin-bottom: 1.2rem;
                }
                .auth-hero-accent {
                    background: linear-gradient(135deg, #04bd20, #67e8a0);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .auth-hero-subtitle {
                    color: rgba(255,255,255,0.65);
                    font-size: 1.05rem;
                    line-height: 1.7;
                }
                .auth-stats {
                    display: flex;
                    align-items: center;
                    gap: 0;
                    background: rgba(255,255,255,0.07);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 16px;
                    padding: 18px 24px;
                    backdrop-filter: blur(10px);
                    width: fit-content;
                }
                .auth-stat-item { text-align: center; padding: 0 20px; }
                .auth-stat-num {
                    display: block;
                    font-size: 1.6rem;
                    font-weight: 800;
                    color: #04bd20;
                    line-height: 1;
                }
                .auth-stat-label {
                    display: block;
                    font-size: 0.75rem;
                    color: rgba(255,255,255,0.55);
                    margin-top: 4px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.04em;
                }
                .auth-stat-divider {
                    width: 1px;
                    height: 36px;
                    background: rgba(255,255,255,0.15);
                }
                .auth-features { display: flex; flex-direction: column; gap: 12px; }
                .auth-feature-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    color: rgba(255,255,255,0.8);
                    font-size: 0.93rem;
                    font-weight: 500;
                }
                .auth-feature-icon { color: #04bd20; font-size: 1rem; flex-shrink: 0; }

                /* ---- RIGHT PANEL ---- */
                .auth-right {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 48px 24px;
                    background: #f8fafc;
                }
                .auth-form-wrapper {
                    width: 100%;
                    max-width: 440px;
                }

                /* ---- TAB SWITCHER ---- */
                .auth-tab-switcher {
                    position: relative;
                    display: flex;
                    background: #e9f0fb;
                    border-radius: 12px;
                    padding: 4px;
                }
                .auth-tab-btn {
                    flex: 1;
                    border: none;
                    background: transparent;
                    padding: 10px 16px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    color: #64748b;
                    border-radius: 8px;
                    cursor: pointer;
                    position: relative;
                    z-index: 2;
                    transition: color 0.25s;
                }
                .auth-tab-btn.active { color: #0f172a; }
                .auth-tab-indicator {
                    position: absolute;
                    top: 4px; left: 4px;
                    width: calc(50% - 4px);
                    height: calc(100% - 8px);
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
                    z-index: 1;
                }
                .auth-tab-indicator.right {
                    transform: translateX(calc(100% + 0px));
                }

                /* ---- FORM SLIDE ---- */
                .auth-form-slide { transition: all 0.2s; }
                .auth-form-slide.hidden { display: none; }
                .auth-form-slide.visible { display: block; animation: fadeSlideUp 0.3s ease; }
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}
