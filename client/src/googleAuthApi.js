import axios from 'axios';
const BASEURL = process.env.REACT_APP_API_KEY

const api = axios.create({
    baseURL : `${BASEURL}auth`
});

export const googleAuth = (code) =>api.get(`/google?code=${code}`);