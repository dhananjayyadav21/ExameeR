import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { postData } from "../services/HttpService"
import * as GlobalUrls from "../GlobalURL"
import { toast } from "react-toastify";

const Contact = ({setProgress}) => {

    //----[useEffect]---------
    useEffect(() => {
        setProgress(0);
        setProgress(100);
        // eslint-disable-next-line
      }, []);

    //----[userSupport]---------
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

    const handleOnSumbit = async (e) => {
        e.preventDefault();
        try {
            const { email, name, subject, body } = formData;
            if (!email || !name || !subject || !body) {
                toast.warning("Please fill the all data!", {
                    position: "top-right"
                });
            } else {
                const res = await userSupport(formData);
                if (res.success === true) {
                    setFormData({
                        name: "",
                        email: "",
                        subject: "",
                        body: ""
                    })
                    toast.success("Successfully send your message!", {
                        position: "top-right"
                    });
                } else if (res.success === false) {
                    toast.error(res.message, {
                        position: "top-right"
                    });
                }
            }
        } catch (error) {
            console.log(error, error.message);
            toast.error(error.message || "Somthing went wrong !", {
                position: "top-right"
            });
        }
    }



    return (
        <div>
            <section id="contact" className="py-5">
                <div className="container-lg px-3 px-lg-5">
                    <div className="row g-4 align-items-center">
                        {/* Contact Information */}
                        <div className="col-lg-6">
                            <h2 className="fw-bold text-dark mb-4">Get in Touch</h2>
                            <h6 className="text-muted mb-5">
                                Have questions? We're here to help. Send us a message and we'll respond as soon as possible.
                            </h6>

                            <div className="list-group">
                                <div className="d-flex align-items-center mb-4">
                                    <div className="support-call text-white mx-2">
                                        <i className="fa-solid fa-phone"></i>
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-0">Phone</h5>
                                        <p className="text-muted mb-0">+91 (800) 123-4567</p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center mb-4">
                                    <div className="support-email text-white  mx-2">
                                        <i className="fa-regular fa-envelope"></i>
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-0">Email</h5>
                                        <p className="text-muted mb-0">support@examee.com</p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center">
                                    <div className="support-location text-white  mx-2">
                                        <i className="fa-solid fa-location-dot"></i>
                                    </div>
                                    <div>
                                        <h5 className="fw-bold mb-0">Location</h5>
                                        <p className="text-muted mb-0">Delhi, India</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="col-lg-6">
                            <div className="p-4 py-lg-5 shadow-sm bg-light rounded-4">
                                <form onSubmit={handleOnSumbit}>
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

            <section className='footer bottom-0'>
                <Footer />
            </section>
        </div>
    );
};

export default Contact;
