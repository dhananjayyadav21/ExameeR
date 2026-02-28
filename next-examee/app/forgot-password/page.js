"use client";
import React, { useState, useEffect } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as GlobalUrls from "../../utils/GlobalURL"
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ForgotPasswordPage({ setProgress = () => { } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [Email, setEmail] = useState("");
    const [codeSent, setCodeSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [ForgotPasswordData, setForgotPassword] = useState({
        ForgotPasswordCode: "",
        NewPassword: "",
        ConfirmNewPassword: ""
    });

    useEffect(() => {
        setProgress(0);
        setProgress(100);
    }, []);

    const handleFogotPasswordEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!Email) {
                toast.error("Please fill out email field!");
            } else {
                const response = await fetch(`${GlobalUrls.FOGOTCODE_URL}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Email }),
                });
                const result = await response.json();
                if (result.success === true) {
                    if (typeof window !== 'undefined') localStorage.setItem("FogotEmail", Email);
                    toast.success("Verification code sent to your email!");
                    setCodeSent(true);
                } else {
                    toast.error(result.message || 'Verification failed.');
                }
            }
        } catch (error) {
            toast.error('An error occurred while sending code.');
        } finally {
            setLoading(false);
        }
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { ForgotPasswordCode, NewPassword, ConfirmNewPassword } = ForgotPasswordData;
            const storedEmail = typeof window !== 'undefined' ? localStorage.getItem("FogotEmail") : "";
            if (!ForgotPasswordCode || !NewPassword || !ConfirmNewPassword) {
                toast.error("Please fill out all fields!");
            } else if (NewPassword !== ConfirmNewPassword) {
                toast.error("Passwords do not match!");
            } else {
                const response = await fetch(`${GlobalUrls.FOGOTPASSWORD_URL}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Email: storedEmail, ForgotPasswordCode, NewPassword, ConfirmNewPassword }),
                });
                const result = await response.json();
                if (result.success === true) {
                    toast.success(result.message || "Password reset successfully!");
                    router.push('/auth');
                } else {
                    toast.error(result.message || 'Password reset failed.');
                }
            }
        } catch (error) {
            toast.error('An error occurred during password reset.');
        } finally {
            setLoading(false);
        }
    }

    const handlOnchange = (e) => {
        setForgotPassword({ ...ForgotPasswordData, [e.target.name]: e.target.value });
    };

    return (
        <main className="fp-page">
            <div className="fp-container">
                {/* Left panel */}
                <div className="fp-left">
                    <div className="fp-left-blob fp-blob1" />
                    <div className="fp-left-blob fp-blob2" />
                    <div className="fp-left-inner">
                        <div className="fp-logo mb-4">
                            <span className="fp-logo-icon"><i className="fa-solid fa-graduation-cap"></i></span>
                            <span className="fp-logo-text">Examee</span>
                        </div>
                        <h2 className="fp-hero-title">Reset your<br /><span className="fp-hero-accent">Password</span></h2>
                        <p className="fp-hero-sub">Don't worry — it happens to the best of us. Follow the two simple steps to get back in.</p>

                        <div className="fp-steps">
                            <div className={`fp-step ${!codeSent ? 'fp-step--active' : 'fp-step--done'}`}>
                                <div className="fp-step-num">{!codeSent ? '1' : <i className="fa-solid fa-check"></i>}</div>
                                <div>
                                    <p className="fp-step-title">Enter your email</p>
                                    <p className="fp-step-desc">We'll send a reset code</p>
                                </div>
                            </div>
                            <div className="fp-step-line" />
                            <div className={`fp-step ${codeSent ? 'fp-step--active' : ''}`}>
                                <div className="fp-step-num">2</div>
                                <div>
                                    <p className="fp-step-title">Enter the code</p>
                                    <p className="fp-step-desc">Set your new password</p>
                                </div>
                            </div>
                        </div>

                        <div className="fp-security-note">
                            <i className="fa-solid fa-shield-halved me-2" style={{ color: '#4dfa6a' }}></i>
                            Your account is protected with end-to-end encryption
                        </div>
                    </div>
                </div>

                {/* Right panel */}
                <div className="fp-right">
                    <div className="fp-form-wrap">

                        {/* Step 1 */}
                        <div className="fp-step-header mb-4">
                            <span className="fp-step-badge">Step {codeSent ? '2' : '1'} of 2</span>
                            <h1 className="fp-form-title">{codeSent ? 'Set New Password' : 'Forgot Password?'}</h1>
                            <p className="fp-form-sub">
                                {codeSent
                                    ? `Code sent to ${Email}. Enter it below along with your new password.`
                                    : "Enter the email address associated with your account."}
                            </p>
                        </div>

                        {!codeSent ? (
                            <form onSubmit={handleFogotPasswordEmail}>
                                <div className="fp-field mb-4">
                                    <label htmlFor="fpEmail" className="fp-label">Email Address</label>
                                    <div className="fp-input-wrap">
                                        <span className="fp-input-icon"><i className="fa-solid fa-envelope"></i></span>
                                        <input
                                            type="email"
                                            className="fp-input"
                                            id="fpEmail"
                                            value={Email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="fp-submit-btn w-100" disabled={loading}>
                                    {loading
                                        ? <><span className="fp-btn-spinner me-2"></span>Sending Code...</>
                                        : <>Send Verification Code <i className="fa-solid fa-paper-plane ms-2"></i></>}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleForgotPassword}>
                                <div className="fp-field mb-3">
                                    <label htmlFor="vcode" className="fp-label">Verification Code</label>
                                    <div className="fp-input-wrap">
                                        <span className="fp-input-icon"><i className="fa-solid fa-key"></i></span>
                                        <input
                                            type="number"
                                            className="fp-input fp-code-input"
                                            id="vcode"
                                            name='ForgotPasswordCode'
                                            value={ForgotPasswordData.ForgotPasswordCode}
                                            onChange={handlOnchange}
                                            placeholder="000000"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="fp-field mb-3">
                                    <label htmlFor="NewPassword" className="fp-label">New Password</label>
                                    <div className="fp-input-wrap">
                                        <span className="fp-input-icon"><i className="fa-solid fa-lock"></i></span>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="fp-input"
                                            id="NewPassword"
                                            name='NewPassword'
                                            value={ForgotPasswordData.NewPassword}
                                            onChange={handlOnchange}
                                            placeholder="Min. 8 characters"
                                            required
                                        />
                                        <button type="button" className="fp-pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <div className="fp-field mb-4">
                                    <label htmlFor="ConfirmNewPassword" className="fp-label">Confirm Password</label>
                                    <div className="fp-input-wrap">
                                        <span className="fp-input-icon"><i className="fa-solid fa-lock"></i></span>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            className="fp-input"
                                            id="ConfirmNewPassword"
                                            name='ConfirmNewPassword'
                                            value={ForgotPasswordData.ConfirmNewPassword}
                                            onChange={handlOnchange}
                                            placeholder="Re-enter password"
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="fp-submit-btn w-100" disabled={loading}>
                                    {loading
                                        ? <><span className="fp-btn-spinner me-2"></span>Resetting...</>
                                        : <>Save New Password <i className="fa-solid fa-shield-check ms-2"></i></>}
                                </button>

                                <button type="button" className="fp-back-btn w-100 mt-3" onClick={() => setCodeSent(false)}>
                                    <i className="fa-solid fa-arrow-left me-2"></i>Use a different email
                                </button>
                            </form>
                        )}

                        <p className="fp-switch-text mt-4">
                            Remember your password?{' '}
                            <Link href="/auth" className="fp-switch-link">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .fp-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: stretch;
                    background: #f8fafc;
                }
                .fp-container {
                    display: flex;
                    width: 100%;
                    min-height: 100vh;
                }
                /* ── Left ── */
                .fp-left {
                    width: 42%;
                    background: linear-gradient(145deg, #0a1628 0%, #0d3320 50%, #0a1628 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 48px;
                    position: relative;
                    overflow: hidden;
                }
                .fp-left-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(60px);
                    opacity: 0.25;
                }
                .fp-blob1 { width: 350px; height: 350px; background: #04bd20; top: -80px; right: -80px; }
                .fp-blob2 { width: 280px; height: 280px; background: #06d6a0; bottom: -60px; left: -60px; }
                .fp-left-inner { position: relative; z-index: 1; }
                .fp-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 40px; }
                .fp-logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg,#04bd20,#06d6a0); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1rem; }
                .fp-logo-text { font-size: 1.2rem; font-weight: 800; color: white; letter-spacing: -0.02em; }
                .fp-hero-title { font-size: 2.6rem; font-weight: 900; color: white; line-height: 1.15; letter-spacing: -0.03em; margin-bottom: 16px; }
                .fp-hero-accent { background: linear-gradient(135deg,#04bd20,#6ee7b7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .fp-hero-sub { color: rgba(255,255,255,0.55); font-size: 0.9rem; line-height: 1.65; margin-bottom: 40px; }
                .fp-steps { display: flex; flex-direction: column; gap: 0; margin-bottom: 36px; }
                .fp-step { display: flex; align-items: center; gap: 14px; padding: 14px 0; }
                .fp-step-num {
                    width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.85rem; font-weight: 700;
                    border: 2px solid rgba(255,255,255,0.2);
                    color: rgba(255,255,255,0.4);
                    transition: all 0.3s;
                }
                .fp-step--active .fp-step-num { background: linear-gradient(135deg,#04bd20,#06d6a0); border-color: #04bd20; color: white; box-shadow: 0 4px 14px rgba(4,189,32,0.4); }
                .fp-step--done .fp-step-num { background: rgba(4,189,32,0.2); border-color: #04bd20; color: #4dfa6a; }
                .fp-step-line { width: 2px; height: 20px; background: rgba(255,255,255,0.1); margin-left: 17px; }
                .fp-step-title { margin: 0; font-size: 0.87rem; font-weight: 600; color: rgba(255,255,255,0.85); }
                .fp-step-desc { margin: 2px 0 0; font-size: 0.75rem; color: rgba(255,255,255,0.4); }
                .fp-step--active .fp-step-title { color: white; }
                .fp-step--active .fp-step-desc { color: rgba(255,255,255,0.6); }
                .fp-security-note { display: flex; align-items: center; font-size: 0.78rem; color: rgba(255,255,255,0.4); margin-top: 8px; }

                /* ── Right ── */
                .fp-right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 60px 40px; background: #f8fafc; }
                .fp-form-wrap { width: 100%; max-width: 420px; }
                .fp-step-badge { display: inline-block; background: rgba(4,189,32,0.1); color: #039419; border: 1px solid rgba(4,189,32,0.25); border-radius: 50px; padding: 4px 14px; font-size: 0.75rem; font-weight: 700; margin-bottom: 12px; }
                .fp-form-title { font-size: 1.7rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; margin-bottom: 6px; }
                .fp-form-sub { color: #64748b; font-size: 0.88rem; line-height: 1.5; margin: 0; }
                .fp-label { font-size: 0.82rem; font-weight: 600; color: #374151; margin-bottom: 6px; display: block; }
                .fp-input-wrap { position: relative; }
                .fp-input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.82rem; pointer-events: none; }
                .fp-input {
                    width: 100%; padding: 12px 44px 12px 40px;
                    border: 1.5px solid #e2e8f0; border-radius: 12px;
                    font-size: 0.92rem; color: #0f172a; background: #f8fafc;
                    transition: all 0.2s; outline: none;
                }
                .fp-input:focus { border-color: #04bd20; background: #fff; box-shadow: 0 0 0 3px rgba(4,189,32,0.1); }
                .fp-code-input { text-align: center; letter-spacing: 0.3em; font-size: 1.3rem; font-weight: 700; }
                .fp-pw-toggle { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); border: none; background: transparent; color: #94a3b8; cursor: pointer; padding: 2px; display: flex; align-items: center; font-size: 0.9rem; }
                .fp-pw-toggle:hover { color: #04bd20; }
                .fp-submit-btn {
                    display: flex; align-items: center; justify-content: center;
                    padding: 13px 24px;
                    background: linear-gradient(135deg, #04bd20, #03a61c);
                    color: #fff; border: none; border-radius: 12px;
                    font-size: 0.95rem; font-weight: 700; cursor: pointer;
                    transition: all 0.25s;
                    box-shadow: 0 4px 14px rgba(4,189,32,0.35);
                }
                .fp-submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(4,189,32,0.45); }
                .fp-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                .fp-back-btn {
                    display: flex; align-items: center; justify-content: center;
                    padding: 11px 24px;
                    background: transparent; color: #64748b;
                    border: 1.5px solid #e2e8f0; border-radius: 12px;
                    font-size: 0.875rem; font-weight: 500; cursor: pointer;
                    transition: all 0.2s;
                }
                .fp-back-btn:hover { border-color: #cbd5e1; background: #f1f5f9; }
                .fp-btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .fp-switch-text { text-align: center; font-size: 0.87rem; color: #64748b; }
                .fp-switch-link { color: #04bd20; font-weight: 700; text-decoration: none; }
                .fp-switch-link:hover { text-decoration: underline; }

                @media (max-width: 768px) {
                    .fp-container { flex-direction: column; }
                    .fp-left { width: 100%; padding: 40px 28px; }
                    .fp-hero-title { font-size: 1.8rem; }
                    .fp-steps { display: none; }
                    .fp-right { padding: 40px 20px; }
                }
            `}</style>
        </main>
    )
}
