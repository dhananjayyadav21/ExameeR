import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faPlayCircle,
  faEdit,
  faTrashAlt,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const VideoLectures = () => {
  return (
    <div id="videoLectures" className="min-vh-100 pt-2">
      {/* Header with Add Video Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 font-weight-bold text-dark">Video Lectures</h1>
        <button className="btn btn-purple px-4 py-2 d-flex align-items-center">
          <FontAwesomeIcon icon={faPlus} className="me-2" /> Upload Video Lecture
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded border border-light mb-4">
        <div className="d-flex flex-wrap gap-3">
          <div className="flex-fill" style={{ minWidth: "200px" }}>
            <label className="form-label">Search Videos</label>
            <input type="text" placeholder="Search by title or topic..." className="form-control" />
          </div>
          <div className="w-48">
            <label className="form-label">Subject</label>
            <select className="form-select">
              <option value="">All Subjects</option>
              <option value="programming">Programming</option>
              <option value="database">Database</option>
              <option value="networking">Networking</option>
            </select>
          </div>
          <div className="w-48">
            <label className="form-label">Duration</label>
            <select className="form-select">
              <option value="">All Durations</option>
              <option value="0-15">0-15 minutes</option>
              <option value="15-30">15-30 minutes</option>
              <option value="30+">30+ minutes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="row g-3">
        {/* Video Card 1 */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="bg-white rounded border border-light overflow-hidden">
            <div className="position-relative">
              <img
                src="https://newexamee.netlify.app/assets/img/cource.jpg"
                alt="Video Thumbnail"
                className="img-fluid"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div
                className="position-absolute top-0 start-0 w-100 h-100 bg-black d-flex align-items-center justify-content-center"
                style={{ opacity: 0.4 }}
              >
                <FontAwesomeIcon icon={faPlayCircle} className="text-white" size="3x" />
              </div>
              <span
                className="position-absolute bottom-0 end-0 bg-black text-white"
                style={{ opacity: 0.75, padding: "0.25rem 0.5rem", borderRadius: "0.25rem" }}
              >
                25:30
              </span>
            </div>
            <div className="p-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h3 className="h5 text-dark">Introduction to Data Structures</h3>
                <div className="px-2 py-1 text-xs font-weight-bold text-purple bg-light rounded-pill">New</div>
              </div>
              <p className="text-muted mb-4">
                Learn the fundamentals of data structures and their implementations.
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Uploaded: Feb 10, 2024</span>
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

          {/* Video Card 1 */}
          <div className="col-12 col-md-6 col-lg-4">
          <div className="bg-white rounded border border-light overflow-hidden">
            <div className="position-relative">
              <img
                src="https://newexamee.netlify.app/assets/img/cource.jpg"
                alt="Video Thumbnail"
                className="img-fluid"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div
                className="position-absolute top-0 start-0 w-100 h-100 bg-black d-flex align-items-center justify-content-center"
                style={{ opacity: 0.4 }}
              >
                <FontAwesomeIcon icon={faPlayCircle} className="text-white" size="3x" />
              </div>
              <span
                className="position-absolute bottom-0 end-0 bg-black text-white"
                style={{ opacity: 0.75, padding: "0.25rem 0.5rem", borderRadius: "0.25rem" }}
              >
                25:30
              </span>
            </div>
            <div className="p-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h3 className="h5 text-dark">Introduction to Data Structures</h3>
                <div className="px-2 py-1 text-xs font-weight-bold text-purple bg-light rounded-pill">New</div>
              </div>
              <p className="text-muted mb-4">
                Learn the fundamentals of data structures and their implementations.
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Uploaded: Feb 10, 2024</span>
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
      <div className="d-flex justify-content-between align-items-center mt-4">
        <div className="text-muted">Showing 1 to 2 of 18 videos</div>
        <nav className="d-flex">
          <button className="btn btn-outline-secondary me-2">
            <FontAwesomeIcon icon={faChevronLeft} /> Previous
          </button>
          <button className="btn btn-primary me-2">1</button>
          <button className="btn btn-outline-secondary me-2">2</button>
          <button className="btn btn-outline-secondary me-2">3</button>
          <button className="btn btn-outline-secondary">
            Next <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default VideoLectures;
