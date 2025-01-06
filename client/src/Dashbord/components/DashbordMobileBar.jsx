import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

function MobileMenuButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
    <button
      type="button"
      className="mobile-menu-button btn btn-info px-3"
      onClick={toggleMenu}>
      <FontAwesomeIcon
        icon={isOpen ? faTimes : faBars} // Toggle between bars and times icons
        size="lg" // Set icon size
        color="currentColor" // Use current text color
      />
    </button>


    
    </>
  );
}

export default MobileMenuButton;
