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
            getUser().then(() => setChecked(true));
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
            !userData.Course?.trim() ||
            !userData.University?.trim() ||
            !userData.Semester?.trim();

        setShowModal(incomplete);
    }, [userData, checked]);

    const handleComplete = () => {
        setShowModal(false);
    };

    return (
        <>
            {showModal && <ProfileSetupModal userData={userData} onComplete={handleComplete} />}
            {children}
        </>
    );
}
