import React, { useEffect, useState, useRef } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const GoToImpsButton = () => {
    const navigate = useNavigate();
    const [isFixed, setIsFixed] = useState(false);
    const buttonRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            if (scrollY > 300 && !isFixed) {
                setIsFixed(true);
            } else if (scrollY <= 300 && isFixed) {
                setIsFixed(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isFixed]);

    const handleClick = () => {
        navigate('/imps');
    };

    return (
        <div
            ref={buttonRef}
            className={`go-to-imps ${isFixed ? 'fixed' : 'absolute'}`}
            onClick={handleClick}
            title="Go to Important Page"
        >
            <FaArrowUp className="arrow-icon" />
        </div>
    );
};

export default GoToImpsButton;
