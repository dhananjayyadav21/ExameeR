import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ContentContext from '../../context/ContentContext'; // Assume you have addStudent function here
import { toast } from 'react-toastify';

const UpdateStudent = () => {
  const context = useContext(ContentContext);
  const { updateStudent } = context; // Function to call API for adding student

  const navigate = useNavigate();
  const location = useLocation();
  const { Username, Email, Password, Status, Role, isVerified , _id} = location.state || {}; 
  
  //--- formdata of the update form
  const [formData, setFormData] = useState({
    Username: Username,
    Email: Email,
    Password: Password,
    Role: Role,
    Status: Status,
    isVerified: isVerified,
  });
  const [uploading, setUploading] = useState(false);

 //--handle onchange student info
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  //--handle update student info
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    if (!formData.Username || !formData.Email) {
      toast.warning('Username, Email are required!', { position: 'top-right' });
      setUploading(false);
      return;
    }

    try {
      const response = await updateStudent(formData,_id); //call api 
      if (response.success === true) {
        toast.success('Student update successfully!', { position: 'top-right' });
        setFormData({
          Username: '',
          Email: '',
          Password: '',
          Role: 'Student',
          Status: 'active',
          isVerified: false,
        });
        navigate(-1);
      } else {
        toast.error(response.message || 'Failed to update student.', { position: 'top-right' });
      }
    } catch (error) { // handle error
      toast.error('Failed to update student. Try again.', { position: 'top-right' });
    }
    setUploading(false);
  };

  return (
    <> 
      <div className="container-fluid ">
        <div className="row">

          {/* Form Column */}
          <div className="col-12 col-md-10 h-100" style={{minHeight:'92vh'}}>
            <div className="container-fluid mt-4 shadow-sm">
              <div className="text-start">
                <h5 className="card-title mb-0 py-2">
                  Update<span className="text-warning"> Student Info</span>
                </h5>
              </div>
            </div>

            <div className="container-fluid my-3 px-0">
              <div className="card shadow m-0 p-0">
                <div className="card-body">

                  <form onSubmit={handleSubmit}>

                    {/* Username */}
                    <div className="mb-3">
                      <label className="form-label">
                        Username<span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="Username"
                        value={formData.Username}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    {/* Email */}
                    <div className="mb-3">
                      <label className="form-label">
                        Email<span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                      <label className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        name="Password"
                        value={formData.Password}
                        onChange={handleChange}
                        className="form-control"
                        placeholder='If you want change..'
                      />
                    </div>

                    {/* Status */}
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        name="Status"
                        value={formData.Status}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    {/* isVerified */}
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="isVerified"
                        id="isVerified"
                        checked={formData.isVerified}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="isVerified">
                        Is Verified
                      </label>
                    </div>

                    {uploading && (
                      <div className="text-center">
                        <div className="spinner-border mt-3" role="status"></div>
                      </div>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={uploading}
                      className="btn btn-warning"
                    >
                      {uploading ? 'Saving...' : 'Update Student'}
                    </button>

                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Brand Logo Column */}
          <div className="d-none d-md-flex col-md-2 bg-light align-items-center justify-content-center" style={{minHeight:'92vh'}}>
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

export default UpdateStudent;
