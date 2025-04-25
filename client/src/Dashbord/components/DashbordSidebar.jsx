import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBookOpen,
  faStickyNote,
  faVideo,
  faQuestionCircle,
  faUser,
  faSearch,
  faSchoolCircleXmark
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <nav className="bg-white w-100 position-sticky d-flex flex-column shadow-sm border-end dashboard-nav">
      <div className="flex-grow-1 py-4">
        <Link
          to="dashboard-head"
          className="d-flex align-items-center px-4 py-3 text-dark text-decoration-none hover-bg-light">
          <FontAwesomeIcon icon={faHome} className="me-3" />
          <span className="fw-semibold">Dashboard</span>
        </Link>

        <Link
          to="dashboard-notes"
          className="d-flex align-items-center px-4 py-3 text-dark text-decoration-none hover-bg-light">
          <FontAwesomeIcon icon={faStickyNote} className="me-3" />
          <span className="fw-semibold">Notes</span>
        </Link>

        <Link
          to="dashboard-pyq"
          className="d-flex align-items-center px-4 py-3 text-dark text-decoration-none hover-bg-light active">
          <FontAwesomeIcon icon={faQuestionCircle} className="me-3" />
          <span className="fw-semibold">PYQs</span>
        </Link>

        <Link
          to="dashboard-videos"
          className="d-flex align-items-center px-4 py-3 text-dark text-decoration-none hover-bg-light">
          <FontAwesomeIcon icon={faVideo} className="me-3" />
          <span className="fw-semibold">Videos</span>
        </Link>

        <Link
          to="dashboard-courses"
          className="d-flex align-items-center px-4 py-3 text-dark text-decoration-none hover-bg-light">
          <FontAwesomeIcon icon={faBookOpen} className="me-3" />
          <span className="fw-semibold">Courses</span>
        </Link>

        <Link
          to="dashboard-student-management"
          className="d-flex align-items-center px-4 py-3 text-dark text-decoration-none hover-bg-light active">
          <FontAwesomeIcon icon={faSchoolCircleXmark} className="me-3" />
          <span className="fw-semibold">Students</span>
        </Link>

        <Link
          to="dashboard-analyticst"
          className="d-flex align-items-center px-4 py-3 text-dark text-decoration-none hover-bg-light active">
          <FontAwesomeIcon icon={faSearch} className="me-3" />
          <span className="fw-semibold">Analytics</span>
        </Link>

        <Link
          to="dashboard-settings"
          className="d-flex align-items-center px-4 py-3 text-dark text-decoration-none hover-bg-light active">
          <FontAwesomeIcon icon={faUser} className="me-3" />
          <span className="fw-semibold">Settings</span>
        </Link>
      </div>

      {/* Profile Section at the bottom */}
      <div className="p-2 border-top">
        <div className="d-flex align-items-start">
          <img
            src="/assets/img/Front.png"
            alt="Profile"
            className="rounded-circle"
            style={{ width: "50px", height: "50px" }}
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
