import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../utils/Modal";
import {
  faPlusCircle,
  faEdit,
  // faDownload,
  faTrashAlt,
  faFileAlt
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import ContentContext from '../../context/ContentContext'
import * as GlobalUrls from "../../GlobalURL"
import { toast } from "react-toastify";


const StudyNotes = () => {
  const context = useContext(ContentContext);
  const { searchDashContent, dashNotes, getNote, deleteNotes } = context;

  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState("sciTechnology");
  const [status, setStatus] = useState("public");
  const [isloading, setIsloading] = useState(false);

  // Calculate current page Notes
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const indexOfLastNotes = currentPage * itemsPerPage;
  const indexOfFirstNotes = indexOfLastNotes - itemsPerPage;
  const currentNotes = dashNotes.slice(indexOfFirstNotes, indexOfLastNotes);

  // Calculate total pages
  const totalPages = Math.ceil(dashNotes.length / itemsPerPage);

  //--get data-----------
  useEffect(() => {
    getNote();
    // eslint-disable-next-line
  }, []);

  //-- handle form sumbit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    try {
      const res = await searchDashContent(`${GlobalUrls.SEARDASHCHCONTENT_URL}?search=${search}&category=${category}&status=${status}&type=notes`);
      if (res.success === false) {
        toast.warning(res.message || "No matching content found", {
          position: "top-right"
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsloading(false);
    }
  }

  //-- badge color on status
  let badgeColor = {};
  dashNotes.forEach(e => {
    if (`${e.status} === "public"`) {
      badgeColor = "info";
    } else if (`${e.status} === "draft"`) {
      badgeColor = "warning";
    } else if (`${e.status} === "archived"`) {
      badgeColor = "danger";
    }
  });

  //-- handle note delete
  const [showModal, setShowModal] = useState(false);
  const [modalNote, setModalNote] = useState("");
  const deleteCoinfirm = async (Note) => {
    const res = await deleteNotes(Note._id);
    setShowModal(false);
    getNote();
    toast.success(res.message || "Successfully delete student !", {
      position: "top-right"
    });
  }

  //---- handle Notes update
  const handleUpdate = (Notes) => {
    navigate("/updatesnotes", {
      state: Notes
    });
  }

  return (
    <>
      <div id="notes" className="min-vh-100 p-3 py-4 px-md-4">
        {/* Header with Add Notes Button */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h2 font-weight-bold text-dark dashbord-heading-text">Study Notes</h1>
          <Link to="/uploadNotes" className="text-decoration-none text-dark">
            <button className="btn btn-success d-flex align-items-center dashbord-upload-btn-text">
              <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
              Upload Notes
            </button>
          </Link>
        </div>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={() => deleteCoinfirm(modalNote)}
          heading={`Do You Want To Delete "${modalNote?.title}" Notes.`}
          subHeading={`“Yes or No”`}
        />

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
                placeholder="Search Notes..."
                className="form-control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="sciTechnology">Sci-Technology</option>
                <option value="commerce">Commerce</option>
                <option value="artscivils">Arts & Civils</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="public">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </form>


        {/* Notes List */}
        {isloading && <h4 className="my-4">Loding.....</h4>}
        {!isloading && (
          <div className="bg-white rounded border border-light overflow-hidden">
            <div className="table-responsive">
              <table className="table">
                <thead className="bg-light">
                  <tr>
                    <th className="text-left">Title</th>
                    <th className="text-left">Category</th>
                    <th className="text-left">Profesor</th>
                    <th className="text-left">Upload Date</th>
                    <th className="text-left">Status</th>
                    <th className="text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Note Item 1 */}
                  {currentNotes.map((data, i) => (
                    <tr className="table-hover">
                      <td>
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon
                            icon={faFileAlt}
                            className="text-secondary me-2"
                            size="lg"
                          />
                          <span className="text-sm text-dark">{data?.title}</span>
                        </div>
                      </td>
                      <td className="text-secondary">{data?.category}</td>
                      <td className="text-secondary">{data?.professor}</td>
                      <td className="text-secondary">{(data?.createdAt).slice(0, 10)}</td>
                      <td className={`badge bg-${badgeColor} mt-2 `}>{data?.status}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-outline-primary" title="Edit">
                            <FontAwesomeIcon icon={faEdit} onClick={() => { handleUpdate(data) }} />
                          </button>
                          {/* <button className="btn btn-link text-success" title="Download">
                            <FontAwesomeIcon icon={faDownload} />
                          </button> */}
                          <button className="btn btn-outline-danger" title="Delete" onClick={()=>{setShowModal(true);setModalNote(data);}}>
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </div>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>)}

        {/* Pagination Controls */}
        <div className="d-flex justify-content-between align-items-center p-3">
          <div className="text-muted">
            Showing {indexOfFirstNotes + 1} to {Math.min(indexOfLastNotes, dashNotes.length)} of {dashNotes.length} Students
          </div>

          <div>
            {/* Previous Button */}
            <button
              className="btn btn-sm btn-outline-dark me-2"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter(page =>
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              )
              .map((page, idx, arr) => (
                <React.Fragment key={page}>
                  {/* Add dots if needed */}
                  {idx > 0 && page - arr[idx - 1] > 1 && (
                    <button className="btn btn-sm btn-outline-dark me-2" disabled>...</button>
                  )}

                  <button
                    className={`btn btn-sm me-2 ${currentPage === page ? 'btn-success' : 'btn-outline-dark'}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}

            {/* Next Button */}
            <button
              className="btn btn-sm btn-outline-dark"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              Next
            </button>
          </div>
        </div>


      </div>
    </>
  );
};

export default StudyNotes;
