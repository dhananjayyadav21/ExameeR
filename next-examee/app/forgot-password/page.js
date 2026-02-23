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
                setLoading(false);
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
                } else {
                    toast.error(result.message || 'Verification failed.');
                }
            }
        } catch (error) {
            console.error('Email code error:', error);
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
                    body: JSON.stringify({
                        Email: storedEmail,
                        ForgotPasswordCode,
                        NewPassword,
                        ConfirmNewPassword
                    }),
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
            console.error('Password reset error:', error);
            toast.error('An error occurred during password reset.');
        } finally {
            setLoading(false);
        }
    }

    const handlOnchange = (e) => {
        setForgotPassword({ ...ForgotPasswordData, [e.target.name]: e.target.value });
    };

    return (
        <main className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <div className="col-12 col-md-5 shadow-lg rounded-4 p-4 p-md-5 bg-white">
                <h4 className="fw-bold mb-4">Forgot Password?</h4>

                <form onSubmit={handleFogotPasswordEmail}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label small fw-bold">Email Address</label>
                        <input type="email" className="form-control" id="email" value={Email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-4" disabled={loading}>
                        {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                        Get Verification Code
                    </button>
                </form>

                <hr className="my-4" />

                <form onSubmit={handleForgotPassword}>
                    <div className='text-secondary mb-4'>
                        <p className='small m-0'>Enter the code sent to your email to set a new password.</p>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="vcode" className="form-label small fw-bold">Verification Code</label>
                        <input type="number" className="form-control" id="vcode" name='ForgotPasswordCode' value={ForgotPasswordData.ForgotPasswordCode} onChange={handlOnchange} placeholder="000000" required />
                    </div>

                    <div className="mb-3 position-relative">
                        <label htmlFor="NewPassword" className="form-label small fw-bold">New Password</label>
                        <input type={showPassword ? 'text' : 'password'} className="form-control" id="NewPassword" name='NewPassword' value={ForgotPasswordData.NewPassword} onChange={handlOnchange} required />
                        <span onClick={() => setShowPassword(!showPassword)}
                            style={{ position: 'absolute', top: '38px', right: '12px', cursor: 'pointer' }} className="text-muted">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <div className="mb-4 position-relative">
                        <label htmlFor="ConfirmNewPassword" className="form-label small fw-bold">Confirm Password</label>
                        <input type={showPassword ? 'text' : 'password'} className="form-control" id="ConfirmNewPassword" name='ConfirmNewPassword' value={ForgotPasswordData.ConfirmNewPassword} onChange={handlOnchange} required />
                        <span onClick={() => setShowPassword(!showPassword)}
                            style={{ position: 'absolute', top: '38px', right: '12px', cursor: 'pointer' }} className="text-muted">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <button type="submit" className="btn btn-success w-100 py-2 fw-bold" disabled={loading}>
                        Save New Password
                    </button>
                </form>

                <div className="text-center mt-4">
                    <small className="text-muted">Remember your password? </small>
                    <Link href="/auth" className="text-primary text-decoration-none fw-bold small">Login</Link>
                </div>
            </div>
        </main>
    )
}
