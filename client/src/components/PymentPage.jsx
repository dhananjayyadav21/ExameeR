import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentPage = ({ setProgress }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { plan } = location.state || {}; 

  //--[useEffect]---
  useEffect(() => {
    setProgress(0);
    setProgress(100);
    // eslint-disable-next-line
  }, []);

  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProceedToPayment = () => {
    if (!userDetails.name || !userDetails.email || !userDetails.phone || !userDetails.address) {
      alert('Please fill in all the details to proceed.');
    } else {
      alert('Payment successful!');
      navigate('/thank-you'); // Redirect to a thank-you page or confirmation page
    }
  };

  if (!plan) {
    return <div>Plan not found</div>;
  }

  return (
    <>
      <div className='bg-light'>
        <div className="container py-5">
          <div className="payment-header">
            <h2 className="text-center">Complete Your Payment</h2>
            <p className="text-center">You're just one step away from getting access to {plan.title}.</p>
          </div>

          <div className="border bg-white p-5 shadow-sm rounded-4 mt-4">
            <div className="row">
              {/* Plan Details Section */}
              <div className="col-md-6">
                <div className="plan-summary">
                  <h4 className="plan-title text-warning">{plan.title}</h4>
                  <p className="plan-price">{plan.price}/{plan.duration}</p>
                  <ul className="plan-benefits">
                    {plan.benefits.map((benefit, index) => (
                      <li key={index}><i className="fa-solid mx-3 green-i fa-check"></i>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className='text-muted my-4' > <span className='text-warning'>* </span>It emphasizes the ongoing development and encourages users to remain patient for the upcoming features. Let me know if this fits your needs!</p>
                </div>
              </div>

              {/* User Details Section */}
              <div className="col-md-6">
                <div className="user-details">
                  <h5>Enter Your Details</h5>
                  <form>
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={userDetails.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={userDetails.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input
                        type="text"
                        name="phone"
                        className="form-control"
                        value={userDetails.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <textarea
                        name="address"
                        className="form-control"
                        value={userDetails.address}
                        onChange={handleChange}
                        placeholder="Enter your address"
                      />
                    </div>
                  </form>
                </div>

                {/* Payment Options */}
                <div className="payment-options">
                  <h5>Select a Payment Method</h5>
                  <div className="methods">
                    <div className="method">
                      <i className="fa fa-credit-card" aria-hidden="true"></i>
                      <span>Credit/Debit Card</span>
                    </div>
                    <div className="method">
                      <i className="fa fa-paypal" aria-hidden="true"></i>
                      <span>PayPal</span>
                    </div>
                    <div className="method">
                      <i className="fa fa-google-wallet" aria-hidden="true"></i>
                      <span>Google Pay</span>
                    </div>
                  </div>
                  <button className="btn btn-warning" disabled onClick={handleProceedToPayment}>Proceed to Payment</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
