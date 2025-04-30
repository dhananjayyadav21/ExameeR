import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../utils/Modal";
import {
  faEdit,
  faTrashAlt,
  faPlayCircle,
  faSignal,
  faClock,
  faTag,
  faUserTie
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import ContentContext from '../../context/ContentContext'
import * as GlobalUrls from "../../GlobalURL"
import { toast } from "react-toastify";

const Courses = () => {
  const context = useContext(ContentContext);
  const { searchDashContent, dasCourse, getCourse, deleteCourse } = context;

  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState("sciTechnology");
  const [status, setStatus] = useState("public");
  const [isloading, setIsloading] = useState(false);


  // Calculate current page Notes
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const indexOfLastCourse = currentPage * itemsPerPage;
  const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
  const currentNotes = dasCourse.slice(indexOfFirstCourse, indexOfLastCourse);

  // Calculate total pages
  const totalPages = Math.ceil(dasCourse.length / itemsPerPage);

  //--get data-----------
  useEffect(() => {
    getCourse();
    // eslint-disable-next-line
  }, []);


  //-- handle form sumbit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    try {
      const res = await searchDashContent(`${GlobalUrls.SEARDASHCHCONTENT_URL}?search=${search}&category=${category}&status=${status}&type=course`);
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
  dasCourse.forEach(e => {
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
  const [modalCourse, setModalCourse] = useState("");

  const deleteCoinfirm = async (Course) => {
    const res = await deleteCourse(Course._id);
    setShowModal(false);
    getCourse();
    if (res.success === true) {
      toast.success(res.message || "Successfully delete Course !", {
        position: "top-right"
      });
    } if (res.success === false) {
      toast.error(res.message || "Faild to  delete Course !", {
        position: "top-right"
      });
    }
  }

  //---- handle course update
  const handleUpdate = (Course) => {
    navigate("/updatecourse", {
      state: Course
    });
  }

  return (
    <div id="courses" className="min-vh-100 p-3 py-4 px-md-4">
      {/* Header with Add Course Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h4 fw-bold text-dark dashbord-heading-text">Courses</h1>
        <Link to="/uploadCourse" className="text-decoration-none text-dark">
          <button className="btn btn-primary d-flex align-items-center gap-2 dashbord-upload-btn-text">
            <svg className="bi bi-plus-circle" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8a.5.5 0 0 1-.5.5H8.5v7.5a.5.5 0 0 1-1 0V8.5H.5a.5.5 0 0 1 0-1h7V.5a.5.5 0 0 1 1 0v7h7a.5.5 0 0 1 .5.5z"
              />
            </svg>
            Add New Course
          </button>
        </Link>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => deleteCoinfirm(modalCourse)}
        heading={`Do You Want To Delete "${modalCourse?.title}" Course.`}
        subHeading={`“Yes or No”`}
      />

      {/* Filters and Search */}
      <form onSubmit={handleSubmit}
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

      {/* Courses Grid */}
      {isloading && <h4 className="my-4">Loding.....</h4>}
      {!isloading && (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {/* Course Card 1 */}
          {currentNotes?.map((course, i) => (
            <div className="col">
              <div className="card h-100 border shadow-sm">
                <div style={{ minHeight: '180px' }}>
                  <img
                    src={`https://lh3.googleusercontent.com/d/${course.courseImage}` || "/assets/img/cource.jpg"}
                    alt=""
                    width="100%"
                    height="180px"
                    className="card-img-top"
                  />
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title">{course?.title}</h5>
                    <span className={`badge bg-${badgeColor}`}>{course?.status}</span>
                  </div>
                  <p className="card-text text-muted">
                    {course?.description}...
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted mx-2">
                        <FontAwesomeIcon icon={faUserTie} className="text-info me-1" />
                        {course?.mentor}
                      </small>
                      <small className="text-muted mx-2">
                        <FontAwesomeIcon icon={faSignal} className="text-primary me-1 " />
                        {course?.courseLevel}
                      </small>
                      <br />
                      <small className="text-muted mx-2">
                        <FontAwesomeIcon icon={faClock} className="text-warning me-1" />
                        {course?.duration}
                      </small>
                      <small className="text-muted">
                        <FontAwesomeIcon icon={faPlayCircle} className="text-success me-1" />
                        {course?.lectures?.length} Lessons
                      </small>
                      <small className="text-muted mx-2">
                        <FontAwesomeIcon icon={faTag} className="text-danger me-1" />
                        ₹{course?.offerPrice}
                      </small>
                    </div>

                    <div className="d-flex gap-2">
                      <span className="p-2 btn btn-sm btn-outline-primary" title="Edit" onClick={() => { handleUpdate(course) }}>
                        <FontAwesomeIcon icon={faEdit} />
                      </span>
                      <span className="p-2 btn btn-sm btn-outline-danger" title="Delete" onClick={() => { setShowModal(true); setModalCourse(course); }}>
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>))}
        </div>)}

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center p-3">
        <div className="text-muted">
          Showing {indexOfFirstCourse + 1} to {Math.min(indexOfLastCourse, dasCourse.length)} of {dasCourse.length} Students
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
                  className={`btn btn-sm me-2 ${currentPage === page ? 'btn-primary' : 'btn-outline-dark'}`}
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
  );
};

export default Courses;
