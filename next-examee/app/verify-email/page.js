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

    useEffect(() => {
        setProgress(0);
        setProgress(100);
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

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
            console.error('Verification error:', error);
            toast.error('An error occurred during verification.');
        }
    };

    return (
        <main className="container d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <div className="col-12 col-md-5 shadow-lg rounded-4 p-4 p-md-5 bg-white border">
                <h3 className="fw-bold mb-4">Verify Email</h3>

                <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">Verifying for:</label>
                    <input type="email" className="form-control bg-light" value={Email} readOnly />
                </div>

                <div className='text-secondary mb-4'>
                    <p className='small m-0'>Please enter the code sent to your email address to complete verification.</p>
                </div>

                <form onSubmit={handleFormSubmit}>
                    <div className="mb-4">
                        <label htmlFor="VerificationCode" className="form-label small fw-bold">Verification Code</label>
                        <input
                            type="text"
                            className="form-control form-control-lg text-center fw-bold"
                            id="VerificationCode"
                            value={VerificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="000000"
                            style={{ letterSpacing: '4px' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100 py-3 fw-bold">
                        VERIFY & CONTINUE
                    </button>
                </form>

                <div className="text-center mt-4">
                    <button className="btn btn-link text-decoration-none small" onClick={() => router.push('/auth')}>Back to Login</button>
                </div>
            </div>
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
