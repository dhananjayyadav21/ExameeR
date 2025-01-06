import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";

const Courses = () => {
  return (
    <div id="courses" className="min-vh-100 pt-2">
      {/* Header with Add Course Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 fw-bold text-dark">Courses</h1>
        <button className="btn btn-primary d-flex align-items-center gap-2">
          <svg
            className="bi bi-plus-circle"
            width="20"
            height="20"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 8a.5.5 0 0 1-.5.5H8.5v7.5a.5.5 0 0 1-1 0V8.5H.5a.5.5 0 0 1 0-1h7V.5a.5.5 0 0 1 1 0v7h7a.5.5 0 0 1 .5.5z"
            />
          </svg>
          Add New Course
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded border mb-4">
        <div className="row g-3">
          <div className="col-md">
            <label className="form-label fw-semibold">Search</label>
            <input
              type="text"
              placeholder="Search courses..."
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label fw-semibold">Category</label>
            <select className="form-select">
              <option value="">All Categories</option>
              <option value="programming">Programming</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label fw-semibold">Status</label>
            <select className="form-select">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {/* Course Card 1 */}
        <div className="col">
          <div className="card h-100 border">
            <img
              src="https://newexamee.netlify.app/assets/img/cource.jpg"
              alt="Course"
              className="card-img-top"
            />
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="card-title">C Programming Basics</h5>
                <span className="badge bg-success">Active</span>
              </div>
              <p className="card-text text-muted">
                Introduction to C programming fundamentals and basic concepts.
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted small">36 Lessons</span>
                <div className="d-flex gap-2">
                  <span className="p-2 text-primary" title="Edit">
                    <FontAwesomeIcon icon={faEdit} />
                  </span>
                  <span className="p-2 text-danger" title="Delete">
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Card 2 */}
        <div className="col">
          <div className="card h-100 border">
            <img
              src="https://newexamee.netlify.app/assets/img/cource.jpg"
              alt="Course"
              className="card-img-top"
            />
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="card-title">Data Structures</h5>
                <span className="badge bg-warning text-dark">Draft</span>
              </div>
              <p className="card-text text-muted">
                Advanced concepts in data structures and algorithms.
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted small">42 Lessons</span>
                <div className="d-flex gap-2">
                  <span className="p-2 text-primary" title="Edit">
                    <FontAwesomeIcon icon={faEdit} />
                  </span>
                  <span className="p-2 text-danger" title="Delete">
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Card 3 */}
        <div className="col">
          <div className="card h-100 border">
            <img
              src="https://newexamee.netlify.app/assets/img/cource.jpg"
              alt="Course"
              className="card-img-top"
            />
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 className="card-title">Database Management</h5>
                <span className="badge bg-success">Active</span>
              </div>
              <p className="card-text text-muted">
                Complete guide to database design and management.
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted small">28 Lessons</span>
                <div className="d-flex gap-2">
                  <span className="p-2 text-primary" title="Edit">
                    <FontAwesomeIcon icon={faEdit} />
                  </span>
                  <span className="p-2 text-danger" title="Delete">
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="row g-2 d-flex justify-content-center mt-4">
        <div className="col-md-6">
          <div className="text-muted">Showing 1 to 2 of 15 Cources</div>
        </div>
        <div className="col-md-6">
          <nav>
            <button className="btn btn-outline-secondary me-2">Previous</button>
            <button className="btn btn-warning me-2">1</button>
            <button className="btn btn-outline-secondary me-2">2</button>
            <button className="btn btn-outline-secondary me-2">3</button>
            <button className="btn btn-outline-secondary">Next</button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Courses;
