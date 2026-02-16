import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== Group API ====================

export const groupApi = {
  // Get all groups
  getAllGroups: () => api.get('/groups'),

  // Get group by ID
  getGroupById: (groupId) => api.get(`/groups/${groupId}`),

  // Create a new group
  createGroup: (groupData) => api.post('/groups', groupData),

  // Update a group
  updateGroup: (groupId, groupData) => api.put(`/groups/${groupId}`, groupData),

  // Soft delete a group
  deleteGroup: (groupId) => api.delete(`/groups/${groupId}`),

  // Toggle group status (active/inactive)
  toggleGroupStatus: (groupId) => api.patch(`/groups/${groupId}/toggle-status`),
};

export default api;
