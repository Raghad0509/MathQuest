import api from './api';

export async function getAchievements(userId) {
  const response = await api.get(`/achievements/${userId}/`);
  return response.data;
}
