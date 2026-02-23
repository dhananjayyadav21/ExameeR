"use client";
import React from 'react'

const Team = ({ name, role, description, profile }) => {
    return (
        <div className='col-12 col-sm-6 col-md-4'>
            <div className='card border-0 rounded-4 shadow-sm p-4 transition-all hover-lift h-100 bg-white'>
                <div className="d-flex align-items-start gap-3">
                    <div className="position-relative flex-shrink-0">
                        <img
                            src={profile || "/assets/img/User.jpg"}
                            alt={name}
                            className="rounded-circle border border-2 border-primary-subtle shadow-sm"
                            loading="lazy"
                            style={{ width: "65px", height: "65px", objectFit: 'cover' }}
                        />
                        <div className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-2 border-white" style={{ width: '12px', height: '12px' }}></div>
                    </div>
                    <div>
                        <h5 className="fw-bold mb-1 text-dark">{name}</h5>
                        <div className="badge bg-primary-subtle text-primary mb-2 rounded-pill px-2 py-1 small fw-medium">{role}</div>
                        <p className="text-muted small mb-0 lh-base">{description}</p>
                    </div>
                </div>
                <style jsx>{`
                    .hover-lift { transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); }
                    .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.06) !important; }
                    .transition-all { transition: all 0.3s ease; }
                `}</style>
            </div>
        </div>
    )
}

export default Team
