import React, { useEffect } from 'react';
import Footer from './Footer';

const About = ({ setProgress }) => {

    useEffect(() => {
        setProgress(0);
        setProgress(100);
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <div className='about py-5 d-flex align-items-center' style={{minHeight:"70vh"}}>
                <div className="container-md">
                    <div className="about-header">
                        <h1><i className="fas fa-leaf"></i> About Examee</h1>
                        <p>Your smart companion for notes, videos, and PYQs — all in one place.</p>
                    </div>

                    <div className="about-flex">
                        <div className="about-image">
                            <img
                                src="/assets/img/ExameeLinn.png"
                                alt="Study Linn"
                                height="450px"
                            />
                        </div>

                        <div className="about-text">
                            <h2><i className="fas fa-bullseye"></i> Our Mission</h2>
                            <p>
                                Examee helps you study smarter, not harder. With clean notes, curated lectures, and important questions, we're here to make learning simple.
                            </p>

                            <h2><i className="fas fa-box-open"></i> What We Offer</h2>
                            <ul>
                                <li><i className="fas fa-book-open mx-2"></i> Organized course notes</li>
                                <li><i className="fas fa-video mx-2"></i> Helpful video content</li>
                                <li><i className="fas fa-file-alt mx-2"></i> Previous year papers</li>
                                <li><i className="fas fa-bolt mx-2"></i> Fast, focused platform</li>
                            </ul>
                        </div>
                    </div>

                    <div className="about-footer">
                        <p><i className="fas fa-users"></i> Trusted by thousands of students.</p>
                        {/* across the country. */}
                    </div>
                </div>
            </div>

            {/* ====================================== footer ================================================================= */}
            <footer className="footer">
                <Footer />
            </footer>
        </>
    );
};

export default About;
