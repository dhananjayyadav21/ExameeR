import React, { useContext, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ContentContext from '../../context/ContentContext';
import NotesItem from '../NotesItem';
import VideoItem from '../VideoItem';
import QPaperItem from '../QPaperItem';
import CourceIteam from './CourceIteam';
import DriveUpload from '../../utils/DriveUpload';
import { toast } from 'react-toastify';
import hasUserRole from '../../utils/hasUserRole';

const LoggedInHome = ({ userData }) => {
    const context = useContext(ContentContext);
    const { Course, getCourse, Notes, getNote, PYQS, getPYQ, Video, getVideo, updateProfile } = context;
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('Course');
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        location: '',
        course: '',
        university: '',
        semester: ''
    });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    const router = useRouter();
    const dropdownRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const isSpecialUser = hasUserRole('instructor', 'admin');

    useEffect(() => {
        getCourse();
        getNote();
        getPYQ();
        getVideo();

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (userData) {
            setProfileData({
                firstName: userData.FirstName || '',
                lastName: userData.LastName || '',
                phone: userData.Phone || '',
                location: userData.Location || '',
                course: userData.Course || '',
                university: userData.University || '',
                semester: userData.Semester || ''
            });
        }
    }, [userData, activeTab]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const result = await DriveUpload(file);
            if (result?.success && result?.fileId) {
                // Instantly save it to backend using updateProfile context 
                const res = await updateProfile({ ...userData, Profile: result.fileId });
                if (res?.success) toast.success("New avatar selected and saved!");
                else toast.error("Failed to save new avatar to profile.");
            } else {
                toast.error("Failed to upload avatar.");
            }
        } catch (error) {
            toast.error("An error occurred during upload.");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        const res = await updateProfile({
            FirstName: profileData.firstName,
            LastName: profileData.lastName,
            Phone: profileData.phone,
            Location: profileData.location,
            Course: profileData.course,
            University: profileData.university,
            Semester: profileData.semester
        });

        if (res?.success) {
            toast.success("Profile updated successfully!");
            setIsEditing(false);
        } else {
            toast.error(res?.message || "Profile update failed. Try again.");
        }
        setSaving(false);
    };

    const handleLogout = () => {
        localStorage.clear();
        toast.info("Logged out successfully");
        router.push('/login');
    };

    const sidebarMenu = [
        {
            section: "LEARN Today",
            items: [
                { label: "Notes", icon: "fa-file-lines", id: "Notes" },
                { label: "PYQ", icon: "fa-circle-question", id: "PYQ" },
                { label: "Video", icon: "fa-circle-play", id: "Video" },
            ]
        },
        {
            section: "MY ACCOUNT",
            items: [
                { label: "My Library", icon: "fa-book-open", id: "Library" },
                { label: "My Profile", icon: "fa-user-circle", id: "Profile" },
            ]
        },
        {
            section: "STUDY PACKS",
            items: [
                { label: "Course", icon: "fa-layer-group", id: "Course" },
                { label: "Mock Test", icon: "fa-vial", id: "Mock Test" },
            ]
        },
        {
            section: "EXPLORE EXAMEE",
            items: [
                { label: "Examee Books", icon: "fa-book", id: "Books" },
                { label: "Call Book", icon: "fa-headset", id: "Call" },
            ]
        }
    ];

    const handleMenuClick = (item) => {
        setActiveTab(item.id);
    };

    const getCurrentData = () => {
        switch (activeTab) {
            case 'Notes': return Notes;
            case 'PYQ': return PYQS;
            case 'Video': return Video;
            case 'Course': return Course;
            case 'Library': {
                const savedCourses = Course.filter(i => i.isWatching).map(i => ({ ...i, type: 'Course' }));
                const savedNotes = Notes.filter(i => i.isWatching).map(i => ({ ...i, type: 'Notes' }));
                const savedPYQs = PYQS.filter(i => i.isWatching).map(i => ({ ...i, type: 'PYQ' }));
                const savedVideos = Video.filter(i => i.isWatching).map(i => ({ ...i, type: 'Video' }));
                return [...savedCourses, ...savedNotes, ...savedPYQs, ...savedVideos];
            }
            case 'Profile': return [];
            default: return [];
        }
    };

    const currentData = getCurrentData();

    const filteredData = currentData.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.courseLevel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getBatchColor = (idx) => {
        const colors = ['#e1f5fe', '#fff9c4', '#e8f5e9', '#f3e5f5'];
        return colors[idx % colors.length];
    };

    const getDisplayTitle = (item) => {
        if (activeTab === 'Library') return item.type?.toUpperCase() || 'SAVED';
        if (activeTab === 'Notes') return 'NOTES';
        if (activeTab === 'PYQ') return 'PYQ';
        if (activeTab === 'Video') return 'VIDEO';
        return item.courseLevel || 'BATCH';
    }

    return (
        <div className="li-home-wrapper">
            {/* Sidebar */}
            <aside className="li-sidebar shadow-sm">
                <div className="px-4 mb-5 pt-3">
                    <Link href="/" className="text-decoration-none d-flex align-items-center gap-2">
                        <img src="/assets/img/brandlog.png" alt="Examee" style={{ height: "32px", width: "auto" }} />
                    </Link>
                </div>

                {sidebarMenu.map((sec, idx) => (
                    <div key={idx} className="li-nav-section">
                        <p className="li-section-label">{sec.section}</p>
                        {sec.items.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => handleMenuClick(item)}
                                className={`li-menu-item w-100 border-0 bg-transparent text-start ${activeTab === item.id ? 'li-menu-item--active' : ''}`}
                            >
                                <span className="li-menu-icon"><i className={`fa-solid ${item.icon}`}></i></span>
                                <span>{item.label}</span>
                                {item.badge && <span className="li-badge-new">{item.badge}</span>}
                            </button>
                        ))}
                    </div>
                ))}

                {/* Sidebar Support Card */}
                <div className="mx-3 mt-4 p-3 rounded-4 bg-light border opacity-75 d-none d-xl-block">
                    <p className="fw-bold small mb-1">Need help?</p>
                    <p className="smaller text-muted mb-2">Get 24/7 priority support from Examee Team.</p>
                    <button className="btn btn-dark w-100 rounded-pill btn-sm py-1 fw-bold smaller">Get Support</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="li-main">
                <header className="li-header">
                    <div className="d-flex align-items-center gap-4">
                        <h6 className="fw-bold mb-0 text-dark">Exploration / <span className="text-dark">{activeTab}</span></h6>
                        <div className="li-search-box">
                            <i className="fa-solid fa-magnifying-glass text-muted small"></i>
                            <input
                                type="text"
                                placeholder={`Search through our library...`}
                                className="li-search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="li-user-greet">
                        <div className="d-flex align-items-center me-3 gap-3 d-none d-md-flex">
                            <div className="btn btn-light rounded-circle shadow-sm border p-2" style={{ width: '40px', height: '40px' }}>
                                <i className="fa-regular fa-bell"></i>
                            </div>
                            <div className="dropdown" ref={dropdownRef}>
                                <button
                                    className="btn btn-light rounded-circle shadow-sm border p-2"
                                    style={{ width: '40px', height: '40px' }}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <i className="fa-solid fa-gear"></i>
                                </button>
                                {isDropdownOpen && (
                                    <div className="dropdown-menu show shadow border-0 p-2 mt-2 position-absolute end-0 rounded-4 animate-fade-in" style={{ minWidth: '220px', zIndex: 1050 }}>
                                        <div className="px-3 py-2 border-bottom mb-2">
                                            <p className="fw-bold mb-0 smaller text-dark">{userData?.FirstName} {userData?.LastName}</p>
                                            <p className="text-muted mb-0" style={{ fontSize: '0.7rem' }}>{userData?.Email}</p>
                                        </div>
                                        <Link href="/profile" className="dropdown-item rounded-3 py-2 d-flex align-items-center gap-2">
                                            <i className="fa-regular fa-user-circle opacity-50"></i> My Profile
                                        </Link>
                                        <Link href="/myLearning" className="dropdown-item rounded-3 py-2 d-flex align-items-center gap-2">
                                            <i className="fa-solid fa-book-open opacity-50"></i> My Library
                                        </Link>
                                        {isSpecialUser && (
                                            <Link href="/dashboard" className="dropdown-item rounded-3 py-2 d-flex align-items-center gap-2 text-primary fw-bold">
                                                <i className="fa-solid fa-gauge-high"></i> Instructor Dashboard
                                            </Link>
                                        )}
                                        <div className="dropdown-divider mx-2"></div>
                                        <button onClick={handleLogout} className="dropdown-item rounded-3 py-2 d-flex align-items-center gap-2 text-danger">
                                            <i className="fa-solid fa-arrow-right-from-bracket opacity-50"></i> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="li-greet-text">
                            <p className="li-greet-hi fw-bold">Hi, {userData?.FirstName || 'dhananjay'}</p>
                            <p className="smaller text-success mb-0 fw-bold"><i className="fa-solid fa-circle small me-1" style={{ fontSize: '0.5rem' }}></i>Pro Student</p>
                        </div>
                        <img
                            src={userData?.Profile ? (userData.Profile.startsWith('http') ? userData.Profile : `https://lh3.googleusercontent.com/d/${userData.Profile}`) : "/assets/img/Avtar.jpg"}
                            className="li-user-avatar border-2 shadow-sm"
                            alt="User"
                        />
                    </div>
                </header>

                <div className="px-5 py-4">
                    {activeTab === 'Profile' ? (
                        <div className="row g-4">
                            {/* Left Sidebar: Profile Info */}
                            <div className="col-lg-3">
                                <div className="text-center animate-fade-in">
                                    {/* Avatar Section */}
                                    <div className="position-relative d-inline-block mb-3">
                                        <div className="rounded-circle mx-auto" style={{ width: '150px', height: '150px', border: '8px solid #febd2f', padding: '0' }}>
                                            <div className="rounded-circle overflow-hidden h-100 w-100 bg-white">
                                                <img
                                                    src={userData?.Profile ? (userData.Profile.startsWith('http') ? userData.Profile : `https://lh3.googleusercontent.com/d/${userData.Profile}`) : "/assets/img/Avtar.jpg"}
                                                    alt="Profile"
                                                    className="w-100 h-100"
                                                    style={{ objectFit: 'cover' }}
                                                    onError={(e) => { e.target.src = "/assets/img/Avtar.jpg"; }}
                                                />
                                            </div>
                                        </div>
                                        {/* Camera Icon Overlay */}
                                        <label className="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                            style={{ width: '42px', height: '42px', background: '#6366f1', border: '3px solid #fff', cursor: uploading ? 'wait' : 'pointer', transform: 'translate(-5px, -5px)' }}>
                                            {uploading ? (
                                                <div className="spinner-border spinner-border-sm text-white" role="status"></div>
                                            ) : (
                                                <i className="fa-solid fa-camera text-white" style={{ fontSize: '1.1rem' }}></i>
                                            )}
                                            <input type="file" hidden accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                                        </label>
                                    </div>

                                    <h4 className="fw-bold text-dark mt-2 mb-3">
                                        {((userData?.FirstName || "neel") + " " + (userData?.LastName || "sinh")).toLowerCase()}
                                    </h4>

                                    <div className="mt-2">
                                        <div className="badge rounded-pill d-inline-flex align-items-center px-4 py-2" style={{ color: '#854d0e', backgroundColor: '#fffcf0', border: '1px solid #fef3c7' }}>
                                            <i className="fa-solid fa-shield-halved me-2" style={{ color: '#a16207' }}></i>
                                            <span className="fw-bold">Level 1</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Main Content */}
                            <div className="col-lg-9">
                                {/* Level Up Overview */}
                                <section className="mb-4">
                                    <div className="rounded-4 p-4" style={{ backgroundColor: '#f0f4ff' }}>
                                        <h6 className="fw-bold text-dark mb-3">Level Up Overview</h6>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <span className="text-muted fw-bold small opacity-75">Total XP</span>
                                                        <i className="fa-regular fa-circle-question text-muted small"></i>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <h2 className="fw-bold mb-0">0</h2>
                                                        <div className="bg-light rounded-circle p-1 d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                                                            <img src="https://cdn-icons-png.flaticon.com/512/8064/8064438.png" alt="XP" style={{ width: '20px', height: '20px' }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <span className="text-muted fw-bold small opacity-75">Highest Level</span>
                                                        <i className="fa-regular fa-circle-question text-muted small"></i>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <h2 className="fw-bold mb-0">Level 1</h2>
                                                        <i className="fa-solid fa-shield-halved text-warning"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Profile Detail Section */}
                                <section className="bg-white rounded-4 p-2">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h5 className="fw-bold text-dark mb-0">Profile Detail</h5>
                                        {isEditing ? (
                                            <div className="d-flex gap-2">
                                                <button onClick={() => setIsEditing(false)} className="btn btn-light btn-sm fw-bold px-3 rounded-pill" disabled={saving}>Cancel</button>
                                                <button onClick={handleSave} className="btn btn-primary btn-sm fw-bold px-3 rounded-pill" disabled={saving}>
                                                    {saving ? 'Saving...' : 'Save'}
                                                </button>
                                            </div>
                                        ) : (
                                            <button onClick={() => setIsEditing(true)} className="btn btn-link text-decoration-none d-flex align-items-center gap-1 fw-bold p-0" style={{ color: '#6366f1', fontSize: '0.9rem' }}>
                                                <i className="fa-solid fa-pen-to-square"></i> Edit
                                            </button>
                                        )}
                                    </div>

                                    {/* Personal Details divider style */}
                                    <div className="mb-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <span className="text-muted small fw-bold text-uppercase pe-3" style={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>Personal Details</span>
                                            <div className="w-100 border-bottom opacity-10"></div>
                                        </div>

                                        <div className="row g-2 px-1">
                                            {!isEditing ? (
                                                [
                                                    {
                                                        label: 'Name', value: (
                                                            <div className="d-flex align-items-center gap-2">
                                                                <span className="fw-bold">{(userData?.FirstName + " " + (userData?.LastName || "")).toLowerCase()}</span>
                                                                <span className="badge rounded-pill px-2 py-1" style={{ fontSize: '0.65rem', backgroundColor: '#eef2ff', color: '#6366f1', fontWeight: 'bold' }}>
                                                                    <i className="fa-solid fa-square-check me-1"></i> PW Student Master
                                                                </span>
                                                            </div>
                                                        )
                                                    },
                                                    { label: 'Mobile No', value: userData?.Phone || "9769565004" },
                                                    { label: 'Email', value: userData?.Email || "N/A" },
                                                    { label: 'Living City/Village/Town', value: userData?.Location || "N/A" }
                                                ].map((row, i) => (
                                                    <div key={i} className="col-12 d-flex align-items-start py-1">
                                                        <div className="text-muted small" style={{ minWidth: '220px', fontSize: '0.85rem' }}>{row.label}</div>
                                                        <div className="text-dark fw-medium small flex-grow-1" style={{ fontSize: '0.85rem' }}>{row.value}</div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <label className="form-label small text-muted">First Name</label>
                                                        <input type="text" name="firstName" value={profileData.firstName} onChange={handleProfileChange} className="form-control form-control-sm border-0 bg-light" placeholder="First Name" />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label small text-muted">Last Name</label>
                                                        <input type="text" name="lastName" value={profileData.lastName} onChange={handleProfileChange} className="form-control form-control-sm border-0 bg-light" placeholder="Last Name" />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label small text-muted">Mobile No</label>
                                                        <input type="text" name="phone" value={profileData.phone} onChange={handleProfileChange} className="form-control form-control-sm border-0 bg-light" placeholder="Phone" />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label small text-muted">Living City/Village/Town</label>
                                                        <input type="text" name="location" value={profileData.location} onChange={handleProfileChange} className="form-control form-control-sm border-0 bg-light" placeholder="Location" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Academic Details divider style */}
                                    <div className="mb-4">
                                        <div className="d-flex align-items-center mb-3">
                                            <span className="text-muted small fw-bold text-uppercase pe-3" style={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>Academic Details</span>
                                            <div className="w-100 border-bottom opacity-10"></div>
                                        </div>

                                        <div className="row g-2 px-1">
                                            {!isEditing ? (
                                                [
                                                    { label: 'Class', value: userData?.Semester || "12+" },
                                                    { label: 'Board/State Board', value: userData?.University || "STATE BOARD" },
                                                    { label: 'Exams', value: userData?.Course || "GATE" },
                                                    { label: 'Language', value: "English" }
                                                ].map((row, i) => (
                                                    <div key={i} className="col-12 d-flex align-items-start py-1">
                                                        <div className="text-muted small" style={{ minWidth: '220px', fontSize: '0.85rem' }}>{row.label}</div>
                                                        <div className="text-dark fw-medium small flex-grow-1" style={{ fontSize: '0.85rem' }}>{row.value}</div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="row g-3">
                                                    <div className="col-md-6">
                                                        <label className="form-label small text-muted">Class/Semester</label>
                                                        <input type="text" name="semester" value={profileData.semester} onChange={handleProfileChange} className="form-control form-control-sm border-0 bg-light" placeholder="Class" />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label small text-muted">Board/State Board</label>
                                                        <input type="text" name="university" value={profileData.university} onChange={handleProfileChange} className="form-control form-control-sm border-0 bg-light" placeholder="Board" />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label small text-muted">Exams</label>
                                                        <input type="text" name="course" value={profileData.course} onChange={handleProfileChange} className="form-control form-control-sm border-0 bg-light" placeholder="Exams" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bottom Footer Section */}
                                    <div className="mt-5 pt-3 border-top d-flex justify-content-between align-items-center">
                                        <h6 className="fw-bold text-dark mb-0" style={{ fontSize: '0.9rem' }}>Performance as Doubt Solver</h6>
                                        <a href="#" className="text-decoration-none small fw-bold" style={{ color: '#0ea5e9' }}>Know more</a>
                                    </div>
                                </section>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4">
                                <p className="fw-bold text-muted small mb-1 ls-wide" style={{ letterSpacing: '0.05em' }}>
                                    {activeTab === 'Library' ? 'My Saved Content' : (activeTab === 'Course' ? 'Batches' : 'Study Packs')}
                                </p>
                                <h2 className="fw-black mb-1" style={{ fontSize: '1.8rem' }}>
                                    {activeTab === 'Library' ? 'Content Library' : `All ${activeTab}s`}
                                </h2>
                                <p className="text-muted small">{filteredData.length} {activeTab.toLowerCase()}s available</p>
                            </div>

                            <div className="d-flex gap-2 mb-4">
                                <button className="btn btn-white rounded-pill border px-3 py-1 btn-sm d-flex align-items-center gap-2 fw-bold shadow-sm">
                                    Filter <i className="fa-solid fa-sliders small"></i>
                                </button>
                                <button className="btn btn-white rounded-pill border px-3 py-1 btn-sm fw-bold shadow-sm">Online</button>
                            </div>

                            <div className="row g-4 mt-2">
                                {filteredData.map((item, idx) => (
                                    <div key={idx} className="col-xl-3 col-lg-4 col-md-6 animate-scale-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                                        {(activeTab === 'Notes' || item.type === 'Notes') && <NotesItem notes={item} />}
                                        {(activeTab === 'PYQ' || item.type === 'PYQ') && <QPaperItem pyq={item} />}
                                        {(activeTab === 'Video' || item.type === 'Video') && <VideoItem video={item} />}
                                        {(activeTab === 'Course' || item.type === 'Course') && <CourceIteam Course={item} />}
                                        {activeTab === 'Mock Test' && (
                                            <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center">
                                                <div className="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                                    <i className="fa-solid fa-vial fs-4 text-muted"></i>
                                                </div>
                                                <h6 className="fw-bold mb-1">Practice Test</h6>
                                                <p className="smaller text-muted mb-3">{item.title || "Subject Mock Test"}</p>
                                                <button className="btn btn-outline-dark rounded-pill btn-sm fw-bold">Start Test</button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {filteredData.length === 0 && (
                                <div className="text-center py-5 bg-light rounded-5 mt-4 border border-dashed">
                                    <div className="bg-white shadow-sm rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                                        <i className="fa-solid fa-magnifying-glass fs-2 text-muted opacity-50"></i>
                                    </div>
                                    <h4 className="fw-bold text-dark mb-1">No {activeTab} Found</h4>
                                    <p className="text-muted">We couldn't find any results matching your search criteria.</p>
                                    <button className="btn btn-purple-primary rounded-pill px-4 fw-bold mt-2" onClick={() => setSearchTerm('')} style={{ backgroundColor: '#7c3aed', color: '#fff', border: 'none' }}>Clear Search</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            <style jsx>{`
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .text-dark { color: #1e293b !important; }
            `}</style>
        </div>
    );
};

export default LoggedInHome;
