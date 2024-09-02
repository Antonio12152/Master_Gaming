import axios from 'axios';
export const BASE_URL = 'https://mastergaming-production.up.railway.app'; //https://mastergaming-production.up.railway.app http://localhost:5000

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});