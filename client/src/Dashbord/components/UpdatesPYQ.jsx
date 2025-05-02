import React, { useContext, useState } from 'react';
import ContentContext from '../../context/ContentContext';
import DriveUpload from '../../services/DriveUpload';
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";

const UpdatePYQ = () => {
    const context = useContext(ContentContext);
    const { updatePYQ } = context;

    const navigate = useNavigate();
    const location = useLocation();
    const { title, year, subject, category, tags, isPublic, status, fileUrl, _id } = location.state || {};

    //--form data for api
    const [formData, setFormData] = useState({
        title: title,
        year: year,
        subject: subject,
        category: category,
        tags: tags,
        isPublic: isPublic,
        status: status,
    });

    //--define states
    const [fileurl, setFileUrl] = useState(fileUrl);
    const [uploading, setUploading] = useState(false);

    //--handle onChanges
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    //--handle File Changes
    const handleFileChange = async (e) => {
        setUploading(true);
        const selectedFile = e.target.files[0];

        if (selectedFile) { //if selected file available
            try {
                const result = await DriveUpload(selectedFile);
                if (result && result.success && result.fileId) {
                    setFileUrl(result.fileId);
                } else {
                    toast.warning("Some thing went wrong please Re upload", {
                        position: "top-right"
                    });
                }
            } catch (ex) { //if error acured in file uploading on drive
                toast.error(ex.message, {
                    position: "top-right"
                });
            }
        }
        setUploading(false);
    };

    //-- Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        // check file and file type
        if (!fileurl) {
            setUploading(false);
            return toast.warning("Pleaseupdatea PDF or valid PDF file", {
                position: "top-right"
            });
        } else {
            const data = {  // set PYQ data
                title: formData.title,
                year: formData.year,
                subject: formData.subject,
                category: formData.category,
                tags: typeof formData.tags === 'string'
                    ? formData.tags.split(',').map(tag => tag.trim())
                    : formData.tags,
                isPublic: formData.isPublic,
                status: formData.status,
                fileUrl: fileurl
            };

            try { // try bloack to call api
                const { title, year, subject, category, status } = data;

                if (!title || !year || !subject || !category || !status) {
                    // Check All data from body
                    if (!title || !year || !subject) {
                        setUploading(false);
                        toast.warning("PYQ title & year,subject must be important !", {
                            position: "top-right"
                        });
                    }

                    // Check All data from body
                    if (!category || !status) {
                        setUploading(false);
                        toast.warning("PYQ Category & Status reuired !", {
                            position: "top-right"
                        });
                    }
                } else {
                    const response = await updatePYQ(data,_id);
                    if (response.success === true) {
                        setFormData({
                            title: '',
                            year: '',
                            subject: '',
                            category: 'sciTechnology',
                            tags: '',
                            isPublic: true,
                            status: 'public',
                        });
                        navigate(-1);
                        toast.success("PYQ updated successfully!", {
                            position: "top-right"
                        });
                    } else if (response.success === false) {
                        setUploading(false);
                        toast.error(response.message || "Failed to update pyq.!", {
                            position: "top-right"
                        });
                    }
                }
                // if accured error in calling api
            } catch (error) {
                setUploading(false);
                return toast.error("Failed to update pyq. Try again", {
                    position: "top-right"
                });
            }
        }
        setUploading(false);
    };

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    {/* Form Column */}
                    <div className="col-12 col-md-10">
                        <div className="container-fluid mt-4 shadow-sm">
                            <div className="text-start">
                                <h5 className="card-title mb-0 py-2">
                                   Update Your<span className="text-warning"> Previous Year Question</span>
                                </h5>
                            </div>
                        </div>

                        <div className="container-fluid my-3 px-0">
                            <div className="card shadow">
                                <div className="card-body">

                                    <form onSubmit={handleSubmit}>
                                        {/* Title */}
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Title<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>

                                        {/* Year */}
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Year<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="year"
                                                value={formData.year}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>

                                        {/* Subject */}
                                        <div className="mb-3">
                                            <label className="form-label">
                                                Subject<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="form-control"
                                            />
                                        </div>

                                        {/* Category */}
                                        <div className="mb-3">
                                            <label className="form-label">Category (Stream)</label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="form-select"
                                            >
                                                <option value="sciTechnology">Sci - Technology</option>
                                                <option value="commerce">Commerce</option>
                                                <option value="artscivils">Arts & civils</option>
                                            </select>
                                        </div>

                                        {/* Tags */}
                                        <div className="mb-3">
                                            <label className="form-label">Tags</label>
                                            <input
                                                type="text"
                                                name="tags"
                                                value={formData.tags}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Comma-separated tags (e.g., algorithms, os)"
                                            />
                                        </div>

                                        {/* Status */}
                                        <div className="mb-3">
                                            <label className="form-label">Status</label>
                                            <select
                                                name="status"
                                                value={formData.status}
                                                onChange={handleChange}
                                                className="form-select"
                                            >
                                                <option value="public">Public</option>
                                                <option value="draft">Draft</option>
                                                <option value="archived">Archived</option>
                                            </select>
                                        </div>

                                        {/* Fileupdate*/}
                                        <div className="mb-3">
                                            <label className="form-label">
                                               Update PDF<span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="file"
                                                accept="application/pdf"
                                                onChange={handleFileChange}
                                                className="form-control"
                                            />
                                        </div>

                                        {uploading && (
                                            <div className="text-center">
                                                <div className="spinner-border my-3" role="status"></div>
                                            </div>
                                        )}

                                        {/* Public Toggle */}
                                        <div className="form-check form-switch mb-3">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="isPublic"
                                                id="isPublic"
                                                checked={formData.isPublic}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="isPublic">
                                                Make PYQ public
                                            </label>
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={uploading}
                                            className="btn btn-warning"
                                        >
                                            {uploading ? 'Uploading...' : 'update PYQ'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Brand Logo Column */}
                    <div className="d-none d-md-flex col-md-2 bg-light align-items-center justify-content-center">
                        <img
                            src="./assets/img/brandlog.png"
                            alt="brand"
                            className="img-fluid"
                            style={{ transform: 'rotate(90deg)' }}
                            width={200}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdatePYQ;
