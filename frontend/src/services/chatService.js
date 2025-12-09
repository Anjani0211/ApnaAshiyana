import api from '../utils/api';

export const ensureRoom = async (propertyId) => {
  const res = await api.post(`/chat/room/${propertyId}`);
  return res.data.data;
};

export const fetchMessages = async (roomId, { limit = 50, before } = {}) => {
  const params = new URLSearchParams();
  params.append('limit', limit);
  if (before) params.append('before', before);
  const res = await api.get(`/chat/${roomId}/messages?${params.toString()}`);
  return res.data;
};

export const sendMessage = async (roomId, text) => {
  const res = await api.post(`/chat/${roomId}/messages`, { text });
  return res.data.data;
};

export const markRead = async (roomId) => {
  await api.post(`/chat/${roomId}/read`);
};

export const listRooms = async (filter = 'all') => {
  const res = await api.get(`/chat/rooms/list?filter=${filter}`);
  return res.data.data;
};

