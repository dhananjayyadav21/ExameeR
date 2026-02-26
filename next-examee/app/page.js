"use client";
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CourceIteam from '../components/Home/CourceIteam'
import Team from '../components/Home/Team'
import { ReactTyped } from "react-typed";
import HowExameeWork from '../components/Home/HowExameeWork'
import ContentContext from '../context/ContentContext';
import * as GlobalUrls from "../utils/GlobalURL";
import { toast } from 'react-toastify'

export default function Home({ setProgress = () => { } }) {
  const context = useContext(ContentContext);
  const { getNote, searchContent, setSearchContentData, Course, getCourse } = context
  const router = useRouter();

  useEffect(() => {
    setProgress(0);
    getNote();
    getCourse();
    setProgress(100);
  }, []);

  const [isFocused, setIsFocused] = useState(false);
  const [searchType, setSearchType] = useState('notes');
  const [query, setQuery] = useState('');
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const response = await searchContent(`${GlobalUrls.SEARCHCONTENT_URL}?search=${encodeURIComponent(query)}&type=${searchType}`);
      if (response.success === true) {
        setSearchContentData(response.results || []);
        router.push('/searchcontent');
      }
      else if (response.success === false) {
        toast.warning(response.message || "No matching content found !", {
          position: "top-right"
        });
      }
    } catch (err) {
      setSearchContentData([]);
      toast.error("Something went wrong.!", {
        position: "top-right"
      });
    }
  };

  const team = [
    {
      "name": "DHANANJAY",
      "role": "RAD'27",
      "description": "Guides resource management, teaches workflow strategies, and mentor.",
      "profile": "/assets/img/dhananjay.jpg"
    },
    {
      "name": "SANJAY",
      "role": "Software Engineer",
      "description": "Teaches technical concepts, facilitates teamwork, and ensures project success."
    },
    {
      "name": "Neel Singh",
      "role": "Junior Developer",
      "description": "Teaches coding basics, fosters collaboration, and support."
    }
  ]

  return (
    <main className="overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="hero-section position-relative pt-0 pb-5 overflow-hidden" style={{ background: 'white' }}>
        {/* Background Decorative Elements */}
        <div className="position-absolute top-0 end-0 w-50 h-100 bg-light opacity-50 z-0" style={{ clipPath: 'polygon(20% 0%, 100% 0, 100% 100%, 0% 100%)' }}></div>


        <div className="container px-4 position-relative z-1">
          <div className="row align-items-start pt-3">
            <div className="col-lg-6 my-4 mb-lg-0 pt-0 pb-5">
              <div className="d-inline-flex align-items-center bg-light border rounded-pill px-1 py-1 mb-4 animated-fade-in">
                <span className="badge bg-green rounded-pill me-2">New</span>
                <span className="small text-muted fw-medium me-2">All-in-one platform for your academic success</span>
              </div>

              <h1 className="display-5 fw-semibold mb-4 ls-tight text-dark" style={{ fontSize: '2.4rem' }}>
                Elevate Your <span className="text-green">Studies</span> to the Next Level.
              </h1>

              <h3 className="h5 fw-normal text-secondary mb-4" style={{ fontSize: '1rem' }}>
                Access 10,000+ curated &nbsp;
                <span className="fw-semibold text-dark border-bottom border-green border-2">
                  <ReactTyped strings={["Study Notes", "Previous Papers", "Expert Lectures", "Full Courses"]} typeSpeed={60} backSpeed={30} loop />
                </span>
              </h3>

              <p className="lead text-muted mb-5 pe-lg-5 lh-base">
                Examee is the ultimate learning partner for students who want to excel. We provide expert-verified resources to help you study smarter and achieve your goals.
              </p>

              <div className="search-box-wrapper mb-4 p-2 bg-white shadow-xl rounded-pill border" style={{ maxWidth: '650px', outline: isFocused ? '3px solid var(--primary-input-focus)' : 'none', transition: 'all 0.3s ease' }}>
                <form onSubmit={handleSearch} className="row g-0 align-items-center">
                  <div className="col flex-grow-1">
                    <div className="d-flex align-items-center ps-3">
                      <i className="fa-solid fa-magnifying-glass text-muted me-3"></i>
                      <input
                        type="text"
                        className="form-control border-0 bg-transparent py-3 shadow-none"
                        placeholder="Search for subjects, topics, or papers..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                    </div>
                  </div>
                  <div className="col-auto">
                    <button type="submit" className="btn btn-green rounded-pill px-5 py-3 fw-semibold shadow-md hover-scale" style={{ fontSize: '0.9rem' }}>
                      Explore
                    </button>
                  </div>
                </form>
              </div>

              <div className="d-flex align-items-center gap-4 pt-2">
                {!token ? (
                  <>
                    <Link href="/auth" className="btn btn-dark rounded-pill px-5 py-3 fw-bold shadow-lg transition-all hover-lift">
                      Start Learning
                    </Link>
                    <Link href="/about" className="text-decoration-none text-dark fw-bold d-flex align-items-center gap-2 group">
                      How it works <i className="fa-solid fa-arrow-right-long transition-all group-hover-translate-x"></i>
                    </Link>
                  </>
                ) : (
                  <div className="d-flex flex-wrap gap-2">
                    {['notes', 'pyq', 'video'].map((type) => (
                      <button
                        key={type}
                        className={`btn rounded-pill px-4 py-2 fw-medium transition-all ${searchType === type ? 'btn-green shadow-sm' : 'btn-light border text-muted'}`}
                        onClick={() => setSearchType(type)}
                      >
                        Search {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-6 position-relative text-center py-5">
              <div className="hero-image-wrapper p-4 d-inline-block position-relative">
                <img className="img-fluid rounded-4 shadow-xl animated-float" src="/assets/img/Front.png" alt="Examee Hero" style={{ maxHeight: '500px' }} />

                {/* Floating Elements (Visible on Desktop) */}
                <div className="position-absolute d-none d-xl-block" style={{ top: '10%', left: '-10%', zIndex: 2 }}>
                  <div className="bg-white border p-3 rounded-4 shadow-lg animated-bounce-slow">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-green-subtle p-2 rounded-circle" style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-file-pdf text-green"></i>
                      </div>
                      <div className="text-start">
                        <div className="fw-bold small text-dark">500+ Notes</div>
                        <div className="text-muted smaller">Expert Verified</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="position-absolute d-none d-xl-block" style={{ bottom: '15%', right: '-10%', zIndex: 2 }}>
                  <div className="bg-white border p-3 rounded-4 shadow-lg animated-bounce-slow-delayed">
                    <div className="d-flex align-items-center gap-3">
                      <div className="bg-success-subtle p-2 rounded-circle" style={{ width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-video text-success"></i>
                      </div>
                      <div className="text-start">
                        <div className="fw-bold small text-dark">100+ Hours</div>
                        <div className="text-muted smaller">Video Lectures</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Infinite Scroll Stats Section */}
      <section className="py-4 bg-white border-bottom overflow-hidden position-relative">
        <div className="container-fluid px-0">
          <div className="marquee-wrapper">
            <div className="marquee-content d-flex align-items-center">
              {[...Array(4)].map((_, groupIdx) => (
                <div key={groupIdx} className="d-flex align-items-center">
                  {[
                    { val: '4+', label: 'Prog. Notes', icon: 'fa-file-lines', color: '#04bd20', bg: 'rgba(4, 189, 32, 0.08)' },
                    { val: '150+', label: 'Lectures', icon: 'fa-circle-play', color: '#0d6efd', bg: 'rgba(13, 110, 253, 0.08)' },
                    { val: '500+', label: 'Papers', icon: 'fa-file-invoice', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)' },
                    { val: '10k+', label: 'Students', icon: 'fa-users', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.08)' },
                    { val: '24/7', label: 'Support', icon: 'fa-headset', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.08)' },
                  ].map((stat, i) => (
                    <div key={i} className="stat-pill mx-3 d-flex align-items-center gap-3 py-2 px-4 rounded-pill border">
                      <div className="stat-icon-circle rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '40px', height: '40px', background: stat.bg, color: stat.color }}>
                        <i className={`fa-solid ${stat.icon} fs-6`}></i>
                      </div>
                      <div>
                        <h4 className="fw-bold mb-0" style={{ fontSize: '1.1rem', color: stat.color }}>{stat.val}</h4>
                        <p className="text-muted small mb-0 fw-semibold text-uppercase ls-wide" style={{ fontSize: '0.65rem' }}>{stat.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Subtle Side Fades */}
        <div className="position-absolute top-0 start-0 h-100 w-25 pointer-events-none d-none d-md-block" style={{ background: 'linear-gradient(to right, white, transparent)', zIndex: 2 }}></div>
        <div className="position-absolute top-0 end-0 h-100 w-25 pointer-events-none d-none d-md-block" style={{ background: 'linear-gradient(to left, white, transparent)', zIndex: 2 }}></div>
      </section>

      {/* Courses Section */}
      <section className="py-custom px-3">
        <div className="container">
          <div className="text-center mb-5">
            <h6 className="text-green fw-semibold text-uppercase ls-wide mb-2" style={{ fontSize: '0.75rem' }}>Academic Excellence</h6>
            <h2 className="display-6 fw-semibold mb-3 text-dark" style={{ fontSize: '1.6rem' }}>Our Featured Courses</h2>
            <div className="mx-auto" style={{ width: '80px', height: '4px', background: 'var(--primary-gradient)', borderRadius: '2px' }}></div>
          </div>

          <div className="row g-4 mt-2">
            {!token ? (
              <div className="col-12 text-center py-5">
                <div className="bg-light rounded-4 p-5 shadow-sm border border-dashed mx-auto" style={{ maxWidth: '600px' }}>
                  <i className="fa-solid fa-lock fs-1 text-muted mb-4 opacity-25"></i>
                  <h3 className="text-dark">Join to explore our premium courses</h3>
                  <p className="text-muted mb-4">You need to be a member to see the full catalog and track your progress.</p>
                  <Link href="/auth" className="btn btn-green rounded-pill px-5 py-2 fw-bold">Sign Up Now</Link>
                </div>
              </div>
            ) : (
              <>
                {Course.length === 0 ? (
                  <div className="col-12 text-center py-5">
                    <div className="spinner-border text-green" role="status"></div>
                    <p className="mt-3 text-muted">Curating the best content for you...</p>
                  </div>
                ) : (
                  Course.map((c, index) => (
                    <div key={index} className="col-xl-3 col-lg-4 col-md-6">
                      <CourceIteam Course={c} />
                    </div>
                  ))
                )}
              </>
            )}
          </div>

          {token && (
            <div className="text-center mt-5">
              <button className="btn btn-outline-green rounded-pill px-5 py-3 fw-bold" onClick={() => router.push('/cource')}>
                Browse All Courses <i className="fa-solid fa-arrow-right ms-2"></i>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-custom bg-light">
        <div className="container">
          <div className="row g-4 h-100">
            {[
              { h6: "Previous Papers", p: "Master exam patterns with our extensive archives.", icon: "fa-paste", color: "green" },
              { h6: "Video Lectures", p: "Visual learning from industry professionals.", icon: "fa-film", color: "info" },
              { h6: "Study Notes", p: "Crisp and concise notes for quick revision.", icon: "fa-sticky-note", color: "success" },
              { h6: "Mock Tests", p: "Test your knowledge with real-time feedback.", icon: "fa-vial", color: "danger" }
            ].map((item, i) => (
              <div key={i} className="col-lg-3 col-md-6">
                <div className="card h-100 border-0 shadow-sm shadow-hover transition-all p-4 rounded-4 bg-white">
                  <div className={`icon-box bg-${item.color}-subtle text-${item.color} mb-4 rounded-3 d-flex align-items-center justify-content-center`} style={{ width: '50px', height: '50px' }}>
                    <i className={`fa-solid ${item.icon} fs-4`}></i>
                  </div>
                  <h5 className="fw-semibold mb-2 text-dark" style={{ fontSize: '1rem' }}>{item.h6}</h5>
                  <p className="text-muted small mb-0">{item.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-custom border-bottom bg-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-4 text-dark">Meet Our Educational Mentors</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>Our dedicated team of professionals work around the clock to ensure you have the best study materials reachable at your fingertips.</p>
          </div>
          <div className="row g-4 px-lg-4">
            {team.map((t, index) => <Team key={index} profile={t.profile} name={t.name} role={t.role} description={t.description} />)}
          </div>
        </div>
      </section>

      <section className="py-5 bg-white">
        <HowExameeWork />
      </section>

      {/* CSS Utilities for this page */}
      <style jsx>{`
        .py-custom { padding: 80px 0; }
        .text-gradient { background: var(--primary-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .ls-tight { letter-spacing: -0.02em; }
        .ls-wide { letter-spacing: 0.1em; font-size: 0.8rem; }
        .shadow-xl { box-shadow: 0 20px 50px -12px rgba(0,0,0,0.15); }
        .shadow-hover:hover { transform: translateY(-10px); box-shadow: 0 15px 30px rgba(4, 189, 32, 0.1) !important; }
        .transition-all { transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
        .animated-float { animation: float 6s ease-in-out infinite; }
        @keyframes float { 
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animated-bounce-slow { animation: bounce 4s ease-in-out infinite; }
        .animated-bounce-slow-delayed { animation: bounce 4s ease-in-out infinite 2s; }
        @keyframes bounce { 
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .bg-primary-subtle { background: rgba(4, 189, 32, 0.1); }
        .bg-success-subtle { background: rgba(25, 135, 84, 0.1); }
        .smaller { font-size: 0.8rem; }
        .hover-scale:hover { transform: scale(1.05); }
        .hover-lift:hover { transform: translateY(-3px); }
        .group:hover .group-hover-translate-x { transform: translateX(5px); }
        .group i { transition: transform 0.3s ease; }
        .marquee-wrapper { overflow: hidden; width: 100%; }
        .marquee-content { display: flex; width: max-content; animation: marquee 30s linear infinite; }
        @keyframes marquee { 
          from { transform: translateX(0); } 
          to { transform: translateX(-50%); } 
        }
        .marquee-wrapper:hover .marquee-content { animation-play-state: paused; }
        .stat-pill { background: #fff; border-color: #f1f5f9 !important; transition: all 0.3s ease; }
        .stat-pill:hover { border-color: #04bd20 !important; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.04); }
        .pointer-events-none { pointer-events: none; }
      `}</style>
    </main>
  )
}
