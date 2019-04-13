import axios from 'axios';

const api = axios.create({
    baseURL: 'https://dropbox-backend-omnistack.herokuapp.com'
});

export default api;