"use client";
import React, { useState, useEffect, useContext } from 'react';
import StudentLayout from '../../components/Home/StudentLayout';
import ContentContext from '../../context/ContentContext';
import { toast } from 'react-toastify';

const CertificatePage = () => {
    const { userData } = useContext(ContentContext);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCert, setSelectedCert] = useState(null);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/certificates', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setCertificates(data.certificates);
            }
        } catch (error) {
            console.error("Error fetching certificates:", error);
            toast.error("Failed to load certificates");
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <StudentLayout title="My Certificates">
            <div className="container-fluid pb-5">
                <div className="d-flex justify-content-between align-items-center mb-5 mt-4">
                    <div>
                        <h1 className="fw-bold text-dark" style={{ fontSize: '2rem', letterSpacing: '-0.02em' }}>Academic Achievement</h1>
                        <p className="text-muted">View and download your earned certificates from completed mock tests.</p>
                    </div>
                    <div className="bg-success-subtle p-3 rounded-4 d-flex align-items-center gap-3 border border-success-subtle shadow-sm">
                        <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                            <i className="fa-solid fa-award fs-4"></i>
                        </div>
                        <div>
                            <p className="mb-0 small fw-bold text-success uppercase" style={{ letterSpacing: '0.05em' }}>Total Earned</p>
                            <p className="mb-0 h4 fw-black text-dark">{certificates.length}</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="d-flex justify-content-center py-5">
                        <div className="spinner-border text-success" role="status"></div>
                    </div>
                ) : certificates.length === 0 ? (
                    <div className="text-center py-5 bg-white rounded-5 border border-dashed p-5 shadow-sm">
                        <div className="mb-4">
                            <i className="fa-solid fa-certificate text-light-subtle" style={{ fontSize: '5rem' }}></i>
                        </div>
                        <h3 className="fw-bold">No Certificates Yet</h3>
                        <p className="text-muted mb-4">Complete mock tests with a qualifying score to earn your official Examee certificates.</p>
                        <a href="/mock-tests" className="btn btn-dark rounded-pill px-4 py-2 fw-bold">Try a Mock Test</a>
                    </div>
                ) : (
                    <div className="row g-4">
                        {certificates.map((cert) => (
                            <div key={cert._id} className="col-md-6 col-lg-4">
                                <div className="cert-card p-4 rounded-4 shadow-sm border bg-white h-100 transition-all" onClick={() => setSelectedCert(cert)} style={{ cursor: 'pointer' }}>
                                    <div className="d-flex align-items-start justify-content-between mb-4">
                                        <div className="bg-dark rounded-3 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                            <i className="fa-solid fa-medal text-warning fs-3"></i>
                                        </div>
                                        <span className="badge bg-light text-dark border rounded-pill px-3 py-2 small fw-bold">
                                            ID: {cert.certificateId.split('-')[1]}
                                        </span>
                                    </div>
                                    <h4 className="fw-bold text-dark mb-1">{cert.testTitle}</h4>
                                    <p className="text-muted small mb-4">{cert.category}</p>

                                    <div className="d-flex justify-content-between align-items-center pt-3 border-top mt-auto">
                                        <div className="small">
                                            <p className="mb-0 text-muted">Issued on</p>
                                            <p className="mb-0 fw-bold">{new Date(cert.issueDate).toLocaleDateString()}</p>
                                        </div>
                                        <button className="btn btn-success rounded-pill px-3 py-1 fw-bold small">View Certificate</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Certificate Viewer Modal */}
            {selectedCert && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 rounded-4 overflow-hidden shadow-2xl">
                            <div className="modal-header border-0 bg-white px-4 pt-4">
                                <h5 className="modal-title fw-black">Certificate Preview</h5>
                                <button type="button" className="btn-close" onClick={() => setSelectedCert(null)}></button>
                            </div>
                            <div className="modal-body p-4 bg-white">
                                <div id="printable-certificate" className="certificate-design p-5 border-double text-center position-relative overflow-hidden" style={{
                                    border: '15px double #f1f5f9',
                                    backgroundColor: '#fff',
                                    minHeight: '500px',
                                    boxShadow: 'inset 0 0 50px rgba(0,0,0,0.02)'
                                }}>
                                    {/* Abstract corner decorations */}
                                    <div className="position-absolute top-0 left-0" style={{ width: '100px', height: '100px', background: 'linear-gradient(135deg, #04bd20 0%, transparent 70%)', opacity: 0.1 }}></div>
                                    <div className="position-absolute bottom-0 right-0" style={{ width: '100px', height: '100px', background: 'linear-gradient(315deg, #04bd20 0%, transparent 70%)', opacity: 0.1 }}></div>

                                    <div className="mb-4">
                                        <img src="/assets/img/brandlog.png" alt="Examee" style={{ height: '40px' }} />
                                    </div>

                                    <h5 className="text-success fw-black uppercase mb-4" style={{ letterSpacing: '8px' }}>Certificate of Achievement</h5>

                                    <p className="text-muted mb-1">This is to officially recognize the performance of</p>
                                    <h2 className="fw-black text-dark mb-4" style={{ fontSize: '2.5rem', fontFamily: 'serif' }}>{userData?.FirstName} {userData?.LastName}</h2>

                                    <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '80%' }}>
                                        for successfully completing the <strong>{selectedCert.testTitle}</strong>{' '}
                                        in the category of <strong>{selectedCert.category}</strong> with an outstanding performance score.
                                    </p>

                                    <div className="d-flex justify-content-between align-items-end mt-5 pt-5">
                                        <div className="text-start">
                                            <p className="mb-0 fw-bold border-bottom pb-1" style={{ borderBottom: '2px solid #04bd20 !important' }}>{selectedCert.certificateId}</p>
                                            <p className="mb-0 small text-muted mt-1 uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Verification ID</p>
                                        </div>
                                        <div className="text-center pb-2">
                                            <div className="mb-2 p-1 bg-white border rounded-3 shadow-sm">
                                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=https://examee.com/verify/${selectedCert.certificateId}`} alt="QR" style={{ width: '70px' }} />
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <p className="mb-0 fw-bold border-bottom pb-1" style={{ borderBottom: '2px solid #04bd20 !important' }}>{new Date(selectedCert.issueDate).toLocaleDateString()}</p>
                                            <p className="mb-0 small text-muted mt-1 uppercase fw-bold" style={{ fontSize: '0.65rem' }}>Issue Date</p>
                                        </div>
                                    </div>

                                    <div className="mt-5 pt-3">
                                        <p className="small text-muted mb-0 opacity-75">This is a system-generated academic document by Examee Learning Platform.</p>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 bg-light rounded-4 d-flex align-items-center justify-content-between border">
                                    <div className="d-flex align-items-center gap-2 overflow-hidden me-3">
                                        <i className="fa-solid fa-link text-success"></i>
                                        <span className="small text-muted text-truncate fw-medium">examee.com/verify/{selectedCert.certificateId}</span>
                                    </div>
                                    <button className="btn btn-sm btn-dark rounded-pill px-3 fw-bold flex-shrink-0" onClick={() => {
                                        navigator.clipboard.writeText(`https://examee.com/verify/${selectedCert.certificateId}`);
                                        toast.success("Credential URL copied!");
                                    }}>Copy URL</button>
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4 pt-0">
                                <button className="btn btn-light rounded-pill px-4" onClick={() => setSelectedCert(null)}>Close</button>
                                <button className="btn btn-success rounded-pill px-4 shadow-lg fw-bold" onClick={handlePrint}>
                                    <i className="fa-solid fa-print me-2"></i> Print Certificate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .cert-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .cert-card:hover { transform: translateY(-8px); border-color: #04bd20 !important; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important; }
                .border-double { border-style: double; }
                
                @media print {
                    @page { size: landscape; margin: 0; }
                    html, body { height: 100%; margin: 0 !important; padding: 0 !important; }
                    body * { visibility: hidden; }
                    #printable-certificate, #printable-certificate * { visibility: visible !important; }
                    #printable-certificate { 
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        height: 100% !important;
                        margin: 0 !important;
                        padding: 2cm !important;
                        border: 15px double #f1f5f9 !important;
                        display: flex !important;
                        flex-direction: column !important;
                        justify-content: center !important;
                        background-color: #fff !important;
                        z-index: 9999;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }
            `}</style>
        </StudentLayout>
    );
};

export default CertificatePage;
