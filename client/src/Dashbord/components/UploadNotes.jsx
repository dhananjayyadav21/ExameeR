import React, { useContext, useState } from 'react';
import ContentContext from '../../context/ContentContext';
import { toast } from "react-toastify";

const UploadNotes = () => {
  const context = useContext(ContentContext);
  const { addNote } = context

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    professor: '',
    category: '',
    tags: '',
    isPublic: true,
    status: 'public',
  });

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => { //handle Field Data Change 
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => { //handle file Change 
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // check file and file type
    if (!file || file.type !== 'application/pdf') {
      return toast.warning("Please upload a valid PDF file", {
        position: "top-right"
      });
    }else {
      const data = {  // set Note data
        title: formData.title,
        description: formData.description,
        professor: formData.professor,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        isPublic: formData.isPublic,
        status: formData.status
      };

      try {
        setUploading(true);
        console.log("data-------------", data)
        const response = await addNote(data);
        console.log("response-------------", response)

        if (response.success === true) {
          toast.success("Note uploaded successfully!", {
            position: "top-right"
          });
          // setFormData({
          //   title: '',
          //   description: '',
          //   professor: '',
          //   category: '',
          //   tags: '',
          //   isPublic: false,
          //   status: 'public',
          // });
          // setFile(null);
        }else if(response.success === false){
          toast.error( response.message || "Failed to upload note.!", {
            position: "top-right"
          });
        }
        
        // if accured error in calling api
      } catch (error) {
        return toast.error("Failed to upload note. Try again", {
          position: "top-right"
        });
      } finally {
        setUploading(false);
      }

    }
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
                  Upload<span className="text-info"> Your Notes</span>
                </h5>
              </div>
            </div>

            <div className="container-fluid my-3">
              <div className="card shadow m-0 p-0">
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

                    {/* Professor */}
                    <div className="mb-3">
                      <label className="form-label">Professor</label>
                      <input
                        type="text"
                        name="professor"
                        value={formData.professor}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    {/* Category */}
                    <div className="mb-3">
                      <label className="form-label">Category (Stream)</label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="e.g. Computer Science, Commerce, etc."
                      />
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

                    {/* File Upload */}
                    <div className="mb-3">
                      <label className="form-label">
                        Upload PDF<span className="text-danger">*</span>
                      </label>
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="form-control"
                      />
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
                    <button
                      type="submit"
                      disabled={uploading}
                      className="btn btn-primary"
                    >
                      {uploading ? 'Uploading...' : 'Upload Note'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Logo Column */}
          <div className="col-md-2 bg-light">
            <div style={{ marginTop: '45vh' }}>
              <img
                src="./assets/img/brandlog.png"
                alt="brand"
                style={{ transform: 'rotate(90deg)' }}
                width={200}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadNotes;
