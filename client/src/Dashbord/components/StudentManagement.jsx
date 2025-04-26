import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import ContentContext from '../../context/ContentContext'
import * as GlobalUrls from "../../GlobalURL";
import { toast } from "react-toastify";

const StudentManagement = () => {
  const context = useContext(ContentContext);
  const { getStudentsByRole, studentsByRole } = context;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isloading, setIsloading] = useState(false);

  useEffect(() => {
    getStudentsByRole();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    try {
      const res = await getStudentsByRole(`${GlobalUrls.GETSTUDENTSBYROLE_URL}?search=${search}&status=${status}`);
      if (res.success === false) {
        toast.warning(res.message || "No matching students found", {
          position: "top-right"
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsloading(false);
    }
  }

  return (
    <div id="studentManagement" className="min-vh-100 p-3 py-4 px-md-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 font-weight-bold text-dark dashbord-heading-text">Student Management</h1>
        <button className="btn btn-primary px-4 py-2 d-flex align-items-center dashbord-upload-btn-text">
          <FontAwesomeIcon icon={faPlus} className="me-2" /> Add Student
        </button>
      </div>

      {/* Filters and Search */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded border mb-4"
      >
        <div className="row g-3">
          <div className="col-md">
            <label className="form-label fw-semibold">Search</label>
            <input
              type="text"
              placeholder="Search students ..."
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label fw-semibold">Status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">ALL </option>
              <option value="active">Active</option>
              <option value="inactive">In Active</option>
            </select>
          </div>
        </div>
      </form>

      {isloading && <h4 className="my-4">Loding.....</h4> }
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
              {studentsByRole.map((student, i) => (
                <tr className="table-row hover:bg-gray-50" key={i}>
                  <td className="py-3 px-4">
                    <div className="d-flex align-items-center">
                      <img
                        src={student?.Profile || "/assets/img/Avtar.jpg"}
                        alt="Student"
                        className="w-8 h-8 rounded-circle me-3"
                        style={{ height: "30px", width: "30px" }}
                      />
                      <span className="text-sm font-medium text-gray-800">{student?.Username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{(student?.ExmeeUserId).slice(0, 8)}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{student?.Email}</td>
                  <td className="py-3 px-4">
                    <div className="d-flex flex-wrap gap-1">
                      <span className="badge bg-primary text-white">{student?.isVerified}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="badge bg-success text-white">{student?.Status}</span>
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
                </tr>))}
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
