import React, { useContext, useEffect, useState } from "react";
import { FaPlusCircle, FaEdit, FaDownload, FaTrash, FaFileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import ContentContext from '../../context/ContentContext'
import * as GlobalUrls from "../../GlobalURL"
import { toast } from "react-toastify";

const PreviousQuestions = () => {
  const context = useContext(ContentContext);
  const { searchDashContent, dashPYQ, getPYQ } = context;

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState("sciTechnology");
  const [status, setStatus] = useState("public");
  const [isloading, setIsloading] = useState(false);


  //--get data-----------
  useEffect(() => {
    getPYQ();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    try {
      const res = await searchDashContent(`${GlobalUrls.SEARDASHCHCONTENT_URL}?search=${search}&category=${category}&status=${status}&type=pyq`);
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

  let badgeColor = {};
  dashPYQ.forEach(e => {
    if (`${e.status} === "public"`) {
      badgeColor = "info";
    } else if (`${e.status} === "draft"`) {
      badgeColor = "warning";
    } else if (`${e.status} === "archived"`) {
      badgeColor = "danger";
    }
  });

  return (
    <div id="previousQuestions" className="min-vh-100 p-3 py-4 px-md-4">
      {/* Header with Add Question Paper Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 font-weight-bold text-dark dashbord-heading-text">Previous Year Questions</h1>
        <Link to="/uploadPYQ" className="text-decoration-none text-dark">
          <button className="btn btn-warning d-flex align-items-center dashbord-upload-btn-text">
            <FaPlusCircle className="me-2" />
            Upload Question Paper
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

      {/* Question Papers List */}
      {isloading && <h4 className="my-4">Loding.....</h4>}
      {!isloading && (
        <div className="bg-white rounded border border-light overflow-hidden">
          <div className="table-responsive">
            <table className="table">
              <thead className="thead-light">
                <tr>
                  <th className="text-left">Title</th>
                  <th className="text-left">Year</th>
                  <th className="text-left">Subject</th>
                  <th className="text-left">Category</th>
                  <th className="text-left">Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Question Paper Item 1 */}
                {dashPYQ.map((data, i) => (
                  < tr className="table-row">
                    <td>
                      <div className="d-flex align-items-center">
                        <FaFileAlt className="me-2 text-secondary" />
                        <span className="font-weight-medium">{data?.title}</span>
                      </div>
                    </td>
                    <td>{data?.year}</td>
                    <td>{data?.subject}</td>
                    <td>{data?.category}</td>
                    <td className={`badge bg-${badgeColor} mt-2 `}>{data?.status}</td>
                    <td>
                      <div className="d-flex justify-content-start gap-2">
                        <button className="btn btn-link text-primary" title="Edit">
                          <FaEdit />
                        </button>
                        <button className="btn btn-link text-success" title="Download">
                          <FaDownload />
                        </button>
                        <button className="btn btn-link text-danger" title="Delete">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>)}

      {/* Pagination */}
      <div className="row g-2 d-flex justify-content-center mt-4">
        <div className="col-md-6">
          <div className="text-muted">Showing 1 to 2 of 15 Cources</div>
        </div>
        <div className="col-md-6">
          <nav>
            <button className="btn btn-outline-secondary me-2">Previous</button>
            <button className="btn btn-info me-2">1</button>
            <button className="btn btn-outline-secondary me-2">2</button>
            <button className="btn btn-outline-secondary me-2">3</button>
            <button className="btn btn-outline-secondary">Next</button>
          </nav>
        </div>
      </div>
    </div >
  );
};

export default PreviousQuestions;
