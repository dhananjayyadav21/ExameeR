import React from 'react';

const Offers = () => {
  return (
    <>
      <section id="pricing" className="py-5">
        <div className="container">
          {/* Section Header */}
          <div className="text-center my-4">
            <h2 className="fw-bold text-dark">Try With Latest Offers</h2>
            <p className="fw-5 text-secondary">Get New Offers</p>
          </div>

          {/* Pricing Cards */}
          <div className="row g-4 mt-5">
            {/* Basic Plan */}
            <div className="col-md-4">
              <div className="card card-transition border rounded-4 shadow py-4 h-100">
                <div className='text-center'>
                    <h3 className="card-title fw-bold mb-3">Basic Plan</h3>
                    <div className="h1 fw-bold text-primary mb-4">
                        ₹499<span className="fs-6 text-muted">/month</span>
                    </div>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled mb-4">
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Access to Basic Notes
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      5 Course Downloads
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Email Support
                    </li>
                  </ul>
                  <button className="btn btn-primary w-100">Get Started</button>
                </div>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="col-md-4">
              <div className="card card-transition border-primary bg-dark text-white rounded-4 shadow py-4 position-relative">
                <div className="position-absolute top-0 end-0 mt-2 me-2">
                  <span className="badge bg-primary text-white">Popular</span>
                </div>
                <div className='text-center'>
                    <h3 className="card-title fw-bold mb-3">Pro Plan</h3>
                    <div className="h1 fw-bold text-primary mb-4">
                        ₹999<span className="fs-6 text-light">/month</span>
                    </div>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled mb-4">
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Everything in Basic
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Unlimited Downloads
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Priority Support
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Live Sessions
                    </li>
                  </ul>
                  <button className="btn btn-primary w-100">Get Started</button>
                </div>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="col-md-4">
              <div className="card card-transition border rounded-4 shadow py-4 h-100">
                <div className='text-center'>
                    <h3 className="card-title fw-bold mb-3">Premium Plan</h3>
                    <div className="h1 fw-bold text-primary mb-4">
                        ₹1499<span className="fs-6 text-muted">/month</span>
                    </div>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled text-start mb-4">
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Everything in Pro
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      1-on-1 Mentoring
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Custom Study Plan
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      Certificate
                    </li>
                  </ul>
                  <button className="btn btn-primary w-100">Get Started</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Offers;
