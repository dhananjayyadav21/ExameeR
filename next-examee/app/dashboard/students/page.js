"use client";
import React, { useContext, useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ContentContext from '../../../context/ContentContext'
import * as GlobalUrls from "../../../utils/GlobalURL";
import { toast } from "react-toastify";

export default function StudentManagementPage() {
    const context = useContext(ContentContext);
    const { getStudentsByRole, studentsByRole, changeStudentStatus, deleteStudent } = context;
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [isloading, setIsloading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastStudent = currentPage * itemsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
    const currentStudents = studentsByRole.slice(indexOfFirstStudent, indexOfLastStudent);
    const totalPages = Math.ceil(studentsByRole.length / itemsPerPage);

    useEffect(() => {
        getStudentsByRole();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsloading(true);
        try {
            const res = await getStudentsByRole(`${GlobalUrls.GETSTUDENTSBYROLE_URL}?search=${search}&status=${status}`);
            if (res.success === false) {
                toast.warning(res.message || "No matching students found");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsloading(false);
        }
    }

    const chnageStatus = async (student) => {
        const res = await changeStudentStatus(student._id);
        getStudentsByRole();
        toast.success(res.message || "Successfully updated student status!");
    }

    const [showModal, setShowModal] = useState(false);
    const [modalStudent, setModalStudent] = useState(null);

    const deleteStudentConfirm = async (student) => {
        setShowModal(false);
        const res = await deleteStudent(student._id);
        getStudentsByRole();
        toast.success(res.message || "Student deleted successfully!");
    }

    const handleUpdate = (student) => {
        console.log("Update student:", student);
    }

    return (
        <div id="studentManagement" className="p-0">
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={() => deleteStudentConfirm(modalStudent)}
                heading={`Do You Want To Delete "${modalStudent?.Username}" Student?`}
                subHeading="This will remove all associated records."
            />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h4 fw-bold text-dark mb-0">Student Management</h1>
                <Link href="/addStudent" className="btn btn-primary d-flex align-items-center gap-2">
                    <i className="fa-solid fa-plus-circle"></i>
                    Add Student
                </Link>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-9">
                            <label className="form-label fw-bold small">Search Students</label>
                            <input
                                type="text"
                                placeholder="Search by name, email or ID..."
                                className="form-control bg-light"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold small">Status</label>
                            <select className="form-select bg-light" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                        <div className="col-12 text-end mt-3">
                            <button type="submit" className="btn btn-dark px-4" disabled={isloading}>
                                {isloading ? 'Filtering...' : 'Filter Students'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {isloading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <div className="card border-0 shadow-sm overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr className="text-secondary small text-uppercase">
                                    <th className="px-4 py-3">Student</th>
                                    <th className="py-3">ID</th>
                                    <th className="py-3">Email</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3 text-end px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentStudents && currentStudents.length > 0 ? (
                                    currentStudents.map((student) => (
                                        <tr key={student._id}>
                                            <td className="px-4">
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={student?.Profile || "/assets/img/Avtar.jpg"}
                                                        alt={student?.Username}
                                                        className="rounded-circle me-3 border"
                                                        style={{ height: "36px", width: "36px", objectFit: 'cover' }}
                                                    />
                                                    <div>
                                                        <div className="fw-bold text-dark">{student?.Username}</div>
                                                        <div className="small text-muted">{student?.isVerified ? 'Verified' : 'Unverified'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-muted small">{(student?.ExmeeUserId || "").slice(0, 8)}</td>
                                            <td className="text-muted small">{student?.Email}</td>
                                            <td>
                                                <span className={`badge rounded-pill px-2 ${student?.Status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                                                    {student?.Status}
                                                </span>
                                            </td>
                                            <td className="text-end px-4">
                                                <div className="btn-group">
                                                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleUpdate(student)}><i className="fa-solid fa-edit"></i></button>
                                                    <button className={`btn btn-sm ${student?.Status === 'active' ? 'btn-outline-warning' : 'btn-outline-info'}`}
                                                        onClick={() => chnageStatus(student)}
                                                        title={student?.Status === 'active' ? 'Block Student' : 'Unblock Student'}>
                                                        <i className={`fa-solid ${student?.Status === 'active' ? 'fa-lock' : 'fa-unlock'}`}></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => { setModalStudent(student); setShowModal(true); }}><i className="fa-solid fa-trash"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">No students found matching your criteria.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4 px-2">
                    <div className="small text-muted">
                        Page {currentPage} of {totalPages}
                    </div>
                    <nav>
                        <ul className="pagination pagination-sm mb-0">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>Previous</button>
                            </li>
                            {[...Array(totalPages)].map((_, i) => (
                                <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>Next</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
}
