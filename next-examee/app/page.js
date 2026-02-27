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

// New Premium Components
import GlobalLoader from '../components/GlobalLoader'
import PremiumHero from '../components/Home/PremiumHero'
import PremiumFeatures from '../components/Home/PremiumFeatures'
import PremiumExtra from '../components/Home/PremiumExtra'
import FloatingContact from '../components/Home/FloatingContact'
import LoggedInHome from '../components/Home/LoggedInHome'
import './home-premium.css';
import { homeData } from '../constants/homeData';

export default function Home({ setProgress = () => { } }) {
  const { marqueeStats } = homeData;
  const context = useContext(ContentContext);
  const { getNote, searchContent, setSearchContentData, Course, getCourse, userData, getUser } = context
  const router = useRouter();

  useEffect(() => {
    setProgress(0);
    getNote();
    getCourse();
    if (!userData && typeof window !== 'undefined' && localStorage.getItem("token")) {
      getUser();
    }
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

  if (token) {
    return <LoggedInHome userData={userData} />;
  }

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

  return (
    <main className="overflow-hidden bg-white position-relative">

      {/* Premium Hero Section */}
      <PremiumHero
        token={token}
      />

      {/* Stats Infinite Scroll (Keep existing or upgrade?) - upgrading to match new style */}
      <section className="py-4 bg-white border-bottom overflow-hidden position-relative">
        <div className="container-fluid px-0">
          <div className="marquee-wrapper">
            <div className="marquee-content d-flex align-items-center">
              {[...Array(4)].map((_, groupIdx) => (
                <div key={groupIdx} className="d-flex align-items-center">
                  {marqueeStats.map((stat, i) => (
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
      </section>

      {/* Courses Section */}
      <section className="py-5 px-3 bg-premium-light">
        <div className="container-xl">
          <div className="text-center mb-5">
            <h6 className="text-primary-green fw-bold text-uppercase ls-wide mb-2" style={{ letterSpacing: '0.15em' }}>Academic Excellence</h6>
            <h2 className="display-5 fw-black mb-3 text-dark-blue">Our Featured Courses</h2>
            <div className="mx-auto bg-primary-green rounded-pill" style={{ width: '60px', height: '5px' }}></div>
          </div>

          <div className="row g-4 mt-2">
            {!token ? (
              <div className="col-12 text-center py-5">
                <div className="auth-wall-card p-5 mx-auto transition-all">
                  <div className="auth-icon-wrapper mb-4">
                    <i className="fa-solid fa-lock-open text-primary-green opacity-75"></i>
                  </div>
                  <h3 className="fw-bold text-dark-blue mb-3 h2">Unlock Your Premium Learning Journey</h3>
                  <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '450px' }}>
                    Join thousands of successful students. Get instant access to curated notes, expert video lectures, and verified previous papers.
                  </p>
                  <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mt-4">
                    <Link href="/auth" className="btn btn-primary-premium rounded-pill px-5 py-3 fw-semibold shadow-sm">
                      Get Started Now
                    </Link>
                    <Link href="/about" className="btn btn-outline-dark rounded-pill px-4 py-3 fw-semibold border-2">
                      Explore Features
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {Course.length === 0 ? (
                  <div className="col-12 text-center py-5">
                    <div className="spinner-border text-primary-green" role="status"></div>
                    <p className="mt-3 text-muted">Curating the best content for you...</p>
                  </div>
                ) : (
                  Course.map((c, index) => (
                    <div key={index} className="col-xl-3 col-lg-4 col-md-6 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <CourceIteam Course={c} />
                    </div>
                  ))
                )}
              </>
            )}
          </div>

          {token && (
            <div className="text-center mt-5">
              <button className="btn btn-outline-dark rounded-pill px-5 py-3 fw-bold border-2 transition-all hover-lift" onClick={() => router.push('/cource')}>
                Browse All Courses <i className="fa-solid fa-arrow-right ms-2"></i>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Premium Features Section */}
      <PremiumFeatures />

      {/* Premium Extra Section (Categories, Testimonials) */}
      <PremiumExtra />

      {/* How it works Section */}
      <section className="py-5 bg-premium-light border-top">
        <div className="container-xl">
          <HowExameeWork />
        </div>
      </section>

      {/* Floating Contact Component */}
      <FloatingContact />


    </main>
  )
}
