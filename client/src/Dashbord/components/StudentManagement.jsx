import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../utils/Modal";
import {
  faPlus,
  faEdit,
  faTrash,
  faLock,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import ContentContext from '../../context/ContentContext'
import * as GlobalUrls from "../../GlobalURL";
import { toast } from "react-toastify";

const StudentManagement = () => {
  const context = useContext(ContentContext);
  const { getStudentsByRole, studentsByRole, changeStudentStatus, deleteStudent } = context;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isloading, setIsloading] = useState(false);

  // Calculate current page students
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const currentStudents = studentsByRole.slice(indexOfFirstStudent, indexOfLastStudent);

  // Calculate total pages
  const totalPages = Math.ceil(studentsByRole.length / itemsPerPage);

  useEffect(() => {
    getStudentsByRole();
    // eslint-disable-next-line
  }, []);

  //-- handle search form sumbit ------
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

  //-- change student status ------
  const chnageStatus = async (student) => {
    const res = await changeStudentStatus(student._id);
    getStudentsByRole();
    toast.success(res.message || "Successfully change student status !", {
      position: "top-right"
    });
  }

  //-- delete students and its records ------
  const [showModal, setShowModal] = useState(false);
  const deleteStudentCoinfirm = async (student) => {
    const res = await deleteStudent(student._id);
    setShowModal(false);
    getStudentsByRole();
    toast.success(res.message || "Successfully delete student !", {
      position: "top-right"
    });
  }

  return (
    <div id="studentManagement" className="min-vh-100 p-3 py-4 px-md-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 font-weight-bold text-dark dashbord-heading-text">Student Management</h1>
        <Link to="/addStudent" className="text-decoration-none text-dark">
          <button className="btn btn-primary px-4 py-2 d-flex align-items-center dashbord-upload-btn-text">
            <FontAwesomeIcon icon={faPlus} className="me-2" /> Add Student
          </button>
        </Link>
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
              <option value="active">Active</option>
              <option value="inactive">In Active</option>
            </select>
          </div>
        </div>
      </form>

      {isloading && <h4 className="my-4">Loding.....</h4>}
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
              {currentStudents.map((student, i) => (
                <>
                  <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={() => deleteStudentCoinfirm(student)}
                    heading={`Do you want to remove ${student?.Username} user.`}
                    subHeading={`“Yes or No”`}
                  />
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
                        {student?.Status === "active" ?
                          <><button className="btn btn-outline-warning" title="Block" onClick={() => { chnageStatus(student) }}>
                            <FontAwesomeIcon icon={faLock} />
                          </button></> :
                          <><button className="btn btn-outline-info" title="Block" onClick={() => { chnageStatus(student) }}>
                            <FontAwesomeIcon icon={faUnlock} />
                          </button></>
                        }
                        <button className="btn btn-outline-danger" title="Delete" onClick={() => { setShowModal(true) }}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr> </>))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center p-3">
        <div className="text-muted">
          Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, studentsByRole.length)} of {studentsByRole.length} Students
        </div>

        <div>
          <button
            className="btn btn-outline-secondary me-2"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`btn me-2 ${currentPage === index + 1 ? 'btn-success' : 'btn-outline-secondary'}`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="btn btn-outline-secondary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
};

export default StudentManagement;
