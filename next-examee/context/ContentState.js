"use client";
import { useState } from "react";
import ContentContext from "./ContentContext";
import { getData, postData, patchData, deleteData, putData } from "../services/HttpService";
import * as GlobalUrls from "../utils/GlobalURL";

const ContentState = (props) => {

    //======================================================[ ADD Content ]=========================================
    const addNote = async (Data) => {
        try {
            const json = await postData(`${GlobalUrls.ADDNOTE_URL}`, Data);
            if (json.success === true) {
                setNotes(Notes.concat(json.data));
            }
            return json;
        } catch (error) {
            console.log("Do not add Note due to some error", error);
        }
    };

    const addPYQ = async (Data) => {
        try {
            const json = await postData(`${GlobalUrls.ADDPYQ_URL}`, Data);
            if (json.success === true) {
                setPYQ(PYQS.concat(json.data));
            }
            return json;
        } catch (error) {
            console.log("Do not add PYQ due to some error", error);
        }
    };

    const addVideo = async (Data) => {
        try {
            const json = await postData(`${GlobalUrls.ADDVIDEO_URL}`, Data);
            if (json.success === true) {
                setVideo(Video.concat(json.data));
            }
            return json;
        } catch (error) {
            console.log("Do not add Video due to some error", error);
        }
    };

    const addCourse = async (Data) => {
        try {
            const json = await postData(`${GlobalUrls.ADDCOURSE_URL}`, Data);
            if (json.success === true) {
                setCourse(Course.concat(json.data));
            }
            return json;
        } catch (error) {
            console.log("Do not add Course due to some error", error);
        }
    };

    const enrollCourse = async (Data) => {
        try {
            const json = await postData(`${GlobalUrls.ENROLLINCOURSE_URL}`, Data);
            if (json.success === true) {
                setMyLearningCourse(MyLearningCourse.concat(json.courseData));
            }
            return json;
        } catch (error) {
            console.log("Do not enroll in course due to some error", error);
        }
    };

    //======================================================[ GET Content ]=========================================
    const getNote = async (URL) => {
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
    };

    const getPYQ = async (URL) => {
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
    };

    const getVideo = async (URL) => {
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
            console.log("Do not fetch PYQ due to some error", error);
        }
    };

    const getCourse = async (URL) => {
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
    };

    const getLatestUpload = async (URL) => {
        try {
            const json = await getData(URL || `${GlobalUrls.GETLATESTDATA_URL}`);
            if (json.success === true) {
                setLatestData(json.data);
            }
            return json;
        } catch (error) {
            console.log("Do not fetch setLatest Data due to some error", error);
        }
    };

    //======================================================[ Update Content ]=========================================
    const updateNotes = async (Data, id) => {
        try {
            const json = await putData(`${GlobalUrls.UPDATENOTES_URL}/${id}`, Data);
            return json;
        } catch (error) {
            console.log("Do not update note due to some error", error);
        }
    };

    const updatePYQ = async (Data, id) => {
        try {
            const json = await putData(`${GlobalUrls.UPDATEPYQS_URL}/${id}`, Data);
            return json;
        } catch (error) {
            console.log("Do not update pyq due to some error", error);
        }
    };

    const updateVideo = async (Data, id) => {
        try {
            const json = await putData(`${GlobalUrls.UPDATEVIDEOS_URL}/${id}`, Data);
            return json;
        } catch (error) {
            console.log("Do not update video due to some error", error);
        }
    };

    const updateCourse = async (Data, id) => {
        try {
            const json = await putData(`${GlobalUrls.UPDATECOURSE_URL}/${id}`, Data);
            return json;
        } catch (error) {
            console.log("Do not update course due to some error", error);
        }
    };

    //======================================================[ Delete Content ]=========================================
    const deleteNotes = async (id) => {
        try {
            const json = await deleteData(`${GlobalUrls.DELETENOTE_URL}/${id}`);
            return json;
        } catch (error) {
            console.log("Do not delete note due to some error", error);
        }
    };

    const deletePYQ = async (id) => {
        try {
            const json = await deleteData(`${GlobalUrls.DELETEPYQ_URL}/${id}`);
            return json;
        } catch (error) {
            console.log("Do not delete pyq due to some error", error);
        }
    };

    const deleteVideo = async (id) => {
        try {
            const json = await deleteData(`${GlobalUrls.DELETEVIDEO_URL}/${id}`);
            return json;
        } catch (error) {
            console.log("Do not delete pyq due to some error", error);
        }
    };

    const deleteCourse = async (id) => {
        try {
            const json = await deleteData(`${GlobalUrls.DELETECOURSE_URL}/${id}`);
            return json;
        } catch (error) {
            console.log("Do not delete course due to some error", error);
        }
    };

    //========================================  [ MY Learning ]=================================================
    const addInMylearning = async (Data) => {
        try {
            const json = await postData(`${GlobalUrls.ADDINMYLEARNING_URL}`, Data);
            return json;
        } catch (error) {
            console.log("Do not add in mylearning due to some error", error);
        }
    };

    const removeFromMylearning = async (Data) => {
        try {
            const json = await postData(`${GlobalUrls.REMOVEFROMMYLEARNING_URL}`, Data);
            return json;
        } catch (error) {
            console.log("Do not remove mylearning data due to some error", error);
        }
    };

    const RemoveMyLearningNotes = async (id) => {
        const filtered = MyLearningNotes.filter(x => x._id !== id) ?? [];
        setMyLearningNotes(filtered)
    }

    const RemoveMyLearningPYQ = async (id) => {
        const filtered = MyLearningPYQ.filter(x => x._id !== id) ?? [];
        setMyLearningPYQ(filtered)
    }

    const RemoveMyLearningVideo = async (id) => {
        const filtered = MyLearningVideo.filter(x => x._id !== id) ?? [];
        setMyLearningVideo(filtered)
    }

    const getDataFromMyLearning = async (URL) => {
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
            console.log("Do not fetch setLatest Data due to some error", error);
        }
    };

    //======================================================[ Search Content ]=========================================
    const searchContent = async (URL) => {
        try {
            const json = await getData(URL || `${GlobalUrls.SEARCHCONTENT_URL}`);
            return json;
        } catch (error) {
            console.log("Do not fetch search details Data due to some error", error);
        }
    };

    //======================================================[ DASHBOARD ]=========================================
    const searchDashContent = async (URL) => {
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
    };

    const getdashAnalytics = async (URL) => {
        try {
            const json = await getData(URL || `${GlobalUrls.DASHANALYTICS_URL}`);
            if (json.success === true) {
                setDashAnalytics(json);
            }
            return json;
        } catch (error) {
            console.log("Do not fetch dash analytics due to some error", error);
        }
    };

    const getStudentsByRole = async (URL) => {
        try {
            const json = await getData(URL || `${GlobalUrls.GETSTUDENTSBYROLE_URL}`);
            if (json.success === true) {
                setStudentsByRole(json.students);
            }
            return json;
        } catch (error) {
            console.log("Do not fetch students due to some error", error);
        }
    };

    const addStudent = async (Data) => {
        try {
            const json = await postData(`${GlobalUrls.ADDSTUDENS_URL}`, Data);
            if (json.success === true) {
                setStudentsByRole(studentsByRole.concat(json.user));
            }
            return json;
        } catch (error) {
            console.log("Do not add student due to some error", error);
        }
    };

    const updateStudent = async (Data, id) => {
        try {
            const json = await putData(`${GlobalUrls.UPDATESTUDENT_URL}/${id}`, Data);
            return json;
        } catch (error) {
            console.log("Do not update student due to some error", error);
        }
    };

    const deleteStudent = async (id) => {
        try {
            const json = await deleteData(`${GlobalUrls.DELETESTUDENT_URL}/${id}`);
            return json;
        } catch (error) {
            console.log("Do not delete student due to some error", error);
        }
    };

    const changeStudentStatus = async (id) => {
        try {
            const json = await patchData(`${GlobalUrls.CHANGESTUDENTSTATUS_URL}/${id}`);
            getStudentsByRole();
            return json;
        } catch (error) {
            console.log("Do not change student status due to some error", error);
        }
    };

    //-------------[ Announce ] ----------------------------------
    const getAllUser = async (URL) => {
        try {
            const json = await getData(URL || `${GlobalUrls.GETALLUSER_URL}`);
            if (json.success === true) {
                setAllUser(json.data);
            }
            return json;
        } catch (error) {
            console.log("Do not fetch All user due to some error", error);
        }
    };

    const sendAnnounceMent = async (Data) => {
        try {
            const json = await postData(`${GlobalUrls.SENDANNOUNCEMENT_URL}`, Data);
            return json;
        } catch (error) {
            console.log("Do not Send announcsment due to some error", error);
        }
    };

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
    const [allUser, setAllUser] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);

    return (
        <ContentContext.Provider
            value={{
                Notes, MyNotes, AllNotes, PYQS, MyPYQS, AllPYQS, Video, MyVideo, AllVideo, Course, MyCourse, AllCourse,
                LatestData,
                addNote, getNote, addPYQ, getPYQ, addVideo, getVideo, addCourse, getCourse, getLatestUpload,
                updateNotes, updatePYQ, updateVideo, updateCourse,
                deleteNotes, deletePYQ, deleteVideo, deleteCourse,
                addInMylearning, removeFromMylearning, getDataFromMyLearning, MyLearningNotes, MyLearningVideo, MyLearningPYQ, RemoveMyLearningNotes, RemoveMyLearningPYQ, RemoveMyLearningVideo,
                searchContent, setSearchContentData, searchContentData,
                searchDashContent, dashNotes, dashPYQ, dasVideo, dasCourse,
                getdashAnalytics, dashAnalytics, getStudentsByRole, studentsByRole, addStudent, updateStudent, deleteStudent, changeStudentStatus,
                getAllUser, allUser, sendAnnounceMent,
                enrollCourse, MyLearningCourse,
                selectedCourse, setSelectedCourse,
                selectedPlan, setSelectedPlan
            }}>
            {props.children}
        </ContentContext.Provider>
    );
};

export default ContentState;
