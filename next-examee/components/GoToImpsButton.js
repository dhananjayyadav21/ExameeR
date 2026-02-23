"use client";
import React from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const GoToImpsButton = () => {
    const router = useRouter();

    const handleClick = () => {
        router.push('/ImpsPage');
    };

    return (
        <div className="go-to-imps" data-toggle="tooltip" data-placement="left" title="GO TO Imp" onClick={handleClick} style={{ cursor: 'pointer' }}>
            <FaArrowUp className="arrow-icon" />
        </div>
    );
};

export default GoToImpsButton;
