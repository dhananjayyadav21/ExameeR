"use client";
import React, { useContext, useEffect, useState } from "react";
import Modal from "../../../components/Modal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ContentContext from '../../../context/ContentContext'
import * as GlobalUrls from "../../../utils/GlobalURL"
import { toast } from "react-toastify";

export default function DashboardPYQPage() {
    const context = useContext(ContentContext);
    const { searchDashContent, dashPYQ, getPYQ, deletePYQ } = context;
    const router = useRouter();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState("sciTechnology");
    const [status, setStatus] = useState("public");
    const [isloading, setIsloading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const indexOfLastPYQ = currentPage * itemsPerPage;
    const indexOfFirstPYQ = indexOfLastPYQ - itemsPerPage;
    const currentPYQs = dashPYQ.slice(indexOfFirstPYQ, indexOfLastPYQ);
    const totalPages = Math.ceil(dashPYQ.length / itemsPerPage);

    useEffect(() => {
        getPYQ();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsloading(true);
        try {
            const res = await searchDashContent(`${GlobalUrls.SEARDASHCHCONTENT_URL}?search=${search}&category=${category}&status=${status}&type=pyq`);
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
    const [modalPYQ, setModalPYQ] = useState(null);

    const deleteConfirm = async (PYQ) => {
        const res = await deletePYQ(PYQ._id);
        setShowModal(false);
        if (res.success === true) {
            toast.success(res.message || "PYQ deleted successfully!");
            getPYQ();
        } else {
            toast.error(res.message || "Failed to delete PYQ!");
        }
    }

    const handleUpdate = (pyq) => {
        console.log("Update pyq:", pyq);
    }

    return (
        <div id="previousQuestions" className="p-0">
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={() => deleteConfirm(modalPYQ)}
                heading={`Do You Want To Delete "${modalPYQ?.title}" PYQ?`}
                subHeading="This action cannot be undone."
            />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h4 fw-bold text-dark mb-0">PYQ Management</h1>
                <Link href="/uploadPYQ" className="btn btn-warning d-flex align-items-center gap-2">
                    <i className="fa-solid fa-plus-circle"></i>
                    Upload PYQ
                </Link>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-bold small">Search PYQs</label>
                            <input
                                type="text"
                                placeholder="Year, subject, title..."
                                className="form-control bg-light"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
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
                            <button type="submit" className="btn btn-dark" disabled={isloading}>
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
                <div className="card border-0 shadow-sm overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr className="text-secondary small text-uppercase">
                                    <th className="px-4 py-3">Title</th>
                                    <th className="py-3">Year</th>
                                    <th className="py-3">Subject</th>
                                    <th className="py-3">Category</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3 text-end px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPYQs && currentPYQs.length > 0 ? (
                                    currentPYQs.map((data) => (
                                        <tr key={data._id}>
                                            <td className="px-4">
                                                <div className="d-flex align-items-center">
                                                    <i className="fa-solid fa-file-lines text-warning me-2 fs-5"></i>
                                                    <span className="fw-semibold text-dark">{data?.title}</span>
                                                </div>
                                            </td>
                                            <td className="text-muted small">{data?.year}</td>
                                            <td className="text-muted small">{data?.subject}</td>
                                            <td className="text-muted small">{data?.category}</td>
                                            <td>
                                                <span className={`badge bg-${getBadgeColor(data?.status)} rounded-pill px-2`}>
                                                    {data?.status}
                                                </span>
                                            </td>
                                            <td className="text-end px-4">
                                                <div className="btn-group">
                                                    <button className="btn btn-sm btn-outline-primary" onClick={() => handleUpdate(data)}><i className="fa-solid fa-edit"></i></button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => { setModalPYQ(data); setShowModal(true); }}><i className="fa-solid fa-trash"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">No PYQs found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {totalPages > 1 && (
                <nav className="mt-4">
                    <ul className="pagination pagination-sm justify-content-end">
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
            )}
        </div>
    );
}
