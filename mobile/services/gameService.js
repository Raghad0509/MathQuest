import api from './api';

export async function startGame(userId, levelId) {
  const response = await api.post('/game/start/', { user_id: userId, level_id: levelId });
  return response.data;
}

export async function getLevels() {
  const response = await api.get('/levels/');
  return response.data;
}

export async function getLevel(levelId) {
  const response = await api.get(`/levels/${levelId}/`);
  return response.data;
}

export async function getNextObstacle(sessionId) {
  const response = await api.get(`/game/next-obstacle/${sessionId}/`);
  return response.data;
}

export async function getQuestion(sessionId, obstacleId) {
  const response = await api.get(`/game/question/${sessionId}/${obstacleId}/`);
  return response.data;
}

export async function submitAnswer(payload) {
  const response = await api.post('/game/answer/', payload);
  return response.data;
}

export async function getHint(payload) {
  const response = await api.post('/game/hint/', payload);
  return response.data;
}

export async function completeGame(sessionId) {
  const response = await api.post('/game/complete/', { session_id: sessionId });
  return response.data;
}
