import React, { useState } from 'react';

const UploadPYQ = ({ userId }) => {
  const [formData, setFormData] = useState({
    title: '',
    year: '',
    subject: '',
    category: '',
    tags: '',
    isPublic: true,
    status: 'public',
  });

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || file.type !== 'application/pdf') {
      return setMessage('Please upload a valid PDF file.');
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('year', formData.year);
    data.append('subject', formData.subject);
    data.append('category', formData.category);
    data.append('tags', formData.tags.split(',').map(tag => tag.trim()));
    data.append('isPublic', formData.isPublic);
    data.append('status', formData.status);
    data.append('uploadedBy', userId);
    data.append('file', file);

    try {
      setUploading(true);
      const response = await fetch('/api/pyq/upload', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) throw new Error('Upload failed');

      setMessage('Previous Year Question uploaded successfully!');
      setFormData({
        title: '',
        year: '',
        subject: '',
        category: '',
        tags: '',
        isPublic: true,
        status: 'public',
      });
      setFile(null);
    } catch (error) {
      setMessage('Failed to upload PYQ. Try again.');
    } finally {
      setUploading(false);
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
                  Upload Your<span className="text-info"> Previous Year Question</span>
                </h5>
              </div>
            </div>

            <div className="container my-3">
              <div className="card shadow">
                <div className="card-body">
                  {message && <div className="alert alert-info">{message}</div>}
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

                    {/* Year */}
                    <div className="mb-3">
                      <label className="form-label">
                        Year<span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        name="year"
                        required
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
                        required
                        value={formData.subject}
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
                      className="btn btn-primary"
                    >
                      {uploading ? 'Uploading...' : 'Upload PYQ'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Column */}
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

export default UploadPYQ;
