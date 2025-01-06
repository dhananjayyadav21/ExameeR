import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faFile,faUpload, faVideo, faBook } from '@fortawesome/free-solid-svg-icons';

const Analytics = () => {
  return (
    <section id="analytics" className="min-vh-100 bg-dark text-white p-lg-4">
      <div className="container-lg py-4">
        {/* Stats Overview */}
        <div className="row mb-4">
          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <div className="bg-darkgray p-4 rounded border border hover:border-info transition duration-300">
              <h3 className="h5 text-muted">Total Notes</h3>
              <p className="h2 font-weight-bold mt-2">124</p>
              <div className="d-flex align-items-center mt-2 text-success">
                <FontAwesomeIcon icon={faArrowUp} className="w-4 h-4 mr-1" />
                <span className="small">+12% this month</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <div className="bg-darkgray p-4 rounded border border hover:border-info transition duration-300">
              <h3 className="h5 text-muted">Total Courses</h3>
              <p className="h2 font-weight-bold mt-2">36</p>
              <div className="d-flex align-items-center mt-2 text-success">
                <FontAwesomeIcon icon={faArrowUp} className="w-4 h-4 mr-1" />
                <span className="small">+8% this month</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <div className="bg-darkgray p-4 rounded border border hover:border-info transition duration-300">
              <h3 className="h5 text-muted">Video Lectures</h3>
              <p className="h2 font-weight-bold mt-2">89</p>
              <div className="d-flex align-items-center mt-2 text-success">
                <FontAwesomeIcon icon={faArrowUp} className="w-4 h-4 mr-1" />
                <span className="small">+15% this month</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <div className="bg-darkgray p-4 rounded border border hover:border-info transition duration-300">
              <h3 className="h5 text-muted">Previous Year Papers</h3>
              <p className="h2 font-weight-bold mt-2">245</p>
              <div className="d-flex align-items-center mt-2 text-success">
                <FontAwesomeIcon icon={faArrowUp} className="w-4 h-4 mr-1" />
                <span className="small">+20% this month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="bg-darkgray border rounded p-2 p-lg-4 mb-4">
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
                <tr className="border-bottom">
                  <td className="py-3">
                    <span className="badge bg-info text-light">
                      <FontAwesomeIcon icon={faFile} /> Note
                    </span>
                  </td>
                  <td className="py-3">C Programming Fundamentals</td>
                  <td className="py-3">2024-02-15</td>
                  <td className="py-3">
                    <span className="text-success">Published</span>
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td className="py-3">
                    <span className="badge bg-purple text-light">
                      <FontAwesomeIcon icon={faBook} /> Course
                    </span>
                  </td>
                  <td className="py-3">Data Structures Advanced</td>
                  <td className="py-3">2024-02-14</td>
                  <td className="py-3">
                    <span className="text-success">Published</span>
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td className="py-3">
                    <span className="badge bg-danger text-light">
                      <FontAwesomeIcon icon={faVideo} /> Video
                    </span>
                  </td>
                  <td className="py-3">Algorithm Analysis Lecture</td>
                  <td className="py-3">2024-02-13</td>
                  <td className="py-3">
                    <span className="text-warning">Processing</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3">
                    <span className="badge bg-success text-light">
                      <FontAwesomeIcon icon={faBook} /> PYQ
                    </span>
                  </td>
                  <td className="py-3">2023 Final Examination</td>
                  <td className="py-3">2024-02-12</td>
                  <td className="py-3">
                    <span className="text-success">Published</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Upload Actions */}
        <div className="row">
          <div className="col-12 col-md-6 col-lg-3 mb-4">
            <button className="d-flex align-items-center justify-content-center bg-darkgray p-4 rounded">
              <FontAwesomeIcon icon={faUpload} className="w-6 h-6 text-info" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Analytics;
