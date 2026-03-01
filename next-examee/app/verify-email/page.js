"use client";
import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import * as GlobalUrls from "../../utils/GlobalURL"
import { toast } from "react-toastify";

function VerifyEmailContent({ setProgress = () => { } }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Improved email parsing to handle '+' symbols correctly which often get decoded as spaces
    const rawEmail = searchParams.get('Email') || "";
    const Email = rawEmail.includes(' ') ? rawEmail.replace(/\s/g, '+') : rawEmail;

    const VerificationCodeParams = searchParams.get('VerificationCode') || "";
    const [VerificationCode, setVerificationCode] = useState(VerificationCodeParams);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setProgress(0);
        setTimeout(() => setProgress(100), 500);
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!VerificationCode || VerificationCode.length < 4) {
            toast.warn("Please enter a valid verification code.");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${GlobalUrls.VERIFY_URL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Email, VerificationCode }),
            });
            const result = await response.json();
            if (result.success) {
                toast.success("✨ Email verified successfully!");
                router.push("/auth");
            } else {
                toast.error(result.message || 'Verification failed. Please check the code.');
            }
        } catch (error) {
            toast.error('Unable to connect. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="ve-container">
            <div className="ve-glass-card animate-slide-up">
                <div className="ve-header-accent" />

                <div className="ve-content p-4 p-md-5">
                    {/* Dynamic Icon */}
                    <div className="ve-icon-container mb-4">
                        <div className="ve-icon-bg">
                            <i className="fa-solid fa-paper-plane-alt animate-float"></i>
                        </div>
                        <div className="ve-pulse-ring"></div>
                    </div>

                    <h1 className="ve-main-title">Check Your Inbox</h1>
                    <p className="ve-description">
                        We've sent a secure verification code to your email.
                    </p>

                    <div className="ve-email-badge mb-5">
                        <div className="ve-email-icon">
                            <i className="fa-solid fa-envelope"></i>
                        </div>
                        <span className="ve-email-text">{Email || "your-email@example.com"}</span>
                    </div>

                    <form onSubmit={handleFormSubmit} className="ve-form">
                        <div className="ve-input-group mb-4">
                            <label className="ve-input-label">Verification Code</label>
                            <input
                                type="text"
                                className="ve-modern-input"
                                value={VerificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder="Enter 6-digit code"
                                maxLength="8"
                                required
                            />
                            <div className="ve-input-focus-line"></div>
                        </div>

                        <button type="submit" className="ve-primary-btn" disabled={loading}>
                            {loading ? (
                                <><span className="spinner-border spinner-border-sm me-2"></span>Confirming...</>
                            ) : (
                                <><i className="fa-solid fa-shield-check me-2"></i>Verify Account</>
                            )}
                        </button>
                    </form>

                    <div className="ve-footer mt-5">
                        <p className="ve-footer-text">Didn't get the email?</p>
                        <div className="d-flex gap-3 justify-content-center">
                            <button className="ve-secondary-link" onClick={() => router.push('/auth')}>
                                <i className="fa-solid fa-rotate-left me-1"></i>Resend Code
                            </button>
                            <div className="ve-v-divider"></div>
                            <button className="ve-secondary-link" onClick={() => router.push('/auth')}>
                                <i className="fa-solid fa-user-plus me-1"></i>Change Email
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .ve-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: radial-gradient(circle at top right, #f0fdf4 0%, #ffffff 40%, #f1f5f9 100%);
                    padding: 20px;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                }
                
                .ve-glass-card {
                    width: 100%;
                    max-width: 480px;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    border-radius: 32px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
                    overflow: hidden;
                    position: relative;
                }
                
                .ve-header-accent {
                    height: 6px;
                    background: linear-gradient(90deg, #04bd20, #10b981, #3b82f6);
                }
                
                .ve-icon-container {
                    position: relative;
                    width: 90px;
                    height: 90px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .ve-icon-bg {
                    width: 64px;
                    height: 64px;
                    background: linear-gradient(135deg, #04bd20 0%, #10b981 100%);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.6rem;
                    box-shadow: 0 12px 24px -6px rgba(4, 189, 32, 0.4);
                    z-index: 2;
                }
                
                .ve-pulse-ring {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border: 2px solid rgba(4, 189, 32, 0.2);
                    border-radius: 50%;
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                
                @keyframes pulse {
                    0% { transform: scale(0.8); opacity: 1; }
                    100% { transform: scale(1.2); opacity: 0; }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-float { animation: float 3s ease-in-out infinite; }

                .ve-main-title { font-size: 1.75rem; font-weight: 800; color: #0f172a; margin-bottom: 8px; letter-spacing: -0.02em; }
                .ve-description { color: #64748b; font-size: 1rem; line-height: 1.5; margin-bottom: 24px; }
                
                .ve-email-badge {
                    display: inline-flex;
                    align-items: center;
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    padding: 8px 20px;
                    border-radius: 100px;
                    gap: 10px;
                    transition: all 0.2s;
                }
                .ve-email-badge:hover { border-color: #04bd20; background: #f0fdf4; }
                .ve-email-icon { color: #04bd20; font-size: 0.9rem; }
                .ve-email-text { font-weight: 700; color: #1e293b; font-size: 0.9rem; }
                
                .ve-input-group { text-align: left; position: relative; }
                .ve-input-label { display: block; font-size: 0.82rem; font-weight: 700; color: #475569; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
                
                .ve-modern-input {
                    width: 100%;
                    padding: 16px 20px;
                    background: #f1f5f9;
                    border: 2px solid transparent;
                    border-radius: 16px;
                    font-size: 1.5rem;
                    font-weight: 800;
                    text-align: center;
                    letter-spacing: 0.15em;
                    color: #0f172a;
                    transition: all 0.3s;
                }
                .ve-modern-input:focus {
                    outline: none;
                    background: #fff;
                    border-color: #04bd20;
                    box-shadow: 0 10px 15px -3px rgba(4, 189, 32, 0.1);
                }
                
                .ve-primary-btn {
                    width: 100%;
                    padding: 16px;
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    color: white;
                    border: none;
                    border-radius: 16px;
                    font-size: 1rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.2);
                }
                .ve-primary-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.2); background: #000; }
                .ve-primary-btn:disabled { opacity: 0.6; cursor: not-allowed; }
                
                .ve-footer-text { font-size: 0.85rem; color: #94a3b8; margin-bottom: 12px; }
                .ve-secondary-link {
                    background: none;
                    border: none;
                    color: #04bd20;
                    font-size: 0.88rem;
                    font-weight: 700;
                    cursor: pointer;
                    padding: 0;
                    transition: all 0.2s;
                    opacity: 0.8;
                }
                .ve-secondary-link:hover { opacity: 1; text-decoration: underline; }
                .ve-v-divider { width: 1px; background: #e2e8f0; height: 16px; }

                .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                
                @media (max-width: 480px) {
                    .ve-glass-card { border-radius: 24px; }
                    .ve-main-title { font-size: 1.5rem; }
                    .ve-modern-input { font-size: 1.25rem; }
                }
            `}</style>
        </main>
    );
}

export default function VerifyEmailPage(props) {
    return (
        <Suspense fallback={<div className="container py-5 text-center">Loading Verification...</div>}>
            <VerifyEmailContent {...props} />
        </Suspense>
    );
}
