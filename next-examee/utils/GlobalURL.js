export const BASEURL = "/api/"

//------[Auth Urls]-----------------
export const REGISTER_URL = `${BASEURL}auth/register`
export const LOGIN_URL = `${BASEURL}auth/login`
export const VERIFY_URL = `${BASEURL}auth/verifyemail`
export const FOGOTPASSWORD_URL = `${BASEURL}auth/resetPassword`
export const FOGOTCODE_URL = `${BASEURL}auth/sendResetCode`
export const VERIFYTOKEN_URL = `${BASEURL}auth/verifyToken`

//------[User Details Urls]-------------
export const GETUSER_URL = `${BASEURL}auth/getUser`
export const SUPPORTUSER_URL = `${BASEURL}auth/support`

//------[ Announce ]-------------
export const GETALLUSER_URL = `${BASEURL}announce/getAllUser`
export const SENDANNOUNCEMENT_URL = `${BASEURL}announce/sendAnnouncement`


//------[Contents Urls ]-------------
export const ADDNOTE_URL = `${BASEURL}content/notes`
export const ADDPYQ_URL = `${BASEURL}content/pyq`
export const ADDVIDEO_URL = `${BASEURL}content/video`
export const ADDCOURSE_URL = `${BASEURL}content/course`

export const GETNOTE_URL = `${BASEURL}content/notes`
export const GETPYQ_URL = `${BASEURL}content/pyq`
export const GETVideo_URL = `${BASEURL}content/video`
export const GETCourse_URL = `${BASEURL}content/course`

export const UPDATENOTES_URL = `${BASEURL}content/notes`
export const UPDATEPYQS_URL = `${BASEURL}content/pyq`
export const UPDATEVIDEOS_URL = `${BASEURL}content/video`
export const UPDATECOURSE_URL = `${BASEURL}content/course`

export const DELETENOTE_URL = `${BASEURL}content/notes`
export const DELETEPYQ_URL = `${BASEURL}content/pyq`
export const DELETEVIDEO_URL = `${BASEURL}content/video`
export const DELETECOURSE_URL = `${BASEURL}content/course`

//----------- [ Search ] ---------------------
export const GETLATESTDATA_URL = `${BASEURL}content/latest`
export const SEARCHCONTENT_URL = `${BASEURL}content/search`

//------------[ MyLearning ] ----------------------
export const ADDINMYLEARNING_URL = `${BASEURL}content/mylearning/add`
export const GETDATAFROMMYLEARNING_URL = `${BASEURL}content/mylearning/get`
export const REMOVEFROMMYLEARNING_URL = `${BASEURL}content/mylearning/remove`

//------------ [ Dasbords ] -------------------
export const SEARDASHCHCONTENT_URL = `${BASEURL}content/dashboard/content`
export const DASHANALYTICS_URL = `${BASEURL}content/dashboard/analytics`
export const GETSTUDENTSBYROLE_URL = `${BASEURL}content/dashboard/students`
export const ADDSTUDENS_URL = `${BASEURL}content/dashboard/students`
export const CHANGESTUDENTSTATUS_URL = `${BASEURL}content/dashboard/students`
export const DELETESTUDENT_URL = `${BASEURL}content/dashboard/students`
export const UPDATESTUDENT_URL = `${BASEURL}content/dashboard/students`

//------------[ Enroll In Course]----------------------
export const ENROLLINCOURSE_URL = `${BASEURL}courseEnroll/enroll`
