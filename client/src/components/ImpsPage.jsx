import React, { useContext, useEffect, useState } from "react";
import NotesIteam from "./NotesItem.jsx"
import ContentContext from '../context/ContentContext'
import * as GlobalUrls from "../GlobalURL"
import { FaFileAlt, FaBook, FaVideo } from 'react-icons/fa';
import { useSearchParams } from "react-router-dom";


const ImpsPage = ({ setProgress }) => {
    const imps = [
        {
            title: 'Important Questions',
            description: 'Access solved papers and practice real exam formats.',
            icon: <FaFileAlt />,
        },
        {
            title: 'Lecture Videos',
            description: 'Watch engaging lectures from expert instructors.',
            icon: <FaVideo />,
        },
        {
            title: 'Study Notes',
            description: 'Crisp and clear notes for fast revision.',
            icon: <FaBook />,
        },
    ];

    const [searchParams] = useSearchParams();
    const context = useContext(ContentContext);
    const { Notes, getNote } = context;
    const [latestNotes, setLatestNotes] = useState([]);

    const category = searchParams.get('category') || 'sciTechnology';
    useEffect(() => {
        setProgress(0);
        if (localStorage.getItem('token')) {
            getNote(`${GlobalUrls.GETNOTE_URL}?category=${category}`);
        }
        setProgress(100);
        // eslint-disable-next-line
    }, [category]);


    useEffect(() => {
        const filtered = Notes.filter(note =>
            note.tags.some(tag => tag.trim().toLowerCase() === 'latest')
        );
        setLatestNotes(filtered);
        console.log("Filtered Latest Notes:", filtered);
    }, [Notes]);

    return (
        <div className="imps-wrapper">
            <header className="imps-banner">
                <h1>📚 Your Important Study Materials</h1>
                <p>Quickly access essential resources to boost your preparation</p>
            </header>

            <section className="imps-content">
                {imps.map((item, idx) => (
                    <a href="/ImpsPage" className="imps-card" key={idx}>
                        <div className="imps-icon">{item.icon}</div>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                    </a>
                ))}
            </section>

            <section className="px-2">
                <div className="notes-banner">
                    <h2>📘 Latest Important Notes</h2>
                    <p className="notes-subtitle">These are the most recent and relevant study materials.</p>
                </div>
                <div className="container-lg mt-4 mb-5">
                    <div className="row g-4">
                        {latestNotes.length === 0 &&
                            <div className="text-center">
                                <h6 className="d-flex justify-content-center text-muted text-center my-4">No Data Found As Important At Time! Wait or Ask on our whatsapp community channel</h6>
                            </div>
                        }
                        {latestNotes?.map((note) => <NotesIteam key={note._id} notes={note} />)}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ImpsPage;
