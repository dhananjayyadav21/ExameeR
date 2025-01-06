import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUploadAlt,
  faImage,
} from "@fortawesome/free-solid-svg-icons";

const UploadForm = () => {
  return (
    <form className="bg-white rounded-lg border shadow-sm p-4">
      {/* Basic Information */}
      <div className="mb-4">
        <h2 className="h5 font-semibold text-dark mb-3">Basic Information</h2>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Course Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter course title"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Category</label>
            <select className="form-select">
              <option>Select Category</option>
              <option>Sci-Technology</option>
              <option>Commerce</option>
              <option>Arts & Civils</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Difficulty Level</label>
            <select className="form-select">
              <option>Select Level</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Duration (hours)</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter duration"
            />
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="mb-4">
        <h2 className="h5 font-semibold text-dark mb-3">Course Content</h2>
        <div className="mb-3">
          <label className="form-label">Course Description</label>
          <textarea
            rows="4"
            className="form-control"
            placeholder="Enter course description"
          ></textarea>
        </div>
        <div>
          <label className="form-label">Course Outline</label>
          <textarea
            rows="4"
            className="form-control"
            placeholder="Enter course outline (topics covered)"
          ></textarea>
        </div>
      </div>

      {/* Course Materials */}
      <div className="mb-4">
        <h2 className="h5 font-semibold text-dark mb-3">Course Materials</h2>
        <div className="p-4 border border-dashed text-center">
          <FontAwesomeIcon
            icon={faCloudUploadAlt}
            className="text-secondary mb-2"
            size="2x"
          />
          <p className="text-secondary">Drag and drop course materials here</p>
          <p className="small text-muted">or</p>
          <button
            type="button"
            className="btn btn-link text-primary"
          >
            Browse files
          </button>
          <input type="file" className="d-none" multiple />
        </div>
        <div className="form-text">
          Supported formats: PDF, DOCX, PPT (Max size: 50MB per file)
        </div>
      </div>

      {/* Course Preview Image */}
      <div className="mb-4">
        <h2 className="h5 font-semibold text-dark mb-3">Course Preview Image</h2>
        <div className="p-4 border border-dashed text-center">
          <FontAwesomeIcon
            icon={faImage}
            className="text-secondary mb-2"
            size="2x"
          />
          <p className="text-secondary">Upload course preview image</p>
          <p className="small text-muted">Recommended size: 1280x720px</p>
          <button
            type="button"
            className="btn btn-link text-primary"
          >
            Choose image
          </button>
          <input type="file" className="d-none" accept="image/*" />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-outline-secondary"
        >
          Save Draft
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Upload Course
        </button>
      </div>
    </form>
  );
};

export default UploadForm;
