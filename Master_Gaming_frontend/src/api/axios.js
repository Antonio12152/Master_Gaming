import axios from 'axios';
export const BASE_URL = 'https://mastergaming-production.up.railway.app'; // change on backend url https://mastergaming-production.up.railway.app/gamePosts http://localhost:5000

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});