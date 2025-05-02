import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrashAlt
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import ContentContext from '../../context/ContentContext'
import * as GlobalUrls from "../../GlobalURL"
import { toast } from "react-toastify";
import Modal from "../../utils/Modal";


const VideoLectures = () => {
  const context = useContext(ContentContext);
  const { searchDashContent, dasVideo, getVideo, deleteVideo } = context;

  const navigate = useNavigate();

  //-- define states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState("sciTechnology");
  const [status, setStatus] = useState("public");
  const [isloading, setIsloading] = useState(false);

  // Calculate current page Video
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const indexOfLastVideo = currentPage * itemsPerPage;
  const indexOfFirstVideo = indexOfLastVideo - itemsPerPage;
  const currentVideo = dasVideo.slice(indexOfFirstVideo, indexOfLastVideo);

  // Calculate total pages
  const totalPages = Math.ceil(dasVideo.length / itemsPerPage);

  //--get data-----------
  useEffect(() => {
    getVideo();
    // eslint-disable-next-line
  }, []);

  //-- handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    try {
      const res = await searchDashContent(`${GlobalUrls.SEARDASHCHCONTENT_URL}?search=${search}&category=${category}&status=${status}&type=video`);
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


  //-- handle badge color based on status
  let btnColor = {};
  dasVideo.forEach(e => {
    if (`${e.status} === "public"`) {
      btnColor = "info";
    } else if (`${e.status} === "draft"`) {
      btnColor = "warning";
    } else if (`${e.status} === "archived"`) {
      btnColor = "danger";
    }
  });


  //-- handle note delete
  const [showModal, setShowModal] = useState(false);
  const [modalVideo, setModalVideo] = useState("");

  const deleteCoinfirm = async (Video) => {
    const res = await deleteVideo(Video._id);
    setShowModal(false);
    getVideo();
    if(res.success === true){
      toast.success(res.message || "Successfully delete Video !", {
        position: "top-right"
      });
    }if(res.success === false){
      toast.error(res.message || "Faild to  delete Video !", {
        position: "top-right"
      });
    }
  }


  //---- handle pyq update
  const handleUpdate = (Video) => {
    navigate("/updatesvideo", {
      state: Video
    });
  }
  return (
    <div id="videoLectures" className="min-vh-100 p-2 py-4 px-md-4">
      {/* Header with Add Video Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 font-weight-bold text-dark dashbord-heading-text">Video Lectures</h1>
        <Link to="/uploadVideo" className="text-decoration-none text-dark">
          <button className="btn btn-info px-4 py-2 d-flex align-items-center dashbord-upload-btn-text">
            <FontAwesomeIcon icon={faPlus} className="me-2" /> Upload Video Lecture
          </button>
        </Link>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => deleteCoinfirm(modalVideo)}
        heading={`Do You Want To Delete "${modalVideo?.title}" Video.`}
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

      {/* Video Grid */}
      {isloading && (<h4 className="my-4"> Loding..... </h4>)}
      {!isloading && dasVideo.length > 0 && (
        <div className="row g-3">
          {/* Video Card 1 */}
          {currentVideo.map((data, i) => (
            <div className="col-12 col-md-6 col-lg-4">
              <div className="bg-white rounded-3 shadow-sm border border-light overflow-hidden" style={{ minHeight: '410px' }}>
                <div className="position-relative">
                  <iframe
                    width="100%"
                    height="200"
                    src={`https://www.youtube.com/embed/${data?.fileUrl}`}
                    title="YouTube video player"
                    FrameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                  {/* <img
                    src="https://newexamee.netlify.app/assets/img/cource.jpg"
                    alt="Video Thumbnail"
                    className="img-fluid"
                    style={{ height: "200px", objectFit: "cover" }}
                  /> */}
                  {/* <div
                    className="position-absolute top-0 start-0 w-100 h-100 bg-black d-flex align-items-center justify-content-center"
                    style={{ opacity: 0.4 }}
                  >
                    <FontAwesomeIcon icon={faPlayCircle} className="text-white" size="3x" />
                  </div> */}
                </div>
                <div className="p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h3 className="h5 text-dark">{(data?.title).slice(0, 50)}</h3>
                    <div className={`px-2 py-1 text-xs font-weight-bold text-white bg-${btnColor} rounded-2`}>{data?.status}</div>
                  </div>
                  <p className="text-muted mb-4">
                    {(data?.description).slice(0, 90)}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Uploaded: {(data?.updatedAt).slice(0, 10)}</span>
                    <div className="d-flex gap-2">
                      <span className="p-2 text-primary" title="Edit" onClick={() => { handleUpdate(data) }}>
                        <FontAwesomeIcon icon={faEdit} />
                      </span>
                      <span className="p-2 text-danger" title="Delete" onClick={()=>{setModalVideo(data); setShowModal(true)}}>
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
          Showing {indexOfFirstVideo + 1} to {Math.min(indexOfLastVideo, dasVideo.length)} of {dasVideo.length} Students
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
                  className={`btn btn-sm me-2 ${currentPage === page ? 'btn-info' : 'btn-outline-dark'}`}
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

export default VideoLectures;
