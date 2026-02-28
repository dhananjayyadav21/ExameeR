"use client";
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGoogleLogin } from '@react-oauth/google';
import { googleAuth } from '../utils/googleAuthApi';
import * as GlobalUrls from "../utils/GlobalURL"
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = ({ onSwitchToLogin = null }) => {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [Credentials, setCredentials] = useState({
        Username: "",
        Email: "",
        Password: "",
        ConfirmPassword: ""
    });

    const handleFormSumbit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { Username, Email, Password, ConfirmPassword } = Credentials;

            if (!Username || !Email || !Password) {
                setLoading(false);
                toast.error("All fields are required !", { position: "top-right" });
            } else if (Password !== ConfirmPassword) {
                setLoading(false);
                toast.error("Password & Confirm Password must be same !", { position: "top-right" });
            } else {
                const response = await fetch(`${GlobalUrls.REGISTER_URL}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ Username, Email, Password, ConfirmPassword }),
                });

                const result = await response.json();

                if (result.success === true) {
                    setLoading(false);
                    router.push(`/verify-email?Email=${result.user.Email}`);
                    toast.success("Register successfully !", { position: "top-right" });
                } else {
                    setLoading(false);
                    toast.error(result.message, { position: "top-right" });
                }
            }
        } catch (error) {
            setLoading(false);
            console.error(error.message);
            toast.error("Error while register !", { position: "top-right" });
        }
        setLoading(false);
    };

    const handlOnchange = (e) => {
        setCredentials({ ...Credentials, [e.target.name]: e.target.value });
    };

    const [showPassword, setShowPassword] = useState(false);

    const responseGoogle = async (authResult) => {
        try {
            if (authResult['code']) {
                const result = await googleAuth(authResult['code']);
                if (result.data.success === true) {
                    const { Profile, Role, ExmeeUserId } = result.data.user;
                    const token = result.data.token;
                    localStorage.setItem("token", token);
                    localStorage.setItem("Profile", Profile);
                    localStorage.setItem("userRole", Role);
                    localStorage.setItem("userExmeeUserId", ExmeeUserId);
                    window.location.href = '/';
                    toast.success("You're now logged in !", { position: "top-right" });
                } else {
                    toast.error("Something went wrong. Please try again later !", { position: "top-right" });
                }
            }
        } catch (error) {
            console.error("Error while requesting google to code :", error);
            toast.error("Error while requesting google to code  !", { position: "top-right" });
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: 'auth-code'
    })

    return (
        <>
            <div className="af-reg-header mb-4">
                <h2 className="af-title">Create your account</h2>
                <p className="af-subtitle">Start learning for free — no credit card needed</p>
            </div>

            {/* Google Register */}
            <button className="af-google-btn w-100 mb-4" onClick={googleLogin} type="button">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" />
                <span>Sign up with Google</span>
            </button>

            {/* Divider */}
            <div className="af-divider mb-3">
                <span>or create with email</span>
            </div>

            {/* Loading */}
            {loading && (
                <div className="af-loading mb-3">
                    <div className="af-spinner"></div>
                    <span>Creating your account...</span>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleFormSumbit}>
                <div className="row g-3 mb-1">
                    <div className="col-12 col-sm-6">
                        <div className="af-field">
                            <label htmlFor="regUsername" className="af-label">Username</label>
                            <div className="af-input-wrap">
                                <span className="af-input-icon"><i className="fa-solid fa-user"></i></span>
                                <input
                                    type="text"
                                    className="af-input"
                                    id="regUsername"
                                    name='Username'
                                    value={Credentials.Username}
                                    onChange={handlOnchange}
                                    placeholder="username"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6">
                        <div className="af-field">
                            <label htmlFor="regEmail" className="af-label">Email</label>
                            <div className="af-input-wrap">
                                <span className="af-input-icon"><i className="fa-solid fa-envelope"></i></span>
                                <input
                                    type="email"
                                    className="af-input"
                                    id="regEmail"
                                    name='Email'
                                    value={Credentials.Email}
                                    onChange={handlOnchange}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6">
                        <div className="af-field">
                            <label htmlFor="regPassword" className="af-label">Password</label>
                            <div className="af-input-wrap">
                                <span className="af-input-icon"><i className="fa-solid fa-lock"></i></span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="af-input"
                                    id="regPassword"
                                    name='Password'
                                    value={Credentials.Password}
                                    onChange={handlOnchange}
                                    placeholder="Min. 8 characters"
                                    required
                                />
                                <button type="button" className="af-pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-sm-6">
                        <div className="af-field">
                            <label htmlFor="regConfirmPassword" className="af-label">Confirm Password</label>
                            <div className="af-input-wrap">
                                <span className="af-input-icon"><i className="fa-solid fa-lock"></i></span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="af-input"
                                    id="regConfirmPassword"
                                    name='ConfirmPassword'
                                    value={Credentials.ConfirmPassword}
                                    onChange={handlOnchange}
                                    placeholder="Re-enter password"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="af-terms mb-4 mt-3">
                    <i className="fa-solid fa-shield-halved text-success me-2" style={{ fontSize: '0.8rem' }}></i>
                    <span>By registering you agree to our <a href="#" className="af-terms-link">Terms</a> & <a href="#" className="af-terms-link">Privacy Policy</a></span>
                </div>

                <button type="submit" className="af-submit-btn w-100" disabled={loading}>
                    {loading
                        ? <><span className="af-btn-spinner me-2"></span>Creating Account...</>
                        : <>Create Free Account <i className="fa-solid fa-arrow-right ms-2"></i></>
                    }
                </button>
            </form>

            {onSwitchToLogin && (
                <p className="af-switch-text mt-4">
                    Already have an account?{' '}
                    <button className="af-switch-link" onClick={onSwitchToLogin}>Sign in</button>
                </p>
            )}

            <style jsx>{`
                .af-title { font-size: 1.6rem; font-weight: 800; color: #0f172a; letter-spacing: -0.02em; margin-bottom: 4px; }
                .af-subtitle { color: #64748b; font-size: 0.9rem; margin: 0; }
                .af-google-btn {
                    display: flex; align-items: center; justify-content: center; gap: 12px;
                    background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px;
                    padding: 12px 20px; font-size: 0.92rem; font-weight: 600; color: #1e293b;
                    cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.06);
                }
                .af-google-btn:hover { border-color: #04bd20; background: #f0fdf4; box-shadow: 0 4px 14px rgba(4,189,32,0.12); }
                .af-divider { display: flex; align-items: center; gap: 12px; color: #94a3b8; font-size: 0.82rem; font-weight: 500; }
                .af-divider::before, .af-divider::after { content:''; flex:1; height:1px; background:#e2e8f0; }
                .af-label { font-size: 0.82rem; font-weight: 600; color: #374151; margin-bottom: 6px; display: block; }
                .af-input-wrap { position: relative; }
                .af-input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 0.82rem; pointer-events: none; }
                .af-input {
                    width: 100%; padding: 11px 42px 11px 40px;
                    border: 1.5px solid #e2e8f0; border-radius: 10px;
                    font-size: 0.88rem; color: #0f172a; background: #f8fafc;
                    transition: all 0.2s; outline: none;
                }
                .af-input:focus { border-color: #04bd20; background: #fff; box-shadow: 0 0 0 3px rgba(4,189,32,0.1); }
                .af-pw-toggle {
                    position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
                    border: none; background: transparent; color: #94a3b8; cursor: pointer; padding: 2px;
                    display: flex; align-items: center; font-size: 0.9rem;
                }
                .af-pw-toggle:hover { color: #04bd20; }
                .af-terms { font-size: 0.78rem; color: #64748b; display: flex; align-items: flex-start; gap: 0; }
                .af-terms-link { color: #04bd20; text-decoration: none; font-weight: 600; }
                .af-terms-link:hover { text-decoration: underline; }
                .af-submit-btn {
                    display: flex; align-items: center; justify-content: center;
                    padding: 13px 24px;
                    background: linear-gradient(135deg, #04bd20, #03a61c);
                    color: #fff; border: none; border-radius: 12px;
                    font-size: 0.95rem; font-weight: 700; cursor: pointer;
                    transition: all 0.25s; box-shadow: 0 4px 14px rgba(4,189,32,0.35);
                    letter-spacing: 0.01em;
                }
                .af-submit-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(4,189,32,0.45); }
                .af-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
                .af-loading { display: flex; align-items: center; gap: 10px; color: #04bd20; font-size: 0.85rem; font-weight: 500; }
                .af-spinner { width: 18px; height: 18px; border: 2px solid #04bd2033; border-top-color: #04bd20; border-radius: 50%; animation: spin 0.7s linear infinite; }
                .af-btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .af-switch-text { text-align: center; font-size: 0.87rem; color: #64748b; }
                .af-switch-link { border: none; background: transparent; color: #04bd20; font-weight: 700; cursor: pointer; padding: 0; font-size: 0.87rem; }
                .af-switch-link:hover { text-decoration: underline; }
            `}</style>
        </>
    )
}

export default Register
