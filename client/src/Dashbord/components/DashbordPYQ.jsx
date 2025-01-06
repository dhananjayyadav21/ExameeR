import React from "react";
import { FaPlusCircle, FaEdit, FaDownload, FaTrash, FaFileAlt } from "react-icons/fa";

const PreviousQuestions = () => {
  return (
    <div id="previousQuestions" className="min-vh-100 pt-2">
      {/* Header with Add Question Paper Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 font-weight-bold text-dark">Previous Year Questions</h1>
        <button className="btn btn-warning d-flex align-items-center">
          <FaPlusCircle className="me-2" />
          Upload Question Paper
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded border border-light mb-4">
        <div className="d-flex flex-wrap gap-4">
          <div className="flex-fill min-w-200">
            <label className="form-label">Search Papers</label>
            <input
              type="text"
              placeholder="Search by subject or year..."
              className="form-control"
            />
          </div>
          <div className="w-48">
            <label className="form-label">Year</label>
            <select className="form-select">
              <option value="">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
          </div>
          <div className="w-48">
            <label className="form-label">Exam Type</label>
            <select className="form-select">
              <option value="">All Types</option>
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>
        </div>
      </div>

      {/* Question Papers List */}
      <div className="bg-white rounded border border-light overflow-hidden">
        <div className="table-responsive">
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th className="text-left">Subject</th>
                <th className="text-left">Year</th>
                <th className="text-left">Exam Type</th>
                <th className="text-left">Duration</th>
                <th className="text-left">Total Marks</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Question Paper Item 1 */}
              <tr className="table-row">
                <td>
                  <div className="d-flex align-items-center">
                    <FaFileAlt className="me-2 text-secondary" />
                    <span className="font-weight-medium">Data Structures</span>
                  </div>
                </td>
                <td>2023</td>
                <td>Final</td>
                <td>3 hours</td>
                <td>100</td>
                <td>
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-link text-primary" title="Edit">
                      <FaEdit />
                    </button>
                    <button className="btn btn-link text-success" title="Download">
                      <FaDownload />
                    </button>
                    <button className="btn btn-link text-danger" title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>

               {/* Question Paper Item 1 */}
               <tr className="table-row">
                <td>
                  <div className="d-flex align-items-center">
                    <FaFileAlt className="me-2 text-secondary" />
                    <span className="font-weight-medium">Data Structures</span>
                  </div>
                </td>
                <td>2023</td>
                <td>Final</td>
                <td>3 hours</td>
                <td>100</td>
                <td>
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-link text-primary" title="Edit">
                      <FaEdit />
                    </button>
                    <button className="btn btn-link text-success" title="Download">
                      <FaDownload />
                    </button>
                    <button className="btn btn-link text-danger" title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>

               {/* Question Paper Item 1 */}
               <tr className="table-row">
                <td>
                  <div className="d-flex align-items-center">
                    <FaFileAlt className="me-2 text-secondary" />
                    <span className="font-weight-medium">Data Structures</span>
                  </div>
                </td>
                <td>2023</td>
                <td>Final</td>
                <td>3 hours</td>
                <td>100</td>
                <td>
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-link text-primary" title="Edit">
                      <FaEdit />
                    </button>
                    <button className="btn btn-link text-success" title="Download">
                      <FaDownload />
                    </button>
                    <button className="btn btn-link text-danger" title="Delete">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {/* Pagination */}
      <div className="row g-2 d-flex justify-content-center mt-4">
        <div className="col-md-6">
          <div className="text-muted">Showing 1 to 2 of 15 Cources</div>
        </div>
        <div className="col-md-6">
          <nav>
            <button className="btn btn-outline-secondary me-2">Previous</button>
            <button className="btn btn-info me-2">1</button>
            <button className="btn btn-outline-secondary me-2">2</button>
            <button className="btn btn-outline-secondary me-2">3</button>
            <button className="btn btn-outline-secondary">Next</button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default PreviousQuestions;
