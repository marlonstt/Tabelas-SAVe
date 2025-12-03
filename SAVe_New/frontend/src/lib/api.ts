import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', //IP local(só roda localmente)
  //baseURL: 'http://10.15.128.46:8080/api', //IP do servidor (esta máquina)
  //baseURL: 'http://192.168.18.45:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

import { isGlobalSaving } from './stores';

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Set saving state to true for mutation requests
  if (['put', 'post', 'delete', 'patch'].includes(config.method?.toLowerCase() || '')) {
    isGlobalSaving.set(true);
  }

  return config;
}, (error) => {
  isGlobalSaving.set(false);
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  // Reset saving state on success
  if (['put', 'post', 'delete', 'patch'].includes(response.config.method?.toLowerCase() || '')) {
    isGlobalSaving.set(false);
  }
  return response;
}, (error) => {
  // Reset saving state on error
  isGlobalSaving.set(false);
  return Promise.reject(error);
});

export default api;
