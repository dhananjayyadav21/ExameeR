"use client";
import { useState, useCallback, useEffect, Suspense, useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ContentContext from "./ContentContext";
import { getData, postData, patchData, deleteData, putData } from "../services/HttpService";
import * as GlobalUrls from "../utils/GlobalURL";

const RouteChangeTracker = ({ setLoadingCount }) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setLoadingCount(prev => prev + 1);
        const timer = setTimeout(() => {
            setLoadingCount(prev => Math.max(0, prev - 1));
        }, 800);
        return () => clearTimeout(timer);
    }, [pathname, searchParams, setLoadingCount]);

    return null;
};

const ContentState = (props) => {
    const [loadingCount, setLoadingCount] = useState(0);
    const loading = loadingCount > 0;

    // Helper to wrap async functions with loading state
    const withLoading = useCallback(async (fn) => {
        setLoadingCount(prev => prev + 1);
        try {
            return await fn();
        } finally {
            setLoadingCount(prev => Math.max(0, prev - 1));
        }
    }, []);

    //======================================================[ ADD Content ]=========================================
    const addNote = useCallback(async (Data) => {
        return withLoading(async () => {
            try {
                const json = await postData(`${GlobalUrls.ADDNOTE_URL}`, Data);
                if (json.success === true) {
                    setNotes(prev => prev.concat(json.data));
                }
                return json;
            } catch (error) {
                console.log("Do not add Note due to some error", error);
            }
        });
    }, [withLoading]);

    const addPYQ = useCallback(async (Data) => {
        return withLoading(async () => {
            try {
                const json = await postData(`${GlobalUrls.ADDPYQ_URL}`, Data);
                if (json.success === true) {
                    setPYQ(prev => prev.concat(json.data));
                }
                return json;
            } catch (error) {
                console.log("Do not add PYQ due to some error", error);
            }
        });
    }, [withLoading]);

    const addVideo = useCallback(async (Data) => {
        return withLoading(async () => {
            try {
                const json = await postData(`${GlobalUrls.ADDVIDEO_URL}`, Data);
                if (json.success === true) {
                    setVideo(prev => prev.concat(json.data));
                }
                return json;
            } catch (error) {
                console.log("Do not add Video due to some error", error);
            }
        });
    }, [withLoading]);

    const addCourse = useCallback(async (Data) => {
        return withLoading(async () => {
            try {
                const json = await postData(`${GlobalUrls.ADDCOURSE_URL}`, Data);
                if (json.success === true) {
                    setCourse(prev => prev.concat(json.data));
                }
                return json;
            } catch (error) {
                console.log("Do not add Course due to some error", error);
            }
        });
    }, [withLoading]);

    const enrollCourse = useCallback(async (Data) => {
        return withLoading(async () => {
            try {
                const json = await postData(`${GlobalUrls.ENROLLINCOURSE_URL}`, Data);
                if (json.success === true) {
                    setMyLearningCourse(prev => prev.concat(json.courseData));
                }
                return json;
            } catch (error) {
                console.log("Do not enroll in course due to some error", error);
            }
        });
    }, [withLoading]);

    //======================================================[ GET Content ]=========================================
    const getNote = useCallback(async (URL) => {
        return withLoading(async () => {
            try {
                const json = await getData(URL || `${GlobalUrls.GETNOTE_URL}`);
                if (json.success === true) {
                    setNotes(json.data);
                    if (json.myNotes) {
                        setMyNotes(json.myNotes);
                        setdashNotes(json.myNotes);
                    }
                    if (json.allNotes) {
                        setAllNotes(json.allNotes);
                        setdashNotes(json.allNotes);
                    }
                }
                return json;
            } catch (error) {
                console.log("Do not fetch Note due to some error", error);
            }
        });
    }, [withLoading]);

    const getPYQ = useCallback(async (URL) => {
        return withLoading(async () => {
            try {
                const json = await getData(URL || `${GlobalUrls.GETPYQ_URL}`);
                if (json.success === true) {
                    setPYQ(json.data);
                    if (json.myPYQ) {
                        setMyPYQ(json.myPYQ);
                        setdashPYQ(json.myPYQ)
                    }
                    if (json.allPYQ) {
                        setAllPYQ(json.allPYQ);
                        setdashPYQ(json.allPYQ)
                    }
                }
                return json;
            } catch (error) {
                console.log("Do not fetch PYQ due to some error", error);
            }
        });
    }, [withLoading]);

    const getVideo = useCallback(async (URL) => {
        return withLoading(async () => {
            try {
                const json = await getData(URL || `${GlobalUrls.GETVideo_URL}`);
                if (json.success === true) {
                    setVideo(json.data);
                    if (json.myVideo) {
                        setMyVideo(json.myVideo);
                        setdasVideo(json.myVideo);
                    }
                    if (json.allVideo) {
                        setAllVideo(json.allVideo);
                        setdasVideo(json.allVideo);
                    }
                }
                return json;
            } catch (error) {
                console.log("Do not fetch Videos due to some error", error);
            }
        });
    }, [withLoading]);

    const getCourse = useCallback(async (URL) => {
        return withLoading(async () => {
            try {
                const json = await getData(URL || `${GlobalUrls.GETCourse_URL}`);
                if (json.success === true) {
                    setCourse(json.data);
                    if (json.myCourse) {
                        setMyCourse(json.myCourse);
                        setdasCourse(json.myCourse);
                    }
                    if (json.allCourse) {
                        setAllCourse(json.allCourse);
                        setdasCourse(json.allCourse);
                    }
                }
                return json;
            } catch (error) {
                console.log("Do not fetch course due to some error", error);
            }
        });
    }, [withLoading]);

    const getLatestUpload = useCallback(async (URL) => {
        return withLoading(async () => {
            try {
                const json = await getData(URL || `${GlobalUrls.GETLATESTDATA_URL}`);
                if (json.success === true) {
                    setLatestData(json.data);
                }
                return json;
            } catch (error) {
                console.log("Do not fetch setLatest Data due to some error", error);
            }
        });
    }, [withLoading]);

    const getNoteById = useCallback(async (id) => {
        return withLoading(async () => {
            try {
                const json = await getData(`${GlobalUrls.GETNOTE_URL}/${id}`);
                return json;
            } catch (error) {
                console.log("Do not fetch note by id", error);
            }
        });
    }, [withLoading]);

    const getPYQById = useCallback(async (id) => {
        return withLoading(async () => {
            try {
                const json = await getData(`${GlobalUrls.GETPYQ_URL}/${id}`);
                return json;
            } catch (error) {
                console.log("Do not fetch pyq by id", error);
            }
        });
    }, [withLoading]);

    const getVideoById = useCallback(async (id) => {
        return withLoading(async () => {
            try {
                const json = await getData(`${GlobalUrls.GETVideo_URL}/${id}`);
                return json;
            } catch (error) {
                console.log("Do not fetch video by id", error);
            }
        });
    }, [withLoading]);

    const getCourseById = useCallback(async (id) => {
        return withLoading(async () => {
            try {
                const json = await getData(`${GlobalUrls.GETCourse_URL}/${id}`);
                return json;
            } catch (error) {
                console.log("Do not fetch course by id", error);
            }
        });
    }, [withLoading]);

    //======================================================[ Update Content ]=========================================
    const updateNotes = useCallback(async (Data, id) => {
        try {
            const json = await putData(`${GlobalUrls.UPDATENOTES_URL}/${id}`, Data);
            if (json.success) {
                setdashNotes(prev => prev.map(note => note._id === id ? { ...note, ...json.data } : note));
            }
            return json;
        } catch (error) {
            console.log("Do not update note due to some error", error);
        }
    }, []);

    const updatePYQ = useCallback(async (Data, id) => {
        try {
            const json = await putData(`${GlobalUrls.UPDATEPYQS_URL}/${id}`, Data);
            if (json.success) {
                setdashPYQ(prev => prev.map(pyq => pyq._id === id ? { ...pyq, ...json.data } : pyq));
            }
            return json;
        } catch (error) {
            console.log("Do not update pyq due to some error", error);
        }
    }, []);

    const updateVideo = useCallback(async (Data, id) => {
        try {
            const json = await putData(`${GlobalUrls.UPDATEVIDEOS_URL}/${id}`, Data);
            return json;
        } catch (error) {
            console.log("Do not update video due to some error", error);
        }
    }, []);

    const updateCourse = useCallback(async (Data, id) => {
        try {
            const json = await putData(`${GlobalUrls.UPDATECOURSE_URL}/${id}`, Data);
            return json;
        } catch (error) {
            console.log("Do not update course due to some error", error);
        }
    }, []);

    //======================================================[ Delete Content ]=========================================
    const deleteNotes = useCallback(async (id) => {
        return withLoading(async () => {
            try {
                const json = await deleteData(`${GlobalUrls.DELETENOTE_URL}/${id}`);
                return json;
            } catch (error) {
                console.log("Do not delete note due to some error", error);
            }
        });
    }, [withLoading]);

    const deletePYQ = useCallback(async (id) => {
        return withLoading(async () => {
            try {
                const json = await deleteData(`${GlobalUrls.DELETEPYQ_URL}/${id}`);
                return json;
            } catch (error) {
                console.log("Do not delete pyq due to some error", error);
            }
        });
    }, [withLoading]);

    const deleteVideo = useCallback(async (id) => {
        return withLoading(async () => {
            try {
                const json = await deleteData(`${GlobalUrls.DELETEVIDEO_URL}/${id}`);
                return json;
            } catch (error) {
                console.log("Do not delete pyq due to some error", error);
            }
        });
    }, [withLoading]);

    const deleteCourse = useCallback(async (id) => {
        return withLoading(async () => {
            try {
                const json = await deleteData(`${GlobalUrls.DELETECOURSE_URL}/${id}`);
                return json;
            } catch (error) {
                console.log("Do not delete course due to some error", error);
            }
        });
    }, [withLoading]);

    //========================================  [ MY Learning ]=================================================
    const addInMylearning = useCallback(async (Data) => {
        return withLoading(async () => {
            try {
                const json = await postData(`${GlobalUrls.ADDINMYLEARNING_URL}`, Data);
                return json;
            } catch (error) {
                console.log("Do not add in mylearning due to some error", error);
            }
        });
    }, [withLoading]);

    const removeFromMylearning = useCallback(async (Data) => {
        return withLoading(async () => {
            try {
                const json = await postData(`${GlobalUrls.REMOVEFROMMYLEARNING_URL}`, Data);
                return json;
            } catch (error) {
                console.log("Do not remove mylearning data due to some error", error);
            }
        });
    }, [withLoading]);

    const RemoveMyLearningNotes = useCallback((id) => {
        setMyLearningNotes(prev => prev.filter(x => x._id !== id));
    }, []);

    const RemoveMyLearningPYQ = useCallback((id) => {
        setMyLearningPYQ(prev => prev.filter(x => x._id !== id));
    }, []);

    const RemoveMyLearningVideo = useCallback((id) => {
        setMyLearningVideo(prev => prev.filter(x => x._id !== id));
    }, []);

    const getDataFromMyLearning = useCallback(async (URL) => {
        return withLoading(async () => {
            try {
                const json = await getData(URL || `${GlobalUrls.GETDATAFROMMYLEARNING_URL}`);
                if (json.success === true) {
                    setMyLearningNotes(json.notesData);
                    setMyLearningVideo(json.videoData);
                    setMyLearningPYQ(json.pyqData);
                    setMyLearningCourse(json.enrolledCourses);
                }
                return json;
            } catch (error) {
                console.log("Do not fetch MyLearning Data due to some error", error);
            }
        });
    }, [withLoading]);

    //======================================================[ Search Content ]=========================================
    const searchContent = useCallback(async (URL) => {
        return withLoading(async () => {
            try {
                const json = await getData(URL || `${GlobalUrls.SEARCHCONTENT_URL}`);
                return json;
            } catch (error) {
                console.log("Do not fetch search details Data due to some error", error);
            }
        });
    }, [withLoading]);

    //======================================================[ DASHBOARD ]=========================================
    const searchDashContent = useCallback(async (URL) => {
        return withLoading(async () => {
            try {
                const json = await getData(URL || `${GlobalUrls.SEARDASHCHCONTENT_URL}`);
                if (json.type === "notes") {
                    setdashNotes(json.results);
                }
                if (json.type === "pyq") {
                    setdashPYQ(json.results);
                }
                if (json.type === "video") {
                    setdasVideo(json.results);
                }
                if (json.type === "course") {
                    setdasCourse(json.results);
                }
                return json;
            } catch (error) {
                console.log("Do not fetch dashContent Data due to some error", error);
            }
        });
    }, [withLoading]);

    const getdashAnalytics = useCallback(async (URL) => {
        return withLoading(async () => {
            try {
                const json = await getData(URL || `${GlobalUrls.DASHANALYTICS_URL}`);
                if (json.success === true) {
                    setDashAnalytics(json);
                }
                return json;
            } catch (error) {
                console.log("Do not fetch dash analytics due to some error", error);
            }
        });
    }, [withLoading]);

    const getStudentsByRole = useCallback(async (URL) => {
        return withLoading(async () => {
            try {
                const json = await getData(URL || `${GlobalUrls.GETSTUDENTSBYROLE_URL}`);
                if (json.success === true) {
                    setStudentsByRole(json.students);
                }
                return json;
            } catch (error) {
                console.log("Do not fetch students due to some error", error);
            }
        });
    }, [withLoading]);

    const addStudent = useCallback(async (Data) => {
        return withLoading(async () => {
            try {
                const json = await postData(`${GlobalUrls.ADDSTUDENS_URL}`, Data);
                if (json.success === true) {
                    setStudentsByRole(prev => prev.concat(json.user));
                }
                return json;
            } catch (error) {
                console.log("Do not add student due to some error", error);
            }
        });
    }, [withLoading]);

    const updateStudent = useCallback(async (Data, id) => {
        return withLoading(async () => {
            try {
                const json = await putData(`${GlobalUrls.UPDATESTUDENT_URL}/${id}`, Data);
                return json;
            } catch (error) {
                console.log("Do not update student due to some error", error);
            }
        });
    }, [withLoading]);

    const deleteStudent = useCallback(async (id) => {
        return withLoading(async () => {
            try {
                const json = await deleteData(`${GlobalUrls.DELETESTUDENT_URL}/${id}`);
                return json;
            } catch (error) {
                console.log("Do not delete student due to some error", error);
            }
        });
    }, [withLoading]);

    const changeStudentStatus = useCallback(async (id) => {
        return withLoading(async () => {
            try {
                const json = await patchData(`${GlobalUrls.CHANGESTUDENTSTATUS_URL}/${id}`);
                getStudentsByRole();
                return json;
            } catch (error) {
                console.log("Do not change student status due to some error", error);
            }
        });
    }, [withLoading, getStudentsByRole]);

    //-------------[ Announce ] ----------------------------------
    const getAllUser = useCallback(async (URL) => {
        try {
            const json = await getData(URL || `${GlobalUrls.GETALLUSER_URL}`);
            if (json.success === true) {
                setAllUser(json.data);
            }
            return json;
        } catch (error) {
            console.log("Do not fetch All user due to some error", error);
        }
    }, []);

    const sendAnnounceMent = useCallback(async (Data) => {
        return withLoading(async () => {
            try {
                const json = await postData(`${GlobalUrls.SENDANNOUNCEMENT_URL}`, Data);
                return json;
            } catch (error) {
                console.log("Do not Send announcsment due to some error", error);
            }
        });
    }, [withLoading]);

    const getUser = useCallback(async () => {
        return withLoading(async () => {
            try {
                const json = await getData(`${GlobalUrls.GETUSER_URL}`);
                if (json.success === true) {
                    setUserData(json.user);
                    localStorage.setItem("Username", json.user.Username);
                    localStorage.setItem("Profile", json.user.Profile || "");
                }
                return json;
            } catch (error) {
                console.log("Do not fetch user due to some error", error);
            }
        });
    }, [withLoading]);

    const getUsage = useCallback(async () => {
        return withLoading(async () => {
            try {
                const json = await getData(`${GlobalUrls.GET_USAGE_URL}`);
                if (json.success === true) {
                    setUsage(json.usage || { mockTestsTaken: 0, callsBooked: 0 });
                }
                return json;
            } catch (error) {
                console.log("Do not fetch usage due to some error", error);
            }
        });
    }, [withLoading]);

    const recordUsage = useCallback(async (feature) => {
        try {
            const json = await postData(`${GlobalUrls.GET_USAGE_URL}`, { feature });
            if (json.success === true) {
                setUsage(json.usage);
            }
            return json;
        } catch (error) {
            console.log("Do not record usage due to some error", error);
        }
    }, []);

    const updateProfile = useCallback(async (Data) => {
        return withLoading(async () => {
            try {
                const json = await putData(`${GlobalUrls.UPDATEPROFILE_URL}`, Data);
                if (json.success === true) {
                    setUserData(json.user);
                    localStorage.setItem("Username", json.user.Username);
                    localStorage.setItem("Profile", json.user.Profile || "");
                }
                return json;
            } catch (error) {
                console.log("Do not update profile due to some error", error);
            }
        });
    }, [withLoading]);

    const updatePassword = useCallback(async (Data) => {
        try {
            const json = await postData(`${GlobalUrls.UPDATEPASSWORD_URL}`, Data);
            return json;
        } catch (error) {
            console.log("Do not update password due to some error", error);
        }
    }, []);

    const deleteAccount = useCallback(async () => {
        try {
            const json = await deleteData(`${GlobalUrls.DELETEACCOUNT_URL}`);
            return json;
        } catch (error) {
            console.log("Do not delete account due to some error", error);
        }
    }, []);

    const [Notes, setNotes] = useState([]);
    const [MyNotes, setMyNotes] = useState([]);
    const [AllNotes, setAllNotes] = useState([]);
    const [PYQS, setPYQ] = useState([]);
    const [MyPYQS, setMyPYQ] = useState([]);
    const [AllPYQS, setAllPYQ] = useState([]);
    const [Video, setVideo] = useState([]);
    const [MyVideo, setMyVideo] = useState([]);
    const [AllVideo, setAllVideo] = useState([]);
    const [Course, setCourse] = useState([]);
    const [MyCourse, setMyCourse] = useState([]);
    const [AllCourse, setAllCourse] = useState([]);
    const [LatestData, setLatestData] = useState([]);
    const [MyLearningNotes, setMyLearningNotes] = useState([]);
    const [MyLearningVideo, setMyLearningVideo] = useState([]);
    const [MyLearningPYQ, setMyLearningPYQ] = useState([]);
    const [MyLearningCourse, setMyLearningCourse] = useState([]);
    const [searchContentData, setSearchContentData] = useState([]);
    const [dashNotes, setdashNotes] = useState([]);
    const [dashPYQ, setdashPYQ] = useState([]);
    const [dasVideo, setdasVideo] = useState([]);
    const [dasCourse, setdasCourse] = useState([]);
    const [dashAnalytics, setDashAnalytics] = useState([]);
    const [studentsByRole, setStudentsByRole] = useState([]);
    const [usage, setUsage] = useState({ mockTestsTaken: 0, callsBooked: 0 });
    const [allUser, setAllUser] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [userData, setUserData] = useState(null);
    const [globalSearch, setGlobalSearch] = useState('');

    const contextValue = useMemo(() => ({
        Notes, MyNotes, AllNotes, PYQS, MyPYQS, AllPYQS, Video, MyVideo, AllVideo, Course, MyCourse, AllCourse,
        LatestData,
        addNote, getNote, addPYQ, getPYQ, addVideo, getVideo, addCourse, getCourse, getLatestUpload,
        getNoteById, getPYQById, getVideoById, getCourseById,
        updateNotes, updatePYQ, updateVideo, updateCourse,
        deleteNotes, deletePYQ, deleteVideo, deleteCourse,
        addInMylearning, removeFromMylearning, getDataFromMyLearning, MyLearningNotes, MyLearningVideo, MyLearningPYQ, RemoveMyLearningNotes, RemoveMyLearningPYQ, RemoveMyLearningVideo,
        searchContent, setSearchContentData, searchContentData,
        searchDashContent, dashNotes, dashPYQ, dasVideo, dasCourse,
        getdashAnalytics, dashAnalytics, getStudentsByRole, studentsByRole, addStudent, updateStudent, deleteStudent, changeStudentStatus,
        getAllUser, allUser, sendAnnounceMent,
        enrollCourse, MyLearningCourse,
        selectedCourse, setSelectedCourse,
        selectedPlan, setSelectedPlan,
        getUser, updateProfile, updatePassword, deleteAccount, userData,
        getUsage, recordUsage, usage,
        globalSearch, setGlobalSearch,
        loading
    }), [
        Notes, MyNotes, AllNotes, PYQS, MyPYQS, AllPYQS, Video, MyVideo, AllVideo, Course, MyCourse, AllCourse,
        LatestData, MyLearningNotes, MyLearningVideo, MyLearningPYQ, searchContentData,
        dashNotes, dashPYQ, dasVideo, dasCourse, dashAnalytics, studentsByRole, allUser,
        MyLearningCourse, selectedCourse, selectedPlan, userData, usage, globalSearch, loading,
        addNote, getNote, addPYQ, getPYQ, addVideo, getVideo, addCourse, getCourse, getLatestUpload,
        getNoteById, getPYQById, getVideoById, getCourseById, updateNotes, updatePYQ, updateVideo,
        updateCourse, deleteNotes, deletePYQ, deleteVideo, deleteCourse, addInMylearning,
        removeFromMylearning, RemoveMyLearningNotes, RemoveMyLearningPYQ, RemoveMyLearningVideo,
        getDataFromMyLearning, searchContent, searchDashContent, getdashAnalytics,
        getStudentsByRole, addStudent, updateStudent, deleteStudent, changeStudentStatus,
        getAllUser, sendAnnounceMent, enrollCourse, getUser, updateProfile, updatePassword,
        deleteAccount, getUsage, recordUsage, setGlobalSearch
    ]);

    return (
        <ContentContext.Provider value={contextValue}>
            <Suspense fallback={null}>
                <RouteChangeTracker setLoadingCount={setLoadingCount} />
            </Suspense>
            {props.children}
        </ContentContext.Provider>
    );
};

export default ContentState;
