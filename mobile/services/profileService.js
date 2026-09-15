import api from './api';

export async function getProfiles() {
  const response = await api.get('/profiles/');
  return response.data;
}

export async function createProfile(payload) {
  const response = await api.post('/profiles/', payload);
  return response.data;
}

export async function getProfile(id) {
  const response = await api.get(`/profiles/${id}/`);
  return response.data;
}
