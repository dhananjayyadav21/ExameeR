"use client";
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NO_FOOTER_PATHS = ['/notes', '/video', '/Q-paper', '/cource'];

const Footer = () => {
    const pathname = usePathname();
    const [token, setToken] = React.useState(null);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            setToken(localStorage.getItem("token"));
        }
    }, []);

    // Hide footer on specific pages (including dashboard) or if logged in
    if (pathname.startsWith('/dashboard') || token || NO_FOOTER_PATHS.some(path => pathname === path || pathname.startsWith(path + '/'))) {
        return null;
    }

    return (
        <div className="footer-wrapper bg-dark text-light">
            <div className="container py-5 px-4">
                <div className="row g-5">
                    <div className="col-lg-4 col-md-6">
                        <div className="footer-brand mb-4">
                            <img src="/assets/img/brandlog.png" alt="Examee" width="140" className="mb-3 brightness-110" />
                            <p className="text-light-muted pe-lg-4">
                                Empowering students with premium educational resources, curated notes, and professional courses tailored for academic excellence.
                            </p>
                        </div>
                        <div className="footer-socials d-flex gap-3">
                            <a href="https://linkedin.com/company/exameeforstudents" target="_blank" className="social-link shadow-sm"><i className="fa-brands fa-linkedin-in"></i></a>
                            <a href="https://whatsapp.com/channel/0029VbB4nWj90x34JLYsKm2Q" target="_blank" className="social-link shadow-sm"><i className="fa-brands fa-whatsapp"></i></a>
                            <a href="https://youtube.com/@exameecode" target="_blank" className="social-link shadow-sm"><i className="fa-brands fa-youtube"></i></a>
                        </div>
                    </div>

                    <div className="col-lg-2 col-md-6 col-6">
                        <h6 className="text-uppercase fw-bold mb-4 ls-wide">Platform</h6>
                        <ul className="list-unstyled footer-links">
                            <li className="mb-2"><Link href="/" className="text-white-50 text-decoration-none transition-all">Home</Link></li>
                            <li className="mb-2"><Link href="/about" className="text-white-50 text-decoration-none transition-all">About Us</Link></li>
                            <li className="mb-2"><Link href="/notes" className="text-white-50 text-decoration-none transition-all">Study Notes</Link></li>
                            <li className="mb-2"><Link href="/video" className="text-white-50 text-decoration-none transition-all">Video Lectures</Link></li>
                            <li className="mb-2"><Link href="/Q-paper" className="text-white-50 text-decoration-none transition-all">PQ-Papers</Link></li>
                        </ul>
                    </div>

                    <div className="col-lg-2 col-md-6 col-6">
                        <h6 className="text-uppercase fw-bold mb-4 ls-wide">Categories</h6>
                        <ul className="list-unstyled footer-links">
                            <li className="mb-2"><Link href="/cource" className="text-white-50 text-decoration-none transition-all">Sci-Tech</Link></li>
                            <li className="mb-2"><Link href="/cource" className="text-white-50 text-decoration-none transition-all">Commerce</Link></li>
                            <li className="mb-2"><Link href="/cource" className="text-white-50 text-decoration-none transition-all">Arts & Civils</Link></li>
                            <li className="mb-2"><Link href="/contact" className="text-white-50 text-decoration-none transition-all">Support</Link></li>
                        </ul>
                    </div>

                    <div className="col-lg-4 col-md-6">
                        <h6 className="text-uppercase fw-bold mb-4 ls-wide">Newsletter</h6>
                        <p className="text-white-50 mb-4">Stay updated with the latest notes and exam tips.</p>
                        <form className="newsletter-form d-flex gap-2">
                            <input type="email" className="form-control bg-transparent border-secondary text-white rounded-pill px-4" placeholder="Your email" required />
                            <button type="submit" className="btn-green rounded-circle p-0" style={{ width: '45px', height: '45px', border: 'none' }}>
                                <i className="fa-solid fa-paper-plane text-white"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="footer-bottom py-4 border-top border-secondary border-opacity-25">
                <div className="container px-4">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                            <span className="text-white-50 small">&copy; 2024 Examee Learning Platform. All Rights Reserved.</span>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <div className="footer-bottom-links d-flex justify-content-center justify-content-md-end gap-4 small text-white-50">
                                <Link href="#" className="text-decoration-none transition-all text-white-50">Privacy Policy</Link>
                                <Link href="#" className="text-decoration-none transition-all text-white-50">Terms of Service</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .footer-wrapper {
                    background: #020617 !important;
                }
                .ls-wide { letter-spacing: 0.1em; font-size: 0.75rem; color: var(--primary-color); }
                .footer-links a:hover { color: var(--primary-color) !important; padding-left: 5px; }
                .social-link {
                    width: 36px;
                    height: 36px;
                    background: rgba(255,255,255,0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    color: #fff;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }
                .social-link:hover {
                    background: var(--primary-color);
                    transform: translateY(-3px);
                }
                .transition-all { transition: all 0.3s ease; }
                .brightness-110 { filter: brightness(1.1); }
            `}</style>
        </div>
    )
}

export default Footer
