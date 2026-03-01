"use client";
import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        setProgress(0);
        setTimeout(() => setProgress(100), 500);

        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const inputRef = React.useRef(null);

    const handleFormSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!VerificationCode || VerificationCode.length < 6) {
            toast.warn("Please enter a valid 6-digit code.");
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

    const handleResendOTP = async () => {
        if (countdown > 0 || resending) return;

        setResending(true);
        try {
            const response = await fetch(`${GlobalUrls.RESEND_OTP_URL}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Email }),
            });
            const result = await response.json();
            if (result.success) {
                toast.success("📬 New code sent successfully!");
                setCountdown(60);
            } else {
                toast.error(result.message || 'Failed to resend code.');
            }
        } catch (error) {
            toast.error('Unable to connect. Please try again later.');
        } finally {
            setResending(false);
        }
    };

    return (
        <main className="ve-page-container">
            {/* Vibrant Abstract Background Entities */}
            <div className="ve-blob ve-blob-1"></div>
            <div className="ve-blob ve-blob-2"></div>
            <div className="ve-blob ve-blob-3"></div>

            <div className="ve-main_card_wrapper">
                <div className="ve-main-card animate-pop-in">
                    {/* Top Rocket Icon */}
                    <div className="ve-rocket-wrapper">
                        <div className="ve-rocket-circle">
                            <i className="fa-solid fa-rocket"></i>
                        </div>
                    </div>

                    <div className="ve-card-content">
                        <h1 className="ve-main-title">Verify your Email</h1>
                        <p className="ve-main-subtitle">
                            Account activation code has been sent to the e-mail address you provided
                        </p>

                        {/* Email Display Pill */}
                        <div className="ve-user-email">
                            <span>{Email || "your-email@example.com"}</span>
                        </div>

                        {/* Illustration Area */}
                        <div className="ve-illustration-section">
                            <div className="ve-illustration-box">
                                <div className="ve-envelope-icon">
                                    <i className="fa-solid fa-envelope-open-text"></i>
                                    <div className="ve-check-badge">
                                        <i className="fa-solid fa-check"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleFormSubmit} className="ve-otp-form">
                            <div className="ve-otp-grid" onClick={() => inputRef.current?.focus()}>
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className={`ve-otp-slot ${VerificationCode.length > i ? 'filled' : ''}`}>
                                        {VerificationCode[i] || ""}
                                    </div>
                                ))}
                                <input
                                    ref={inputRef}
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    className="ve-hidden-input"
                                    value={VerificationCode}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        setVerificationCode(val);
                                        // Auto-submit if 6 digits are reached
                                        if (val.length === 6) {
                                            // Optional: submit immediately
                                        }
                                    }}
                                    maxLength="6"
                                    autoFocus
                                />
                            </div>

                            <button type="submit" className="ve-action-btn" disabled={loading || resending}>
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                ) : (
                                    "Complete Verification"
                                )}
                            </button>
                        </form>

                        <div className="ve-footer-links">
                            <button
                                className="ve-resend-text"
                                onClick={handleResendOTP}
                                disabled={countdown > 0 || resending}
                            >
                                {resending ? "Sending..." : countdown > 0 ? `Resend code in ${countdown}s` : "Resend Code"}
                            </button>
                            <div className="ve-divider"></div>
                            <Link href="/auth" className="ve-back-btn">
                                Use another account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .ve-page-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f0fdf4; /* Very light mint green base */
                    padding: 12px;
                    font-family: 'Inter', sans-serif;
                    position: relative;
                    overflow: hidden;
                }

                /* Background Blobs (Green themed mesh) */
                .ve-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    z-index: 0;
                    opacity: 0.4;
                }
                .ve-blob-1 { width: 500px; height: 500px; background: #86efac; top: -150px; left: -150px; } /* Emerald */
                .ve-blob-2 { width: 400px; height: 400px; background: #bbf7d0; bottom: -100px; right: -100px; } /* Light Green */
                .ve-blob-3 { width: 350px; height: 350px; background: #4ade80; top: 60%; left: -100px; opacity: 0.2; } /* Mint */

                .ve-main_card_wrapper {
                    width: 100%;
                    max-width: 600px;
                    position: relative;
                    z-index: 10;
                    margin: 0 auto;
                }

                .ve-main-card {
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-radius: 20px;
                    padding: 35px 45px;
                    border: 1px solid rgba(22, 163, 74, 0.1); /* Subtle green border */
                    box-shadow: 
                        0 4px 6px -1px rgba(0, 0, 0, 0.05),
                        0 20px 40px -8px rgba(0, 0, 0, 0.05),
                        inset 0 0 0 1px rgba(255, 255, 255, 0.5);
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }

                .ve-main-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, #04bd20, #10b981);
                }

                .ve-rocket-wrapper { margin-bottom: 20px; }
                .ve-rocket-circle {
                    width: 58px;
                    height: 58px;
                    background: #f0fdf4;
                    border: 1px solid #dcfce7;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto;
                    color: #04bd20;
                    font-size: 1.5rem;
                    box-shadow: 0 8px 15px rgba(4, 189, 32, 0.1);
                }

                .ve-main-title {
                    font-family: 'Outfit', sans-serif;
                    font-size: 1.85rem;
                    font-weight: 700;
                    color: #064e3b; /* Deep emerald text */
                    margin-bottom: 8px;
                    letter-spacing: -0.02em;
                }
                .ve-main-subtitle {
                    color: #374151;
                    font-size: 0.95rem;
                    line-height: 1.5;
                    max-width: 400px;
                    margin: 0 auto 18px;
                    font-weight: 400;
                }

                .ve-user-email {
                    display: inline-flex;
                    align-items: center;
                    padding: 6px 16px;
                    background: #f0fdf4;
                    border: 1px solid #dcfce7;
                    border-radius: 100px;
                    font-weight: 600;
                    color: #065f46;
                    font-size: 0.85rem;
                    margin-bottom: 25px;
                }

                .ve-illustration-section { margin-bottom: 20px; }
                .ve-illustration-box {
                    width: 100px;
                    height: 100px;
                    background: #f0fdf4; /* Mint box */
                    border-radius: 12px;
                    margin: 0 auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    border: 1px solid #dcfce7;
                }
                .ve-envelope-icon {
                    font-size: 2.5rem;
                    color: #04bd20;
                    position: relative;
                }
                .ve-check-badge {
                    position: absolute;
                    top: -3px;
                    right: -6px;
                    width: 24px;
                    height: 24px;
                    background: #04bd20;
                    color: white;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid #f0fdf4;
                }

                .ve-otp-grid { 
                    position: relative;
                    display: flex; 
                    gap: 10px; 
                    justify-content: center; 
                    margin-bottom: 20px; 
                    cursor: text;
                }
                .ve-otp-slot {
                    width: 46px; 
                    height: 56px;
                    background: #ffffff;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.4rem;
                    font-weight: 700;
                    color: #064e3b;
                    transition: all 0.2s;
                    position: relative;
                    z-index: 0;
                }
                .ve-otp-slot.filled { border-color: #04bd20; background: #f0fdf4; box-shadow: 0 0 0 4px rgba(4, 189, 32, 0.05); }

                .ve-hidden-input { 
                    position: absolute; 
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0; 
                    border: none;
                    background: transparent;
                    color: transparent;
                    caret-color: transparent;
                    z-index: 1;
                    cursor: text;
                }

                .ve-action-btn {
                    width: 100%;
                    max-width: 260px;
                    padding: 13px;
                    background: #04bd20;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    margin-bottom: 18px;
                    box-shadow: 0 10px 20px -5px rgba(4, 189, 32, 0.25);
                }
                .ve-action-btn:hover:not(:disabled) { background: #03a61c; transform: translateY(-2px); box-shadow: 0 15px 30px -5px rgba(4, 189, 32, 0.35); }

                .ve-footer-links { display: flex; flex-direction: column; gap: 6px; align-items: center; }
                .ve-divider { width: 30px; height: 1px; background: #dcfce7; margin: 2px 0; }
                .ve-resend-text { background: none; border: none; color: #04bd20; font-size: 0.95rem; font-weight: 600; cursor: pointer; }
                .ve-back-btn { color: #9ca3af; font-size: 0.8rem; text-decoration: none; }

                .animate-pop-in { animation: popIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                @keyframes popIn { from { opacity: 0; transform: scale(0.9) translateY(40px); } to { opacity: 1; transform: scale(1) translateY(0); } }

                @media (max-width: 580px) {
                    .ve-page-container { padding: 8px; }
                    .ve-main-card { border-radius: 12px; padding: 20px 15px; margin: 5px; }
                    .ve-main-title { font-size: 1.5rem; margin-bottom: 5px; }
                    .ve-main-subtitle { font-size: 0.85rem; margin-bottom: 12px; }
                    .ve-rocket-wrapper { margin-bottom: 10px; }
                    .ve-illustration-section { margin-bottom: 15px; }
                    .ve-illustration-box { width: 80px; height: 80px; border-radius: 10px; }
                    .ve-envelope-icon { font-size: 2rem; }
                    .ve-otp-grid { gap: 6px; margin-bottom: 15px; }
                    .ve-otp-slot { width: 38px; height: 48px; font-size: 1.2rem; border-radius: 6px; }
                    .ve-action-btn { padding: 11px; margin-bottom: 12px; }
                    .ve-user-email { margin-bottom: 15px; padding: 3px 10px; font-size: 0.8rem; }
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
