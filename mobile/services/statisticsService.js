import api from './api';

export async function getStatistics(userId) {
  const response = await api.get(`/statistics/${userId}/`);
  return response.data;
}
