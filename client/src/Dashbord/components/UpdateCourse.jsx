import React, { useContext, useState } from "react";
import DriveUpload from "../../services/DriveUpload";
import ContentContext from '../../context/ContentContext';
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateCourse = () => {
    const context = useContext(ContentContext);
    const { updateCourse } = context

    const navigate = useNavigate();
    const location = useLocation();
    const { title, description, mentor, category, courseLevel, duration, price, offerPercent, offerPrice, startDate, courseContents, whyChoose, benefits, courseImage, trialVideo, isPublic, status, lectures, _id } = location.state || {};

    const [formData, setFormData] = useState({
        title: title,
        description: description,
        mentor: mentor,
        courseLevel: courseLevel,
        duration: duration,
        price: price,
        offerPercent: offerPercent,
        offerPrice: offerPrice,
        startDate: startDate,
        courseContents: courseContents,
        whyChoose: whyChoose,
        benefits: benefits,
        courseImage: courseImage,
        trialVideo: trialVideo,
        category: category,
        isPublic: isPublic,
        status: status,
        lectures: lectures?.length ? lectures : [{ title: "", videoUrl: "" }],
    });

    const [Updateing, setUpdateing] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };


    const handleLectureChange = (index, field, value) => {
        const updatedLectures = [...formData.lectures];
        updatedLectures[index][field] = value;
        setFormData((prev) => ({
            ...prev,
            lectures: updatedLectures,
        }));
    };

    const addLectureField = () => {
        setFormData((prev) => ({
            ...prev,
            lectures: [...prev.lectures, { title: "", videoUrl: "" }],
        }));
    };

    const removeLectureField = (index) => {
        const updatedLectures = formData.lectures.filter((_, idx) => idx !== index);
        setFormData((prev) => ({
            ...prev,
            lectures: updatedLectures,
        }));
    };

    const handleImageUpdate = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUpdateing(true);
        try {
            const result = await DriveUpload(file);
            if (result?.success && result?.fileId) {
                setFormData((prev) => ({
                    ...prev,
                    courseImage: result.fileId,
                }));
                toast.success("Thumbnail Updateed successfully!");
            } else {
                toast.warning("Failed to Update thumbnail.");
            }
        } catch (err) {
            toast.error(err.message);
        }
        setUpdateing(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateing(true);

        const { title, mentor, price, courseImage, trialVideo } = formData;

        if (!title || !mentor || !price || !courseImage || !trialVideo) {
            toast.warning("Please fill all required fields!");
            setUpdateing(false);
            return;
        }

        if (!trialVideo) {
            toast.warning("Please paste a valid YouTube video URL.");
            setUpdateing(false);
            return;
        }

        try {
            const response = await updateCourse(formData, _id);
            if (response.success) {
                toast.success("Course Updateed successfully!");
                navigate(-1);
            } else {
                toast.error(response.message || "Failed to Update course.");
            }
        } catch (err) {
            toast.error("Something went wrong.");
        }
        setUpdateing(false);
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
                                    Update<span className="text-warning"> Your Course</span>
                                </h5>
                            </div>
                        </div>
                        <div className="container-fluid my-3 px-0">
                            <div className="card shadow m-0 p-0">
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>

                                        {/* Title */}
                                        <div className="mb-3">
                                            <label className="form-label">Title <span className="text-danger">*</span></label>
                                            <input type="text" name="title" value={formData.title} onChange={handleChange} className="form-control" />
                                        </div>

                                        {/* Description */}
                                        <div className="mb-3">
                                            <label className="form-label">Description</label>
                                            <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows="3" />
                                        </div>

                                        {/* Mentor */}
                                        <div className="mb-3">
                                            <label className="form-label">Mentor <span className="text-danger">*</span></label>
                                            <input type="text" name="mentor" value={formData.mentor} onChange={handleChange} className="form-control" />
                                        </div>

                                        {/* Course Level */}
                                        <div className="mb-3">
                                            <label className="form-label">Course Level</label>
                                            <input type="text" name="courseLevel" value={formData.courseLevel} onChange={handleChange} className="form-control" />
                                        </div>

                                        {/* Duration */}
                                        <div className="mb-3">
                                            <label className="form-label">Duration</label>
                                            <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="form-control" />
                                        </div>

                                        {/* Price */}
                                        <div className="mb-3">
                                            <label className="form-label">Price <span className="text-danger">*</span></label>
                                            <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-control" />
                                        </div>

                                        {/* Offer Percent */}
                                        <div className="mb-3">
                                            <label className="form-label">Offer Percent</label>
                                            <input type="number" name="offerPercent" value={formData.offerPercent} onChange={handleChange} className="form-control" />
                                        </div>

                                        {/* Offer Price */}
                                        <div className="mb-3">
                                            <label className="form-label">Offer Price</label>
                                            <input type="number" name="offerPrice" value={formData.offerPrice} onChange={handleChange} className="form-control" />
                                        </div>

                                        {/* Start Date */}
                                        <div className="mb-3">
                                            <label className="form-label">Start Date</label>
                                            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="form-control" />
                                        </div>

                                        {/* Course Contents */}
                                        <div className="mb-3">
                                            <label className="form-label">Course Contents</label>
                                            <textarea name="courseContents" value={formData.courseContents} onChange={handleChange} className="form-control" rows="3" />
                                        </div>

                                        {/* Lectures Section */}
                                        <div className="mb-3">
                                            <label className="form-label">Lectures</label>
                                            {formData.lectures.map((lecture, index) => (
                                                <div key={index} className="card p-3 mb-2">
                                                    <div className="mb-2">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Lecture Title"
                                                            value={lecture.title}
                                                            onChange={(e) => handleLectureChange(index, "title", e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="mb-2">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Lecture Video URL (YouTube)"
                                                            value={lecture.videoUrl}
                                                            onChange={(e) => handleLectureChange(index, "videoUrl", e.target.value)}
                                                        />
                                                    </div>
                                                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removeLectureField(index)}>Remove</button>
                                                </div>
                                            ))}
                                            <button type="button" className="btn btn-info btn-sm m-2 text-white" onClick={addLectureField}>
                                                Add Lecture
                                            </button>
                                        </div>

                                        {/* Why Choose */}
                                        <div className="mb-3">
                                            <label className="form-label">Why Choose this Course</label>
                                            <textarea name="whyChoose" value={formData.whyChoose} onChange={handleChange} className="form-control" rows="2" />
                                        </div>

                                        {/* Benefits */}
                                        <div className="mb-3">
                                            <label className="form-label">Benefits</label>
                                            <textarea name="benefits" value={formData.benefits} onChange={handleChange} className="form-control" rows="2" />
                                        </div>

                                        {/* Update Thumbnail */}
                                        <div className="mb-3">
                                            <label className="form-label">Update Thumbnail Image <span className="text-danger">*</span></label>
                                            <input type="file" accept="image/*" onChange={handleImageUpdate} className="form-control" />
                                        </div>

                                        {Updateing && (
                                            <div className="text-center">
                                                <div className="spinner-border my-3" role="status"></div>
                                            </div>
                                        )}

                                        {/* YouTube Video URL */}
                                        <div className="mb-3">
                                            <label className="form-label">Trial Video (YouTube IFrame Id) <span className="text-danger">*</span></label>
                                            <input type="url" name="trialVideo" value={formData.trialVideo} onChange={handleChange} className="form-control" placeholder="https://www.youtube.com/watch?v=..." />
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

                                        {/* Public/Private Toggle */}
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
                                                Make note public
                                            </label>
                                        </div>


                                        {/* Submit */}
                                        <button type="submit" disabled={Updateing} className="btn btn-warning">
                                            {Updateing ? "Updating..." : "Update Course"}
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

export default UpdateCourse;
