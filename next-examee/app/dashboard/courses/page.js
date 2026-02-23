"use client";
import React, { useContext, useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ContentContext from '../../../context/ContentContext'
import * as GlobalUrls from "../../../utils/GlobalURL"
import { toast } from "react-toastify";

export default function DashboardCoursesPage() {
    const context = useContext(ContentContext);
    const { searchDashContent, dasCourse, getCourse, deleteCourse } = context;
    const router = useRouter();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState("sciTechnology");
    const [status, setStatus] = useState("public");
    const [isloading, setIsloading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const indexOfLastCourse = currentPage * itemsPerPage;
    const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
    const currentCourses = dasCourse.slice(indexOfFirstCourse, indexOfLastCourse);
    const totalPages = Math.ceil(dasCourse.length / itemsPerPage);

    useEffect(() => {
        getCourse();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsloading(true);
        try {
            const res = await searchDashContent(`${GlobalUrls.SEARDASHCHCONTENT_URL}?search=${search}&category=${category}&status=${status}&type=course`);
            if (res.success === false) {
                toast.warning(res.message || "No matching content found");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsloading(false);
        }
    }

    const getBadgeColor = (status) => {
        if (status === "public") return "info";
        if (status === "draft") return "warning";
        if (status === "archived") return "danger";
        return "secondary";
    };

    const [showModal, setShowModal] = useState(false);
    const [modalCourse, setModalCourse] = useState(null);

    const deleteConfirm = async (Course) => {
        const res = await deleteCourse(Course._id);
        setShowModal(false);
        if (res.success === true) {
            toast.success(res.message || "Course deleted successfully!");
            getCourse();
        } else {
            toast.error(res.message || "Failed to delete course!");
        }
    }

    const handleUpdate = (course) => {
        // In Next.js we might use query params or state in context
        // For now, let's just log or implement a way to pass data
        console.log("Update course:", course);
        // router.push({ pathname: '/dashboard/courses/update', query: { id: course._id } });
    }

    return (
        <div id="courses" className="p-0">
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={() => deleteConfirm(modalCourse)}
                heading={`Do You Want To Delete "${modalCourse?.title}" Course?`}
                subHeading="This action cannot be undone."
            />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h4 fw-bold text-dark mb-0">Courses Management</h1>
                <Link href="/uploadCourse" className="btn btn-primary d-flex align-items-center gap-2">
                    <i className="fa-solid fa-plus-circle"></i>
                    Add New Course
                </Link>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold small">Search Courses</label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0"><i className="fa-solid fa-search text-muted"></i></span>
                                <input
                                    type="text"
                                    placeholder="Course title, mentor..."
                                    className="form-control bg-light border-start-0"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold small">Category</label>
                            <select className="form-select bg-light" value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="sciTechnology">Sci-Technology</option>
                                <option value="commerce">Commerce</option>
                                <option value="artscivils">Arts & Civils</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold small">Status</label>
                            <select className="form-select bg-light" value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="public">Active</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                        <div className="col-12 text-end mt-3">
                            <button type="submit" className="btn btn-dark px-4" disabled={isloading}>
                                {isloading ? 'Searching...' : 'Search'}
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
                <>
                    <div className="row g-4">
                        {currentCourses?.map((course) => (
                            <div className="col-12 col-md-6 col-lg-4" key={course._id}>
                                <div className="card h-100 border-0 shadow-sm rounded-3 overflow-hidden">
                                    <div className="position-relative" style={{ height: '180px' }}>
                                        <img
                                            src={course.courseImage ? `https://lh3.googleusercontent.com/d/${course.courseImage}` : "/assets/img/cource.jpg"}
                                            alt={course.title}
                                            className="w-100 h-100"
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <span className={`badge bg-${getBadgeColor(course.status)} position-absolute top-0 end-0 m-2`}>
                                            {course.status}
                                        </span>
                                    </div>
                                    <div className="card-body p-4">
                                        <h5 className="card-title fw-bold text-dark mb-2">{course.title}</h5>
                                        <p className="card-text text-muted small mb-3 text-truncate-2" style={{ height: '40px', overflow: 'hidden' }}>
                                            {course.description}
                                        </p>

                                        <div className="row g-2 mb-3">
                                            <div className="col-6">
                                                <small className="text-muted d-block"><i className="fa-solid fa-user-tie text-info me-1"></i> {course.mentor}</small>
                                            </div>
                                            <div className="col-6 text-end">
                                                <small className="text-muted d-block"><i className="fa-solid fa-signal text-primary me-1"></i> {course.courseLevel}</small>
                                            </div>
                                            <div className="col-6">
                                                <small className="text-muted d-block"><i className="fa-solid fa-clock text-warning me-1"></i> {course.duration}</small>
                                            </div>
                                            <div className="col-6 text-end">
                                                <small className="text-muted d-block"><i className="fa-solid fa-play-circle text-success me-1"></i> {course.lectures?.length} Lessons</small>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                                            <span className="fw-bold text-primary fs-5">₹{course.offerPrice}</span>
                                            <div className="btn-group">
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => handleUpdate(course)}><i className="fa-solid fa-edit"></i></button>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => { setModalCourse(course); setShowModal(true); }}><i className="fa-solid fa-trash"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-5">
                            <nav>
                                <ul className="pagination">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(prev => prev - 1)}>Previous</button>
                                    </li>
                                    {[...Array(totalPages)].map((_, i) => (
                                        <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>Next</button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
