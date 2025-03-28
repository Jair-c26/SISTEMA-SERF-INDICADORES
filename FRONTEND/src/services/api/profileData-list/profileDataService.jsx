import apiProfileData from './apiProfileData';

const profileDataService = {
  // Obtiene el perfil (o lista de perfiles) según lo defina la API.
  // Se retorna la propiedad "data" del objeto de respuesta.
  getProfile: async () => {
    const response = await apiProfileData.get('/');
    return response.data.data;
  },

  // Obtiene un perfil por su ID
  getProfileById: async (id) => {
    const response = await apiProfileData.get(`/${id}`);
    return response.data.data;
  },

  // Crea un nuevo perfil
  createProfile: async (profileData) => {
    const response = await apiProfileData.post('/', profileData);
    return response.data.data;
  },

  // Actualiza un perfil existente
  updateProfile: async (id, profileData) => {
    const response = await apiProfileData.put(`/${id}`, profileData);
    return response.data.data;
  },

  // Elimina un perfil por su ID
  deleteProfile: async (id) => {
    const response = await apiProfileData.delete(`/${id}`);
    return response.data.data;
  },
};

export default profileDataService;
