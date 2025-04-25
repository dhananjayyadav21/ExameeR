import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import ContentContext from '../../context/ContentContext'
import { toast } from "react-toastify";

const Analytics = () => {
  const context = useContext(ContentContext);
  const { getdashAnalytics, dashAnalytics,  getLatestUpload, LatestData } = context;

  useEffect(() => {
    getdashAnalytics();
    getLatestUpload();
    // eslint-disable-next-line
  }, []);

  if (dashAnalytics.success === false) {
    toast.warning(dashAnalytics.message || "Some error please try again", {
      position: "top-right"
    });
  }

  return (
    <section id="analytics" className="min-vh-100 bg-darkgray text-white p-2 p-lg-4">
      <div className="container-lg py-4">
        {/* Stats Overview */}
        <div className="row mb-4">
          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <div className="bg-dark p-4 rounded border border hover:border-info transition duration-300">
              <h3 className="h5 text-muted">Total Notes</h3>
              <p className="h2 font-weight-bold mt-2">{dashAnalytics?.data?.notes?.total}</p>
              <div className="d-flex align-items-center mt-2 text-success">
                <FontAwesomeIcon icon={faArrowUp} className="w-4 h-4 mr-1" />
                <span className="small">+{dashAnalytics?.data?.notes?.growth}% this month</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <div className="bg-dark p-4 rounded border border hover:border-info transition duration-300">
              <h3 className="h5 text-muted">Total Courses</h3>
              <p className="h2 font-weight-bold mt-2">0</p>
              <div className="d-flex align-items-center mt-2 text-success">
                <FontAwesomeIcon icon={faArrowUp} className="w-4 h-4 mr-1" />
                <span className="small">+0% this month</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <div className="bg-dark p-4 rounded border border hover:border-info transition duration-300">
              <h3 className="h5 text-muted">Video Lectures</h3>
              <p className="h2 font-weight-bold mt-2">{dashAnalytics?.data?.videos?.total}</p>
              <div className="d-flex align-items-center mt-2 text-success">
                <FontAwesomeIcon icon={faArrowUp} className="w-4 h-4 mr-1" />
                <span className="small">{dashAnalytics?.data?.videos?.growth}% this month</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <div className="bg-dark p-4 rounded border border hover:border-info transition duration-300">
              <h3 className="h5 text-muted">Previous Year Papers</h3>
              <p className="h2 font-weight-bold mt-2">{dashAnalytics?.data?.pyqs?.total}</p>
              <div className="d-flex align-items-center mt-2 text-success">
                <FontAwesomeIcon icon={faArrowUp} className="w-4 h-4 mr-1" />
                <span className="small">{dashAnalytics?.data?.pyqs?.growth}% this month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="bg-dark border rounded p-2 p-lg-4 mb-4">
          <h2 className="h6 font-weight-bold mt-2 mb-4">Recent Uploads</h2>
          <div className="table-responsive">
            <table className="table w-100">
              <thead>
                <tr className="text-left text-muted">
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {LatestData.map((data,i) => (
                <tr className="border-bottom">
                  <td className="py-3">
                    <span className="badge bg-info text-light">
                        {data?.type}
                    </span>
                  </td>
                  <td className="py-3">{data?.title}</td>
                  <td className="py-3">{(data?.createdAt).slice(0,10)}</td>
                  <td className="py-3">
                    <span className="text-success">{data?.status}</span>
                  </td>
                </tr>))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Upload Actions */}
        <div className="row">
          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <Link to="/dashboard" className="text-decoration-none">
            <button className="d-flex align-items-center justify-content-center bg-dark p-4 rounded">
              <FontAwesomeIcon icon={faUpload} className="w-6 h-6 text-info" />
            </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Analytics;
