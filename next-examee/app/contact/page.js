"use client";
import React, { useState, useEffect } from 'react';
import Footer from '../../components/Footer';
import { postData } from "../../services/HttpService"
import * as GlobalUrls from "../../utils/GlobalURL"
import { toast } from "react-toastify";

export default function ContactPage({ setProgress = () => { } }) {
    useEffect(() => {
        setProgress(0);
        setProgress(100);
    }, []);

    const userSupport = async (Data) => {
        try {
            const json = await postData(
                `${GlobalUrls.SUPPORTUSER_URL}`,
                Data
            );
            return json;
        } catch (error) {
            console.log("Do not send support message due to some error", error);
        }
    };

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        body: ""
    })

    const handleOnChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        try {
            const { email, name, subject, body } = formData;
            if (!email || !name || !subject || !body) {
                toast.warning("Please fill the all data!", {
                    position: "top-right"
                });
            } else {
                const res = await userSupport(formData);
                if (res?.success === true) {
                    setFormData({
                        name: "",
                        email: "",
                        subject: "",
                        body: ""
                    })
                    toast.success("Successfully send your message!", {
                        position: "top-right"
                    });
                } else {
                    toast.error(res?.message || "Something went wrong!", {
                        position: "top-right"
                    });
                }
            }
        } catch (error) {
            toast.error(error.message || "Something went wrong!", {
                position: "top-right"
            });
        }
    }

    return (
        <main>
            <section id="contact" className="py-5 d-flex align-items-center" style={{ minHeight: "70vh" }}>
                <div className="container-md px-3 px-lg-5">
                    <div className="row g-4 align-items-center">
                        {/* Contact Information */}
                        <div className="col-lg-6">
                            <h2 className="fw-bold text-dark mb-4">Get in Touch</h2>
                            <h6 className="text-muted mb-5">
                                Have questions? We're here to help. Send us a message and we'll respond as soon as possible.
                            </h6>

                            <div className="list-group">
                                <div className="d-flex align-items-center mb-4">
                                    <div className="support-call text-white mx-2 bg-primary p-2 rounded-circle" style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <i className="fa-solid fa-phone"></i>
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-0">Phone</h5>
                                        <p className="text-muted mb-0">+91 9769 XXX XXX</p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center mb-4">
                                    <div className="support-email text-white mx-2 bg-success p-2 rounded-circle" style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <i className="fa-regular fa-envelope"></i>
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-0">Email</h5>
                                        <a className="text-muted mb-0 text-decoration-none" href="mailto:youaretopperofficial+exameesupport@gmail.com">support@examee.com</a>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center">
                                    <div className="support-location text-white mx-2 bg-danger p-2 rounded-circle" style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <i className="fa-solid fa-location-dot"></i>
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-0">Location</h5>
                                        <p className="text-muted mb-0">Mumbai, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="col-lg-6 my-md-5 my-lg-1">
                            <div className="p-4 py-lg-5 shadow-sm bg-light rounded-4">
                                <form onSubmit={handleOnSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label fw-semibold">Full Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleOnChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleOnChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="subject" className="form-label fw-semibold">Subject</label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleOnChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="body" className="form-label fw-semibold">Message</label>
                                        <textarea
                                            id="body"
                                            name="body"
                                            value={formData.body}
                                            onChange={handleOnChange}
                                            rows="4"
                                            className="form-control"
                                        ></textarea>
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100">
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className='footer'>
                <Footer />
            </footer>
        </main>
    );
}
