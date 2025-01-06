import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBookOpen,
  faStickyNote,
  faVideo,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  return (
    <nav className="bg-white w-100 w-lg-25 h-100 position-sticky top-0 d-none d-lg-flex flex-column shadow-sm border-end">
      <div className="flex-grow-1 py-4">
        <a
          href="#dashboard"
          className="d-flex align-items-center px-4 py-3 text-dark text-decoration-none hover-bg-light"
        >
          <FontAwesomeIcon icon={faHome} className="me-3" />
          <span className="fw-semibold">Dashboard</span>
        </a>
        <a
          href="#courses"
          className="d-flex align-items-center px-4 py-3 text-dark text-decoration-none hover-bg-light"
        >
          <FontAwesomeIcon icon={faBookOpen} className="me-3" />
          <span className="fw-semibold">Courses</span>
        </a>
        <a
          href="#notes"
          className="d-flex align-items-center px-4 py-3 text-dark text-decoration-none hover-bg-light"
        >
          <FontAwesomeIcon icon={faStickyNote} className="me-3" />
          <span className="fw-semibold">Notes</span>
        </a>
        <a
          href="#videoLectures"
          className="d-flex align-items-center px-4 py-3 text-dark text-decoration-none hover-bg-light"
        >
          <FontAwesomeIcon icon={faVideo} className="me-3" />
          <span className="fw-semibold">Videos</span>
        </a>
        <a
          href="#previousQuestions"
          className="d-flex align-items-center px-4 py-3 text-dark text-decoration-none hover-bg-light active"
        >
          <FontAwesomeIcon icon={faQuestionCircle} className="me-3" />
          <span className="fw-semibold">PYQs</span>
        </a>
      </div>

      <div className="p-2 border-top">
        <div className="d-flex align-items-start">
          <img
            src="./assets/img/Front.png"
            alt="Profile"
            className="rounded-circle"
            style={{ width: "40px", height: "40px" }}
            loading="lazy"
          />
          <div className="ms-2">
            <p className="mb-0 fw-semibold text-dark">Instructor</p>
            <p className="mb-0 text-muted small">instructor@examee.com</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
