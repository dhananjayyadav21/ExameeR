import React from 'react';
import { useNavigate } from 'react-router-dom';

const Offers = () => {
  const navigate = useNavigate();

  let Basic = {
    title: "Basic Plan",
    price: "₹99",
    duration: "month",
    benefits: [
      "Access to Basic Notes",
      "5 Course Downloads",
      "Email Support",
      "1- Chat per day"
    ]
  }

  let Pro = {
    title: "Pro Plan",
    price: "₹299",
    duration: "month",
    benefits: [
      "Everything in Basic",
      "Unlimited Downloads",
      "Priority Support",
      "Live Sessions"
    ]
  }

  let Premium = {
    title: "Premium Plan",
    price: "₹499",
    duration: "month",
    benefits: [
      "Everything in Pro",
      "1-on-1 Mentoring",
      "Custom Study Plan",
      "Certificate"
    ]
  }

  const handlestart = (plan) => {
    navigate('/plan-detail', {
      state: { plan }
    })
  }


  return (
    <>
      <section id="pricing" className="py-5">
        <div className="container-lg">
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
                  <h3 className="card-title fw-bold mb-3">{Basic.title}</h3>
                  <div className="h1 fw-bold text-primary mb-4">
                    {Basic.price}<span className="fs-6 text-muted">/{Basic.duration}</span>
                  </div>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled text-start mb-4">
                    {Basic.benefits.map((benefit, index) => (
                      <li className="mb-2" key={index}><i className="fa-solid mx-3 green-i fa-check"></i>{benefit}</li>
                    ))}
                  </ul>
                  <button className="btn btn-primary w-100" onClick={() => { handlestart(Basic) }}>Get Started</button>
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
                  <h3 className="card-title fw-bold mb-3">{Pro.title}</h3>
                  <div className="h1 fw-bold text-primary mb-4">
                    {Pro.price}<span className="fs-6 text-light">/{Pro.duration}</span>
                  </div>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled text-start mb-4">
                    {Pro.benefits.map((benefit, index) => (
                      <li className="mb-2" key={index}><i className="fa-solid mx-3 green-i fa-check"></i>{benefit}</li>
                    ))}
                  </ul>
                  <button className="btn btn-primary w-100" onClick={() => { handlestart(Pro) }}>Get Started</button>
                </div>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="col-md-4">
              <div className="card card-transition border rounded-4 shadow py-4 h-100">
                <div className='text-center'>
                  <h3 className="card-title fw-bold mb-3">{Premium.title}</h3>
                  <div className="h1 fw-bold text-primary mb-4">
                    {Premium.price}<span className="fs-6 text-muted">/{Premium.duration}</span>
                  </div>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled text-start mb-4">
                    {Premium.benefits.map((benefit, index) => (
                      <li className="mb-2" key={index}><i className="fa-solid mx-3 green-i fa-check"></i>{benefit}</li>
                    ))}
                  </ul>
                  <button className="btn btn-primary w-100" onClick={() => { handlestart(Premium) }}>Get Started</button>
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
