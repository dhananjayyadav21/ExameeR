"use client";
import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const FloatingWhatsAppButton = () => {
    const whatsappLink = 'https://whatsapp.com/channel/0029VbB4nWj90x34JLYsKm2Q';

    const openWhatsApp = () => {
        if (typeof window !== 'undefined') {
            window.open(`${whatsappLink}`, '_blank');
        }
    };

    return (
        <div className="whatsapp-float" onClick={openWhatsApp} style={{ cursor: 'pointer' }}>
            <FaWhatsapp className="whatsapp-icon" />
        </div>
    );
};

export default FloatingWhatsAppButton;
