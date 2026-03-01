"use client";
import { useEffect, useState, useContext } from "react";
import ContentContext from "@/context/ContentContext";
import ProfileSetupModal from "@/components/ProfileSetupModal";

/**
 * ProfileSetupGate
 * Wraps the entire app to check if the logged-in student
 * has completed their academic profile. If not, shows the
 * ProfileSetupModal and blocks interaction until they fill it.
 */
export default function ProfileSetupGate({ children }) {
    const { userData, getUser } = useContext(ContentContext);
    const [showModal, setShowModal] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");

        // Only check for Student role
        if (!token || role !== "Student") {
            setChecked(true);
            return;
        }

        // Fetch user if not loaded yet
        if (!userData) {
            getUser().then((res) => {
                if (res && res.success === false) {
                    localStorage.clear();
                    window.location.href = '/login';
                } else {
                    setChecked(true);
                }
            });
        } else {
            setChecked(true);
        }
    }, []);

    useEffect(() => {
        if (!checked) return;
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("userRole");

        if (!token || role !== "Student" || !userData) {
            setShowModal(false);
            return;
        }

        // Check if profile is incomplete
        const incomplete = !userData.FirstName?.trim() ||
            !userData.LastName?.trim() ||
            !userData.Institution?.trim() ||
            !userData.Course?.trim() ||
            !userData.University?.trim() ||
            !userData.Semester?.trim() ||
            !userData.Phone?.trim() ||
            !userData.Gender?.trim() ||
            !userData.Location?.trim();

        setShowModal(incomplete);
    }, [userData, checked]);

    const handleComplete = () => {
        setShowModal(false);
    };

    if (!checked) {
        return (
            <div className="d-flex align-items-center justify-content-center vh-100 vw-100 bg-white" style={{ position: 'fixed', zIndex: 99999, top: 0, left: 0 }}>
                <div className="text-center">
                    <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <h5 className="mt-3 text-muted fw-semibold">Verifying Account...</h5>
                </div>
            </div>
        );
    }

    return (
        <>
            {showModal && <ProfileSetupModal userData={userData} onComplete={handleComplete} />}
            <div style={showModal ? { pointerEvents: 'none', filter: 'blur(3px)', userSelect: 'none', overflow: 'hidden', height: '100vh' } : {}}>
                {children}
            </div>
        </>
    );
}
