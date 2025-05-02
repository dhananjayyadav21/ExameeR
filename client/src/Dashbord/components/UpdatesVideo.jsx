import React, { useContext, useState } from 'react';
import ContentContext from '../../context/ContentContext';
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";

const UpdateVideo = () => {
    const context = useContext(ContentContext);
    const { updateVideo } = context;

    const navigate = useNavigate();
    const location = useLocation();
    const { title, description,  category, tags, isPublic, status, fileUrl, _id } = location.state || {};

    //-- form data 
    const [formData, setFormData] = useState({
        title: title,
        description: description,
        category: category,
        tags: tags,
        fileUrl: fileUrl,
        isPublic: isPublic,
        status: status,
    });
    const [uploading, setUploading] = useState(false);

    //-- handle onChange
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    //-- handle onSbmit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        const data = {  // set Video data
            title: formData.title,
            description: formData.description,
            category: formData.category,
            tags: typeof formData.tags === 'string'
                ? formData.tags.split(',').map(tag => tag.trim())
                : formData.tags,
            isPublic: formData.isPublic,
            status: formData.status,
            fileUrl: formData.fileUrl
        };

        try { // try block to api call
            const { title, category, status, fileUrl } = data;

            if (!fileUrl) {
                setUploading(false);
                return toast.warning("Please update and paste video url", {
                    position: "top-right"
                });
            }

            if (!title || !category || !status) {
                // Check All data from body
                if (!title) {
                    setUploading(false);
                    toast.warning("Video title must be important !", {
                        position: "top-right"
                    });
                }

                // Check All data from body
                if (!category || !status) {
                    setUploading(false);
                    toast.warning("Video Category & Status reuired !", {
                        position: "top-right"
                    });
                }
            } else {
                const response = await updateVideo(data,_id); //call api
                if (response.success === true) {
                    setFormData({
                        title: '',
                        description: '',
                        category: 'sciTechnology',
                        tags: '',
                        isPublic: true,
                        status: 'public',
                    });
                    navigate(-1);
                    toast.success("Video updated successfully!", {
                        position: "top-right"
                    });
                } else if (response.success === false) {
                    setUploading(false);
                    toast.error(response.message || "Failed to update Video.!", {
                        position: "top-right"
                    });
                }
            }
            // if accured error in calling api
        } catch (error) {
            setUploading(false);
            return toast.error("Failed to update Video. Try again", {
                position: "top-right"
            });
        }
        setUploading(false);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Form Column */}
                <div className="col-12 col-md-10">
                    <div className="container-fluid mt-4 shadow-sm">
                        <div className="text-start">
                            <h5 className="card-title mb-0 py-2">
                                Update Your<span className="text-warning"> Video</span>
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
                                            required
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="form-control"
                                            rows="3"
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
                                            placeholder="Comma-separated tags (e.g., tutorials, coding)"
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

                                    {/* File update */}
                                    <div className="mb-3">
                                        <label className="form-label">Update Video<span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            name="fileUrl"
                                            value={formData.fileUrl}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="Paste file Url here..."
                                        />
                                    </div>

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
                                            Make video public
                                        </label>
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="btn btn-warning"
                                    >
                                        {uploading ? 'Uploading...' : 'Update Video'}
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
    );
};

export default UpdateVideo;
