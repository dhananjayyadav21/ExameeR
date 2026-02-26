"use client";
import React, { useState } from 'react';

export default function FloatingContact() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="floating-contact-wrapper fixed-bottom end-0 p-4 z-index-top animate-float-slow">
            <div className="d-flex flex-column align-items-end gap-3 position-relative">
                {/* Support Menu (Appears on Hover/Click) */}
                <div className={`contact-menu bg-white shadow-3xl rounded-4 p-3 mb-3 border transition-all ${isOpen ? 'show-menu' : 'hide-menu'}`} style={{ width: '250px' }}>
                    <div className="d-flex align-items-center gap-3 mb-3 pb-2 border-bottom">
                        <div className="bg-primary-premium p-2 rounded-circle text-white">
                            <i className="fa-solid fa-headset"></i>
                        </div>
                        <div>
                            <h6 className="mb-0 fw-bold">Need Help?</h6>
                            <p className="small text-muted mb-0">Our support is online</p>
                        </div>
                    </div>

                    <a href="tel:+911234567890" className="d-flex align-items-center gap-3 p-2 rounded-3 text-decoration-none text-dark hover-bg-light transition-all mb-2">
                        <div className="bg-success text-white px-2 py-1 rounded-circle small-icon"><i className="fa-solid fa-phone small"></i></div>
                        <div className="small fw-bold">+91 1234 567 890</div>
                    </a>

                    <a href="mailto:support@examee.com" className="d-flex align-items-center gap-3 p-2 rounded-3 text-decoration-none text-dark hover-bg-light transition-all">
                        <div className="bg-info text-white px-2 py-1 rounded-circle small-icon"><i className="fa-solid fa-envelope small"></i></div>
                        <div className="small fw-bold">support@examee.com</div>
                    </a>
                </div>

                {/* Main Floating Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="btn btn-primary-premium rounded-circle shadow-3xl d-flex align-items-center justify-content-center p-0 transition-all main-fab-btn"
                    style={{ width: '65px', height: '65px' }}
                >
                    <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-phone-volume'} fs-3`}></i>
                </button>
            </div>


        </div>
    );
}
