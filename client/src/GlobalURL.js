
export const BASEURL = process.env.REACT_APP_API_KEY

export const REGISTER_URL = `${BASEURL}auth/register`
export const LOGIN_URL = `${BASEURL}auth/login`
export const VERIFY_URL = `${BASEURL}auth/verfyemail`
export const FOGOTPASSWORD_URL = `${BASEURL}auth/resetPassword`
export const FOGOTCODE_URL = `${BASEURL}auth/sendResetCode`

