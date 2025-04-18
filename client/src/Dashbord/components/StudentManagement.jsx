import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faLock,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

const StudentManagement = () => {
  return (
    <div id="studentManagement" className="min-vh-100 p-3 py-4 px-md-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 font-weight-bold text-dark">Student Management</h1>
        <button className="btn btn-primary px-4 py-2 d-flex align-items-center">
          <FontAwesomeIcon icon={faPlus} className="me-2" /> Add Student
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-3 rounded border border-light mb-4">
        <div className="d-flex flex-wrap gap-3">
          <div className="flex-fill min-width-200">
            <label className="form-label">Search Students</label>
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              className="form-control"
            />
          </div>
          <div className="w-48">
            <label className="form-label">Course</label>
            <select className="form-select">
              <option value="">All Courses</option>
              <option value="computer-science">Computer Science</option>
              <option value="data-structures">Data Structures</option>
              <option value="database">Database Management</option>
            </select>
          </div>
          <div className="w-48">
            <label className="form-label">Status</label>
            <select className="form-select">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3 border border-gray-200 overflow-hidden my-4">
        <div className="overflow-auto">
          <table className="table w-100">
            <thead>
              <tr className="table-light">
                <th className="text-start py-3 px-4 text-sm font-semibold text-gray-600">
                  Student
                </th>
                <th className="text-start py-3 px-4 text-sm font-semibold text-gray-600">
                  ID
                </th>
                <th className="text-start py-3 px-4 text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th className="text-start py-3 px-4 text-sm font-semibold text-gray-600">
                  Enrolled Courses
                </th>
                <th className="text-start py-3 px-4 text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-end py-3 px-4 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-row hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="d-flex align-items-center">
                    <img
                      src="https://wallpapers.com/images/hd/professional-profile-pictures-1350-x-1080-sizz773bu8k11plw.jpg"
                      alt="Student"
                      className="w-8 h-8 rounded-circle me-3"
                      style={{height:"30px", width:"30px"}}
                    />
                    <span className="text-sm font-medium text-gray-800">John Doe</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">STD001</td>
                <td className="py-3 px-4 text-sm text-gray-600">john.doe@example.com</td>
                <td className="py-3 px-4">
                  <div className="d-flex flex-wrap gap-1">
                    <span className="badge bg-primary text-white">Data Structures</span>
                    <span className="badge bg-purple text-white">Database</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="badge bg-success text-white">Active</span>
                </td>
                <td className="py-3 px-4">
                  <div className="d-flex gap-2 justify-content-end">
                    <button className="btn btn-outline-primary" title="Edit">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="btn btn-outline-warning" title="Block">
                      <FontAwesomeIcon icon={faLock} />
                    </button>
                    <button className="btn btn-outline-danger" title="Delete">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="table-row hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="d-flex align-items-center">
                    <img
                      src="https://www.atlanticcouncil.org/wp-content/uploads/2022/09/JolyMelanie_Lib_t-1.jpg"
                      alt="Student"
                      className="w-8 h-8 rounded-circle me-3"
                      style={{height:"30px", width:"30px"}}
                    />
                    <span className="text-sm font-medium text-gray-800">Jane Smith</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">STD002</td>
                <td className="py-3 px-4 text-sm text-gray-600">jane.smith@example.com</td>
                <td className="py-3 px-4">
                  <div className="d-flex flex-wrap gap-1">
                    <span className="badge bg-primary text-white">Data Structures</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="badge bg-warning text-white">Inactive</span>
                </td>
                <td className="py-3 px-4">
                  <div className="d-flex gap-2 justify-content-end">
                    <button className="btn btn-outline-primary" title="Edit">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="btn btn-outline-success" title="Activate">
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                    <button className="btn btn-outline-danger" title="Delete">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
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
            <button className="btn btn-success me-2">1</button>
            <button className="btn btn-outline-secondary me-2">2</button>
            <button className="btn btn-outline-secondary me-2">3</button>
            <button className="btn btn-outline-secondary">Next</button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
