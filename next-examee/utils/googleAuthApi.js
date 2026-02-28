import axios from 'axios';
const BASEURL = "/api"

const api = axios.create({
    baseURL: `${BASEURL}/auth`
});

export const googleAuth = (code) => api.get(`/google?code=${code}`);
