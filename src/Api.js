import axios from 'axios'

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json'
    }
})

instance.interceptors.request.use((config) => {
    if (localStorage.getItem('token')) {
        config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`
    }
    return config
});

export default instance;
