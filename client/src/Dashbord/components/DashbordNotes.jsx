import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlusCircle, 
  faEdit, 
  faDownload, 
  faTrashAlt, 
  faFileAlt 
} from "@fortawesome/free-solid-svg-icons";

const StudyNotes = () => {
  return (
    <>
      <div id="notes" className="min-vh-100 pt-2">
        {/* Header with Add Notes Button */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h2 font-weight-bold text-dark">Study Notes</h1>
          <button className="btn btn-success d-flex align-items-center">
            <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
            Upload Notes
          </button>
        </div>
    

        {/* Filters and Search */}
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

        {/* Notes List */}
        <div className="bg-white rounded border border-light overflow-hidden">
          <div className="table-responsive">
            <table className="table">
              <thead className="bg-light">
                <tr>
                  <th className="text-left">Title</th>
                  <th className="text-left">Subject</th>
                  <th className="text-left">Semester</th>
                  <th className="text-left">Upload Date</th>
                  <th className="text-left">Size</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Note Item 1 */}
                <tr className="table-hover">
                  <td>
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon
                        icon={faFileAlt}
                        className="text-secondary me-2"
                        size="lg"
                      />
                      <span className="text-sm text-dark">Data Structures Notes</span>
                    </div>
                  </td>
                  <td className="text-secondary">Computer Science</td>
                  <td className="text-secondary">Semester 3</td>
                  <td className="text-secondary">2024-02-10</td>
                  <td className="text-secondary">2.4 MB</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-link text-primary" title="Edit">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="btn btn-link text-success" title="Download">
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                      <button className="btn btn-link text-danger" title="Delete">
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Note Item 1 */}
                <tr className="table-hover">
                  <td>
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon
                        icon={faFileAlt}
                        className="text-secondary me-2"
                        size="lg"
                      />
                      <span className="text-sm text-dark">Data Structures Notes</span>
                    </div>
                  </td>
                  <td className="text-secondary">Computer Science</td>
                  <td className="text-secondary">Semester 3</td>
                  <td className="text-secondary">2024-02-10</td>
                  <td className="text-secondary">2.4 MB</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-link text-primary" title="Edit">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="btn btn-link text-success" title="Download">
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                      <button className="btn btn-link text-danger" title="Delete">
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Note Item 1 */}
                <tr className="table-hover">
                  <td>
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon
                        icon={faFileAlt}
                        className="text-secondary me-2"
                        size="lg"
                      />
                      <span className="text-sm text-dark">Data Structures Notes</span>
                    </div>
                  </td>
                  <td className="text-secondary">Computer Science</td>
                  <td className="text-secondary">Semester 3</td>
                  <td className="text-secondary">2024-02-10</td>
                  <td className="text-secondary">2.4 MB</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn btn-link text-primary" title="Edit">
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button className="btn btn-link text-success" title="Download">
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                      <button className="btn btn-link text-danger" title="Delete">
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="row g-3 d-flex justify-content-between align-items-center mt-3">
          <div className="col-md-6">
            <div className="text-muted">Showing 1 to 2 of 24 entries</div>
          </div>
          <div className="col-md-6">
            <nav>
              <button className="btn btn-outline-secondary me-2">Previous</button>
              <button className="btn btn-success me-2">1</button>
              <button className="btn btn-outline-secondary me-2">2</button>
              <button className="btn btn-outline-secondary me-2">3</button>
              <button className="btn btn-outline-secondary">Next</button>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudyNotes;
