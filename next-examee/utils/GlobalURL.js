export const BASEURL = process.env.NEXT_PUBLIC_API_URL

//------[Auth Urls]-----------------
export const REGISTER_URL = `${BASEURL}auth/register`
export const LOGIN_URL = `${BASEURL}auth/login`
export const VERIFY_URL = `${BASEURL}auth/verfyemail`
export const FOGOTPASSWORD_URL = `${BASEURL}auth/resetPassword`
export const FOGOTCODE_URL = `${BASEURL}auth/sendResetCode`

//------[User Details Urls]-------------
export const GETUSER_URL = `${BASEURL}auth/getUser`
export const SUPPORTUSER_URL = `${BASEURL}auth/support`

//------[ Announce ]-------------
export const GETALLUSER_URL = `${BASEURL}announce/getAllUser`
export const SENDANNOUNCEMENT_URL = `${BASEURL}announce/sendAnnouncement`


//------[Contents Urls ]-------------
export const ADDNOTE_URL = `${BASEURL}content/addNotes`
export const ADDPYQ_URL = `${BASEURL}content/addPYQ`
export const ADDVIDEO_URL = `${BASEURL}content/addVideo`
export const ADDCOURSE_URL = `${BASEURL}content/addCourse`

export const GETNOTE_URL = `${BASEURL}content/getAllPublicNotes`
export const GETPYQ_URL = `${BASEURL}content/getAllPublicPYQ`
export const GETVideo_URL = `${BASEURL}content/getAllPublicVideo`
export const GETCourse_URL = `${BASEURL}content/getAllPublicCourse`

export const UPDATENOTES_URL = `${BASEURL}content/updateNotes`
export const UPDATEPYQS_URL = `${BASEURL}content/updatePyq`
export const UPDATEVIDEOS_URL = `${BASEURL}content/updateVideo`
export const UPDATECOURSE_URL = `${BASEURL}content/updateCourse`

export const DELETENOTE_URL = `${BASEURL}content/deleteNote`
export const DELETEPYQ_URL = `${BASEURL}content/deletePYQ`
export const DELETEVIDEO_URL = `${BASEURL}content/deleteVideo`
export const DELETECOURSE_URL = `${BASEURL}content/deleteCourse`

//----------- [ Search ] ---------------------
export const GETLATESTDATA_URL = `${BASEURL}content/getLatestUpload`
export const SEARCHCONTENT_URL = `${BASEURL}content/searchContent`

//------------[ MyLearning ] ----------------------
export const ADDINMYLEARNING_URL = `${BASEURL}content/addInMylearning`
export const GETDATAFROMMYLEARNING_URL = `${BASEURL}content/getDatafromMyLearning`
export const REMOVEFROMMYLEARNING_URL = `${BASEURL}content/removeFromMyLearning`

//------------ [ Dasbords ] -------------------
export const SEARDASHCHCONTENT_URL = `${BASEURL}content/dashbordContent`
export const DASHANALYTICS_URL = `${BASEURL}content/dashbordAnlytics`
export const GETSTUDENTSBYROLE_URL = `${BASEURL}content/getStudentsByRole`
export const ADDSTUDENS_URL = `${BASEURL}content/addStudent`
export const CHANGESTUDENTSTATUS_URL = `${BASEURL}content/changeStudentStatus`
export const DELETESTUDENT_URL = `${BASEURL}content/deleteStudent`
export const UPDATESTUDENT_URL = `${BASEURL}content/updateStudent`

//------------[ Enroll In Course]----------------------
export const ENROLLINCOURSE_URL = `${BASEURL}courseEnroll/enroll`
