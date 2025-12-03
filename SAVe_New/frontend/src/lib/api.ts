import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://localhost:8080/api', //IP local(só roda localmente)
  baseURL: 'http://10.15.128.46:8080/api', //IP do servidor (esta máquina)
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
