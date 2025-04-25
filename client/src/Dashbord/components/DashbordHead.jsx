import React, { useContext, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faFileAlt,
  faPlayCircle,
  faQuestionCircle,
  faUpload,
  faStickyNote,
  faVideo,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import ContentContext from '../../context/ContentContext'
import * as GlobalUrls from "../../GlobalURL"
import hasUserRole from "../../utils/hasUserRole";

const DashbordHead = () => {
  const [searchParams] = useSearchParams();
  const context = useContext(ContentContext);
  const { MyNotes, MyPYQS, MyVideo, LatestData, getNote, getPYQ, getVideo, getLatestUpload } = context;

  const category = searchParams.get('category') || 'sciTechnology';
  useEffect(() => {
    if (localStorage.getItem('token')) {
      getNote(`${GlobalUrls.GETNOTE_URL}?category=${category}`);
      getPYQ(`${GlobalUrls.GETPYQ_URL}?category=${category}`);
      getVideo(`${GlobalUrls.GETVideo_URL}?category=${category}`);
      if (hasUserRole("Admin", "Instructor")) {
        getLatestUpload(`${GlobalUrls.GETLATESTDATA_URL}?category=${category}`);
      }
    }
    // eslint-disable-next-line
  }, [category]);

  let badgeColor = {};
  LatestData.forEach(e => {
    if (`${e.status} === "public"`) {
      badgeColor = "info";
    } else if (`${e.status} === "draft"`) {
      badgeColor = "warning";
    } else if (`${e.status} === "archived"`) {
      badgeColor = "danger";
    }
  });

  return (
    <div>
      <div id="dashboard" className="min-vh-100 p-3 py-4 px-md-4 bg-light">
        {/* Header */}
        <div className="mb-4">
          <h1 className="h3 fw-bold text-dark">Dashboard</h1>
          <p className="text-secondary">Welcome back, Instructor!</p>
        </div>

        {/* Stats Grid */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-4">
          <div className="col">
            <div className="card border shadow-sm h-100 rounded-3">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="small text-secondary">Total Notes</p>
                  <h3 className="fw-bold text-dark">{MyNotes.length}</h3>
                </div>
                <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center p-3">
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    className="text-success fs-4"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card h-100 border rounded-3">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="small text-secondary">Total Courses</p>
                  <h3 className="fw-bold text-dark">0</h3>
                </div>
                <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center p-3">
                  <FontAwesomeIcon icon={faBook} className="text-primary fs-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card border shadow-sm h-100 rounded-3">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="small text-secondary">Video Lectures</p>
                  <h3 className="fw-bold text-dark">{MyVideo.length}</h3>
                </div>
                <div className="rounded-circle bg-purple bg-opacity-10 d-flex align-items-center justify-content-center p-3">
                  <FontAwesomeIcon
                    icon={faPlayCircle}
                    className="text-purple fs-4"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col">
            <div className="card border shadow-sm h-100 rounded-3">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <p className="small text-secondary">Previous Questions</p>
                  <h3 className="fw-bold text-dark">{MyPYQS.length}</h3>
                </div>
                <div className="rounded-circle bg-warning bg-opacity-10 d-flex align-items-center justify-content-center p-3">
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    className="text-warning fs-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="card border shadow-sm mb-4 rounded-3">
          <div className="card-body">
            <h2 className="h5 fw-bold text-dark mb-4">Recent Uploads</h2>
            <div className="table-responsive">
              <table className="table table-borderless align-middle">
                <thead>
                  <tr className="border-bottom">
                    <th className="text-secondary">Type</th>
                    <th className="text-secondary">Title</th>
                    <th className="text-secondary">Date</th>
                    <th className="text-secondary">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {LatestData.map((e, i) => (
                    <tr className="border-bottom">
                      <td>{e?.type}</td>
                      <td>{e?.title}</td>
                      <td>{(e?.createdAt).slice(0, 10)}</td>
                      <td>
                        <span className={`badge bg-${badgeColor} text-white`}>
                          {e.status}
                        </span>
                      </td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row g-2">
          <div className="col-md-6 col-lg-3">
            <Link to="/uploadNotes" className="text-decoration-none text-dark">
              <div className="bg-white d-flex align-items-center justify-content-center gap-2 p-3 border shadow-sm rounded-3 cursor-pointer">
                <FontAwesomeIcon icon={faStickyNote} className="text-primary" />
                <span className="text-dark">Add Notes</span>
              </div>
            </Link>
          </div>
          <div className="col-md-6 col-lg-3">
            <Link to="/uploadPYQ" className="text-decoration-none">
              <div className="bg-white d-flex align-items-center justify-content-center gap-2 p-3 border shadow-sm rounded-3 cursor-pointer">
                <FontAwesomeIcon icon={faCircleQuestion} className="text-success" />
                <span className="text-dark">Add Questions</span>
              </div>
            </Link>
          </div>
          <div className="col-md-6 col-lg-3">
            <Link to="/uploadVideo" className="text-decoration-none">
              <div className="bg-white d-flex align-items-center justify-content-center gap-2 p-3 border shadow-sm rounded-3 cursor-pointer">
                <FontAwesomeIcon icon={faVideo} className="text-purple" />
                <span className="text-dark">Upload Video</span>
              </div>
            </Link>
          </div>
          <div className="col-md-6 col-lg-3">
            <Link to="/uploadCourse" className="text-decoration-none">
              <div className="bg-white d-flex align-items-center justify-content-center gap-2 p-3 border shadow-sm rounded-3 cursor-pointer">
                <FontAwesomeIcon icon={faUpload} className="text-warning" />
                <span className="text-dark">
                  Upload Course
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashbordHead;
