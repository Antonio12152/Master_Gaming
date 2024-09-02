import axios from 'axios';
export const BASE_URL = 'https://master-gaming-zeta.vercel.app/'; //https://master-gaming-zeta.vercel.app/ http://localhost:5000 

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});