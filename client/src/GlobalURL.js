export const BASEURL = process.env.REACT_APP_API_KEY

//------[Auth Urls]-----------------
export const REGISTER_URL = `${BASEURL}auth/register`
export const LOGIN_URL = `${BASEURL}auth/login`
export const VERIFY_URL = `${BASEURL}auth/verfyemail`
export const FOGOTPASSWORD_URL = `${BASEURL}auth/resetPassword`
export const FOGOTCODE_URL = `${BASEURL}auth/sendResetCode`

//------[User Details Urls]-------------
export const GETUSER_URL = `${BASEURL}auth/getUser`


//------[Contents Urls ]-------------
export const ADDNOTE_URL = `${BASEURL}content/addNotes`
export const ADDPYQ_URL = `${BASEURL}content/addPYQ`
export const ADDVIDEO_URL = `${BASEURL}content/addVideo`
export const GETNOTE_URL = `${BASEURL}content/getAllPublicNotes`
export const GETPYQ_URL = `${BASEURL}content/getAllPublicPYQ`
export const GETVideo_URL = `${BASEURL}content/getAllPublicVideo`   
export const GETLATESTDATA_URL = `${BASEURL}content/getLatestUpload`   



