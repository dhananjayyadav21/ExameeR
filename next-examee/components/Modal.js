"use client";
import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, heading, subHeading }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                    backdropFilter: 'blur(4px)', zIndex: 1050
                }}
            />

            {/* Dialog */}
            <div style={{
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)', zIndex: 1060,
                width: 'min(420px, 94vw)',
                animation: 'modalPop 0.18s ease'
            }}>
                <div style={{
                    background: 'white', borderRadius: '16px',
                    overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
                }}>
                    {/* Top accent */}
                    <div style={{ height: '4px', background: 'linear-gradient(90deg,#04bd20,#0d6efd)' }} />

                    {/* Body */}
                    <div style={{ padding: '28px 24px 20px' }}>
                        {/* Icon */}
                        <div style={{
                            width: '52px', height: '52px', borderRadius: '14px',
                            background: 'rgba(245,158,11,0.1)', margin: '0 auto 16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <i className="fa-solid fa-triangle-exclamation" style={{ color: '#f59e0b', fontSize: '1.3rem' }}></i>
                        </div>

                        <h2 style={{ fontSize: '1rem', fontWeight: 700, textAlign: 'center', margin: '0 0 6px', color: '#111' }}>
                            {heading}
                        </h2>
                        {subHeading && (
                            <p style={{ fontSize: '0.835rem', color: '#6b7280', textAlign: 'center', margin: 0, lineHeight: '1.5' }}>
                                {subHeading}
                            </p>
                        )}
                    </div>

                    {/* Footer actions */}
                    <div style={{
                        padding: '0 24px 24px',
                        display: 'flex', justifyContent: 'center', gap: '10px'
                    }}>
                        <button
                            onClick={onClose}
                            style={{
                                flex: 1, padding: '10px 0', borderRadius: '10px', border: '1px solid #e5e7eb',
                                background: 'white', color: '#374151', fontWeight: 600,
                                fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.15s'
                            }}
                            onMouseOver={e => e.currentTarget.style.background = '#f9fafb'}
                            onMouseOut={e => e.currentTarget.style.background = 'white'}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            style={{
                                flex: 1, padding: '10px 0', borderRadius: '10px', border: 'none',
                                background: '#111', color: 'white', fontWeight: 600,
                                fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.15s'
                            }}
                            onMouseOver={e => e.currentTarget.style.background = '#333'}
                            onMouseOut={e => e.currentTarget.style.background = '#111'}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes modalPop { from { opacity: 0; transform: translate(-50%,-48%) scale(0.95); } to { opacity: 1; transform: translate(-50%,-50%) scale(1); } }
            `}</style>
        </>
    );
};

export default Modal;
