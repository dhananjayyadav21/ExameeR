"use client";
import React from 'react';
import StudentLayout from '../../components/Home/StudentLayout';
import PageBanners from '../../components/PageBanners';
import ContentContext from '../../context/ContentContext';
import { getLimit } from '../../utils/planAccess';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export default function CallBookPage() {
    const { userData, usage, getUsage, recordUsage } = React.useContext(ContentContext);
    const userPlan = userData?.Plan || 'e0';
    const router = useRouter();

    React.useEffect(() => {
        getUsage();
    }, []);

    const limit = getLimit(userPlan, 'callBook');
    const taken = usage?.callsBooked || 0;
    const remaining = limit === Infinity ? 'Unlimited' : Math.max(0, limit - taken);

    const handleBookSession = async (mentor) => {
        if (userPlan === 'e0') {
            toast.info("Mentorship calls are exclusive to Plus and Pro users!");
            router.push('/plans');
            return;
        }

        if (limit !== Infinity && taken >= limit) {
            toast.info(`Monthly limit reached! (${limit} calls). Upgrade your plan for more.`);
            router.push('/plans');
            return;
        }

        const confirmed = window.confirm(`Book session with ${mentor.name}? This will count towards your monthly limit.`);
        if (confirmed) {
            await recordUsage('calls');
            toast.success("Session booked successfully! (Usage recorded)");
        }
    };

    return (
        <StudentLayout title="Mentorship Calls">
            <div className="cb-page-wrapper">
                <div className="container-fluid px-0 pb-5 cb-container">
                    {/* Banners */}
                    <PageBanners page="call-book" />

                    <div className="cb-header mb-5 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
                        <div>
                            <h1 className="cb-title mb-2">Examee Support & Mentorship</h1>
                            <p className="cb-subtitle text-muted">Direct calls with educators and career counselors.</p>
                        </div>
                        <div className="cb-usage-stats d-flex gap-2 opacity-50">
                            <div className="cb-usage-pill">
                                <span className="cb-usage-count">{remaining}</span>
                                <span className="cb-usage-label">Remaining</span>
                            </div>
                            <div className="cb-usage-pill">
                                <span className="cb-usage-count">{taken}</span>
                                <span className="cb-usage-label">Used</span>
                            </div>
                        </div>
                    </div>

                    {/* Coming Soon Section */}
                    <div className="cb-status-card text-center py-5 px-4 rounded-5">
                        <div className="cb-icon-blob mb-4 mx-auto">
                            <i className="fa-solid fa-phone-slash"></i>
                        </div>
                        <h2 className="fw-900 mb-3" style={{ fontSize: '2rem', letterSpacing: '-0.03em' }}>
                            Feature <span className="text-success">Coming Soon</span>
                        </h2>
                        <p className="text-muted mx-auto mb-4" style={{ maxWidth: '500px', fontSize: '1.1rem', lineHeight: '1.6' }}>
                            We are currently building a professional mentorship network. Direct call booking is not available yet, but our team is working hard to bring top educators to your screen.
                        </p>
                        <div className="d-flex justify-content-center gap-3">
                            <button className="btn btn-dark px-4 py-2 rounded-pill fw-bold" onClick={() => router.back()}>
                                <i className="fa-solid fa-arrow-left me-2"></i>Go Back
                            </button>
                            <button className="btn btn-success px-4 py-2 rounded-pill fw-bold" onClick={() => router.push('/notes')}>
                                Explore Notes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .cb-page-wrapper { min-height: 80vh; position: relative; overflow: hidden; }
                .cb-container { max-width: 1400px; margin: 0 auto; position: relative; z-index: 2; }
                .cb-title { font-size: 2rem; font-weight: 900; color: #0f172a; letter-spacing: -0.04em; }
                .cb-subtitle { font-size: 1rem; font-weight: 500; }

                .cb-usage-pill { 
                    background: #fff; 
                    border: 1px solid #e2e8f0; 
                    padding: 8px 16px; 
                    border-radius: 12px; 
                    display: flex; 
                    flex-direction: column; 
                    align-items: center; 
                    min-width: 100px; 
                    text-align: center; 
                }
                .cb-usage-count { font-size: 1.1rem; font-weight: 800; color: #0f172a; line-height: 1.2; }
                .cb-usage-label { font-size: 0.64rem; font-weight: 700; color: #64748b; text-transform: uppercase; }

                .cb-status-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05);
                    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .cb-icon-blob {
                    width: 80px;
                    height: 80px;
                    background: #f0fdf4;
                    color: #04bd20;
                    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    animation: morph 8s ease-in-out infinite;
                }

                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                @keyframes morph {
                    0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
                    50% { border-radius: 50% 50% 20% 80% / 25% 80% 20% 75%; }
                    100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
                }

                @media (max-width: 768px) {
                    .cb-title { font-size: 1.5rem; }
                    .cb-status-card { margin: 0 10px; }
                }
            `}</style>
        </StudentLayout>
    );
}
