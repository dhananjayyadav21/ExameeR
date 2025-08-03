import React from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const GoToImpsButton = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/ImpsPage');
    };

    return (
        <div className="go-to-imps" data-toggle="tooltip" data-placement="left" title="GO TO Imp" onClick={handleClick}
        >
            <FaArrowUp className="arrow-icon" />
        </div>
    );
};

export default GoToImpsButton;
