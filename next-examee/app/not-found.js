"use client";
import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFound() {
    return (
        <div className="d-flex flex-column min-vh-100">

            <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center py-5 text-center px-4">
                <div
                    className="mb-4 d-flex align-items-center justify-content-center rounded-circle bg-light shadow-sm"
                    style={{ width: '150px', height: '150px', border: '3px solid #04bd20' }}
                >
                    <span style={{ fontSize: '3.5rem', fontWeight: '900', color: '#04bd20', textShadow: '2px 2px 0px rgba(0,0,0,0.05)' }}>404</span>
                </div>
                <h1 className="display-4 fw-black text-dark mb-3">Page Not Found</h1>
                <p className="text-muted fs-5 mb-5" style={{ maxWidth: '500px' }}>
                    Oops! The page you're searching for seems to have vanished into thin air. Don't worry, even the best explorers get lost sometimes.
                </p>
                <div className="d-flex gap-3">
                    <Link href="/" className="btn btn-green rounded-pill px-5 py-3 fw-bold shadow-lg text-decoration-none">
                        Return Home
                    </Link>
                    <Link href="/auth" className="btn btn-outline-dark rounded-pill px-5 py-3 fw-bold shadow-sm text-decoration-none border-2">
                        Sign In
                    </Link>
                </div>
            </main>
        </div>
    );
}
