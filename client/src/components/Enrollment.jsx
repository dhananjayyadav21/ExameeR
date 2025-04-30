import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EnrollmentPage = ({ setProgress }) => {
  const location = useLocation();
  const { course } = location.state || {};

  // Track form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    college: '',
  });

  const [submitted, setSubmitted] = useState(false);

  // Simulate user login check
  const isLoggedIn = localStorage.getItem('token');

  // Handle progress bar on mount
  useEffect(() => {
    setProgress(0);
    setProgress(100);
    // eslint-disable-next-line
  }, []);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Please login to enroll!');
      return;
    }
    console.log('Enrollment Data:', formData);
    setSubmitted(true);
  };

  // If no course data is found
  if (!course) {
    return <div className="text-center my-4">Course not found! <br /> Please try again.</div>;
  }

  return (
    <div id="enrollment" className="min-vh-100 bg-body-tertiary">
      {/* Header with Course Title and Badge */}
      <div className="p-5 bg-dark text-white position-relative">
        <h2 className="rubik-font mb-3">{course?.title} Enrollment</h2>
        <h5 className="text-light-emphasis my-3">{course?.description}</h5>
        <span className="badge position-absolute bottom-0 end-0 m-3 bg-warning text-dark fw-semibold px-3 py-2 rounded-pill shadow">
          {course?.courseLevel || "Intermediate"}
        </span>
        <p>Mentor: <strong>{course?.mentor}</strong></p>
        <p>Start Date: <strong>{course?.startDate ? course?.startDate.slice(0, 10) : "Coming Soon"}</strong></p>
      </div>

      {/* Main Container */}
      <div className="container my-5">
        <div className="row g-4">

          {/* Left Column - Why & Enrollment Form */}
          <div className="col-md-7">
            {/* Why Choose Section */}
            <div className="bg-white border-start border-4 border-primary p-4 shadow-sm rounded-3 mb-4">
              <h4 className="rubik-font mb-2">Why Choose This Course?</h4>
              <p className="text-muted mb-0">{course?.whyChoose}</p>
            </div>

            {/* Benefits Section */}
            <div className="bg-white border-start border-4 border-success p-4 shadow-sm rounded-3 mb-4">
              <h4 className="rubik-font mb-2">Course Benefits</h4>
              <p className="text-muted mb-0">{course?.benefits}</p>
            </div>

            {/* Enrollment Form */}
            <div className="bg-white p-4 shadow-sm rounded-3">
              <h4 className="rubik-font mb-3">Enroll Now</h4>
              <p className="text-muted mb-4">Complete your details to enroll in this course.</p>
              {submitted ? (
                <div className="alert alert-success text-center">
                  Thank you for enrolling! We will contact you soon.
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" placeholder="Full Name" required />
                  </div>
                  <div className="mb-3">
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" placeholder="Email Address" required />
                  </div>
                  <div className="mb-3">
                    <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} className="form-control" placeholder="Mobile Number" required />
                  </div>
                  <div className="mb-3">
                    <input type="text" name="college" value={formData.college} onChange={handleChange} className="form-control" placeholder="College/University" />
                  </div>
                  <div className="text-center">
                    <button className="btn btn-warning d-flex px-4" type="submit">Submit</button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Column - Summary & Lectures */}
          <div className="col-md-5">
            <div className="card shadow-sm bg-white">
              <div className="card-body">
                <h4 className="rubik-font mb-3">Course Summary</h4>
                <img
                  src={`https://lh3.googleusercontent.com/d/${course.courseImage}` || "/assets/img/cource.jpg"}
                  alt={course.title}
                  className="img-fluid rounded-3 mb-4"
                />

                <p className="text-muted"><strong>Duration:</strong> {course?.duration}</p>
                <ul className="list-group mb-3">
                  {course?.lectures?.map((lecture, index) => (
                    <li key={index} className="list-group-item d-flex align-items-center my-1 shadow-sm">
                      <i className="fa fa-play-circle text-warning me-2"></i>
                      {lecture.title}
                    </li>
                  ))}
                </ul>

                <div className="border-top pt-3">
                  <h6 className="d-flex justify-content-between"><span>Price:</span><span>₹ {course?.price}</span></h6>
                  <h6 className="d-flex justify-content-between"><span>Discount:</span><span className="text-success">{course?.offerPercent}%</span></h6>
                  <hr />
                  <h5 className="fw-bold d-flex justify-content-between"><span>Total:</span><span className="text-black">₹ {course?.offerPrice}</span></h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> {/* End container */}
    </div>
  );
};

export default EnrollmentPage;