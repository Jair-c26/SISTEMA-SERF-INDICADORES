import apiClient from './apiClient';

const userListService = {
  getAllUsers: async () => {
    const response = await apiClient.get('/user');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await apiClient.get(`/user/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    // Convertir el objeto userData a FormData
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      // Se agregan solo los campos que tienen valor (no nulos o undefined)
      if (userData[key] !== null && userData[key] !== undefined) {
        formData.append(key, userData[key]);
      }
    });

    const response = await apiClient.post('/user', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await apiClient.put(`/user/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await apiClient.delete(`/user/${id}`);
    return response.data;
  },
};

export default userListService;
