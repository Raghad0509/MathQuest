import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

function getDetectedHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.expoGoConfig?.debuggerHost ||
    Constants.manifest2?.extra?.expoClient?.hostUri;

  if (!hostUri) return null;
  const host = String(hostUri).split(':')[0];
  if (!host || host === 'localhost' || host === '127.0.0.1') return null;
  return host;
}

function getApiBaseUrl() {
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL;
  }

  const detectedHost = getDetectedHost();
  if (detectedHost) {
    return `http://${detectedHost}:8000/api`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000/api';
  }

  return 'http://127.0.0.1:8000/api';
}

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

console.log(`[MathQuest API] baseURL=${API_BASE_URL}`);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.detail || error.message || 'Unknown API error';
    return Promise.reject(new Error(message));
  }
);

export default api;
