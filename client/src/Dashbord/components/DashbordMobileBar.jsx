import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./DashbordSidebar";

function MobileMenuButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDisplay, setIsDisplay] = useState("none");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setIsDisplay("");
    if(isOpen === true){
        setIsDisplay("none");
      }
  };

  return (
    <>
       <div className="dashbord-mobilebar-btn">
            <button
            type="button"
            className="mobile-menu-button btn btn-light px-3"
            onClick={toggleMenu}>
            <FontAwesomeIcon
                icon={isOpen ? faTimes : faBars} // Toggle between bars and times icons
                size="lg" // Set icon size
                color="currentColor" // Use current text color
            />
            </button>
        </div>

        <div className={`dashbord-mobilebar d-${isDisplay}`}>
            <Sidebar/>
        </div>
    
    </>
  );
}

export default MobileMenuButton;
