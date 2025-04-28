import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EnrollmentPage = ({ setProgress }) => {
  const location = useLocation();
  const { course } = location.state || {};

  //--[useEffect]---
  useEffect(() => {
    setProgress(0);
    setProgress(100);
    // eslint-disable-next-line
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    college: '',
  });

  const [submitted, setSubmitted] = useState(false);

  // Simulate checking login status
  const isLoggedIn = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      toast.error('Please login to enroll!');
      return;
    }

    console.log('Enrollment Data:', formData);
    setSubmitted(true);
  };

  if (!course) {
    return <div className="text-center my-4">Course not found! <br /> Please try again</div>;
  }

  return (
    <div id="enrollment" className="container-lg min-vh-100 my-4 p-3 py-4 px-md-4">
      <h1 className="h4 fw-bold text-center text-dark mb-4">{course.title} Enrollment</h1>

      {/* Course Details Section */}
      <div className="card shadow-sm mb-4 border">
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={course.thumbnail || "/assets/img/cource.jpg"}
              alt={course.title}
              className="img-fluid rounded-start"
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{course.title}</h5>
              <p><strong>Level:</strong> {course.level}</p>
              <p><strong>Duration:</strong> {course.duration}</p>
              <p><strong>Content:</strong> {course.content}</p>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge bg-success">{course.offer} Off</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lectures Section */}
      <div className="card shadow-sm mb-4 border">
        <div className="card-body">
          <h5>Course Lectures:</h5>
          <ul className="list-group">
            {course.lectures.map((lecture, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{lecture.title}</span>
                <span className="badge bg-info">{lecture.duration}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Enrollment Form Section */}
      <div className="card shadow-sm p-4 mb-4 border">
        <h5>Enrollment Form</h5>
        {submitted ? (
          <div className="alert alert-success text-center">
            Thank you for enrolling! We will contact you shortly. <br /> Start your learning with Examee.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Full Name"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Email Address"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="form-control"
                placeholder="Mobile Number"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="form-control"
                placeholder="College/University"
              />
            </div>
            <div className="text-center mt-4">
              <button className="btn btn-primary" type="submit">Submit Enrollment</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EnrollmentPage;
