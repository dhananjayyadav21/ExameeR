"use client";
import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '../../components/Footer';
import ContentContext from '../../context/ContentContext';

export default function PaymentPage({ setProgress = () => { } }) {
    const router = useRouter();
    const { selectedPlan: plan } = useContext(ContentContext);

    useEffect(() => {
        setProgress(0);
        setProgress(100);
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
            router.push('/');
        }
    };

    if (!plan) {
        return (
            <div className='p-5 text-center' style={{ minHeight: "70vh" }}>
                <h4>Plan not found</h4>
                <button className="btn btn-primary mt-3" onClick={() => router.push('/')}>Back to Home</button>
            </div>
        );
    }

    return (
        <main>
            <div className='bg-light' style={{ minHeight: "70vh" }}>
                <div className="container py-5">
                    <div className="payment-header">
                        <h2 className="text-center">Complete Your Payment</h2>
                        <p className="text-center">You're just one step away from getting access to {plan.title}.</p>
                    </div>

                    <div className="border bg-white px-3 py-4 p-md-5 shadow-sm rounded-4 mt-4">
                        <div className="row">
                            {/* Plan Details Section */}
                            <div className="col-md-6">
                                <div className="plan-summary">
                                    <h4 className="plan-title text-warning">{plan.title}</h4>
                                    <p className="plan-price fw-bold fs-3">{plan.price}/{plan.duration}</p>
                                    <ul className="plan-benefits list-unstyled">
                                        {plan.benefits.map((benefit, index) => (
                                            <li key={index} className="mb-2">
                                                <i className="fa-solid fa-check text-success me-3"></i>{benefit}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <p className='text-muted my-4' >
                                        <span className='text-warning'>* </span>It emphasizes the ongoing development and encourages users to remain patient for the upcoming features.
                                    </p>
                                </div>
                            </div>

                            {/* User Details Section */}
                            <div className="col-md-6">
                                <div className="user-details">
                                    <h5 className="mb-4">Enter Your Details</h5>
                                    <form>
                                        <div className="mb-3">
                                            <label className="form-label">Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                className="form-control"
                                                value={userDetails.name}
                                                onChange={handleChange}
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                value={userDetails.email}
                                                onChange={handleChange}
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Phone</label>
                                            <input
                                                type="text"
                                                name="phone"
                                                className="form-control"
                                                value={userDetails.phone}
                                                onChange={handleChange}
                                                placeholder="Enter your phone number"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label">Address</label>
                                            <textarea
                                                name="address"
                                                className="form-control"
                                                rows="3"
                                                value={userDetails.address}
                                                onChange={handleChange}
                                                placeholder="Enter your address"
                                            />
                                        </div>
                                    </form>
                                </div>

                                {/* Payment Options */}
                                <div className="payment-options bg-light p-4 rounded-3">
                                    <h5 className="mb-3">Select a Payment Method</h5>
                                    <div className="d-flex gap-3 mb-4">
                                        <div className="text-center p-2 border rounded bg-white flex-grow-1">
                                            <i className="fa fa-credit-card d-block mb-1"></i>
                                            <small>Card</small>
                                        </div>
                                        <div className="text-center p-2 border rounded bg-white flex-grow-1">
                                            <i className="fa-brands fa-paypal d-block mb-1"></i>
                                            <small>PayPal</small>
                                        </div>
                                        <div className="text-center p-2 border rounded bg-white flex-grow-1">
                                            <i className="fa-brands fa-google-pay d-block mb-1"></i>
                                            <small>GPay</small>
                                        </div>
                                    </div>
                                    <button className="btn btn-warning w-100 py-2 fw-bold" disabled onClick={handleProceedToPayment}>
                                        Proceed to Payment
                                    </button>
                                    <small className="text-muted d-block text-center mt-2">Payments are disabled in demo</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className="footer">
                <Footer />
            </footer>
        </main>
    );
}
