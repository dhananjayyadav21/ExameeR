"use client";
import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import * as GlobalUrls from "../../utils/GlobalURL"
import { toast } from "react-toastify";

function VerifyEmailContent({ setProgress = () => { } }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const Email = searchParams.get('Email') || "";
    const VerificationCodeParams = searchParams.get('VerificationCode') || "";
    const [VerificationCode, setVerificationCode] = useState(VerificationCodeParams);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setProgress(0);
        setProgress(100);
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!VerificationCode) {
                toast.error("Verification Code is required!");
            } else {
                const response = await fetch(`${GlobalUrls.VERIFY_URL}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Email, VerificationCode }),
                });
                const result = await response.json();
                if (result.success === true) {
                    toast.success("Email verified successfully!");
                    router.push("/auth");
                } else {
                    toast.error(result.message || 'Verification failed.');
                }
            }
        } catch (error) {
            toast.error('An error occurred during verification.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="ve-page">
            <div className="ve-card">
                {/* Top accent */}
                <div className="ve-accent-bar"></div>
                <div className="ve-body">
                    {/* Icon */}
                    <div className="ve-icon-wrap">
                        <div className="ve-icon-ring ve-ring-outer"></div>
                        <div className="ve-icon-ring ve-ring-inner"></div>
                        <div className="ve-icon-core">
                            <i className="fa-solid fa-envelope-open-text"></i>
                        </div>
                    </div>

                    <h1 className="ve-title">Check your inbox</h1>
                    <p className="ve-sub">
                        We sent a 6-digit verification code to<br />
                        <span className="ve-email">{Email || "your email"}</span>
                    </p>

                    {/* Email chip */}
                    <div className="ve-email-chip">
                        <i className="fa-solid fa-envelope me-2" style={{ color: '#04bd20', fontSize: '0.8rem' }}></i>
                        <span>{Email}</span>
                    </div>

                    <form onSubmit={handleFormSubmit} className="w-100">
                        <div className="ve-field mb-4">
                            <label htmlFor="VerificationCode" className="ve-label">Enter your verification code</label>
                            <input
                                type="text"
                                className="ve-code-input"
                                id="VerificationCode"
                                value={VerificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder="● ● ● ● ● ●"
                                maxLength="8"
                                autoComplete="one-time-code"
                            />
                        </div>

                        <button type="submit" className="ve-submit-btn" disabled={loading}>
                            {loading
                                ? <><span className="ve-spinner me-2"></span>Verifying...</>
                                : <><i className="fa-solid fa-circle-check me-2"></i>Verify & Continue</>}
                        </button>
                    </form>

                    <div className="ve-divider my-3" />

                    <p className="ve-hint">Didn't receive the code? Check your spam folder or</p>
                    <button className="ve-resend-btn" onClick={() => router.push('/auth')}>
                        <i className="fa-solid fa-arrow-left me-1"></i>
                        Go back to Sign Up
                    </button>
                </div>
            </div>

            <style jsx>{`
                .ve-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, #f0f9f0 0%, #f8fafc 50%, #eff6ff 100%);
                    padding: 24px;
                }
                .ve-card {
                    width: 100%;
                    max-width: 440px;
                    background: white;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                }
                .ve-accent-bar { height: 5px; background: linear-gradient(90deg,#04bd20,#06d6a0,#6366f1); }
                .ve-body { padding: 40px 36px; text-align: center; display: flex; flex-direction: column; align-items: center; }

                /* Icon rings */
                .ve-icon-wrap { position: relative; width: 88px; height: 88px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center; }
                .ve-icon-ring {
                    position: absolute; border-radius: 50%; border: 2px solid rgba(4,189,32,0.15);
                    animation: pulse-ring 2.5s infinite;
                }
                .ve-ring-outer { width: 88px; height: 88px; animation-delay: 0.3s; }
                .ve-ring-inner { width: 70px; height: 70px; }
                .ve-icon-core {
                    width: 56px; height: 56px; border-radius: 16px;
                    background: linear-gradient(135deg, #04bd20, #06d6a0);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 1.4rem; color: white;
                    box-shadow: 0 8px 24px rgba(4,189,32,0.35);
                    z-index: 1;
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.85); opacity: 0.6; }
                    50% { transform: scale(1); opacity: 0.2; }
                    100% { transform: scale(0.85); opacity: 0.6; }
                }

                .ve-title { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0 0 8px; letter-spacing: -0.02em; }
                .ve-sub { font-size: 0.9rem; color: #64748b; line-height: 1.6; margin: 0 0 16px; }
                .ve-email { color: #04bd20; font-weight: 700; }

                .ve-email-chip {
                    display: inline-flex; align-items: center;
                    background: #f0fdf4; border: 1px solid rgba(4,189,32,0.2);
                    border-radius: 50px; padding: 6px 16px;
                    font-size: 0.82rem; color: #374151; font-weight: 500;
                    margin-bottom: 28px;
                }

                .ve-field { width: 100%; text-align: left; }
                .ve-label { font-size: 0.78rem; font-weight: 600; color: #374151; margin-bottom: 8px; display: block; text-align: center; }
                .ve-code-input {
                    width: 100%;
                    padding: 16px;
                    border: 2px solid #e2e8f0;
                    border-radius: 14px;
                    font-size: 1.8rem;
                    font-weight: 800;
                    text-align: center;
                    letter-spacing: 0.25em;
                    color: #0f172a;
                    background: #f8fafc;
                    outline: none;
                    transition: all 0.2s;
                }
                .ve-code-input:focus {
                    border-color: #04bd20;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(4,189,32,0.12);
                }

                .ve-submit-btn {
                    width: 100%; padding: 14px;
                    background: linear-gradient(135deg, #04bd20, #03a61c);
                    color: white; border: none; border-radius: 14px;
                    font-size: 0.95rem; font-weight: 700;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: all 0.25s;
                    box-shadow: 0 4px 14px rgba(4,189,32,0.35);
                }
                .ve-submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(4,189,32,0.45); }
                .ve-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                .ve-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
                @keyframes spin { to { transform: rotate(360deg); } }

                .ve-divider { width: 100%; height: 1px; background: #f1f5f9; }
                .ve-hint { font-size: 0.8rem; color: #94a3b8; margin: 0 0 10px; }
                .ve-resend-btn {
                    background: none; border: none; color: #04bd20;
                    font-size: 0.85rem; font-weight: 600; cursor: pointer;
                    padding: 0;
                }
                .ve-resend-btn:hover { text-decoration: underline; }

                @media (max-width: 480px) {
                    .ve-body { padding: 32px 20px; }
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
