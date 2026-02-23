import axios from 'axios';
const BASEURL = process.env.NEXT_PUBLIC_API_URL

const api = axios.create({
    baseURL: `${BASEURL}auth`
});

export const googleAuth = (code) => api.get(`/google?code=${code}`);
