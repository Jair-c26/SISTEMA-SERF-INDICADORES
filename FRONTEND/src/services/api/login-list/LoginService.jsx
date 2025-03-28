import apiLogin from './apiLogin';

const LoginService = {
  /**
   * Autentica al usuario y gestiona permisos
   * @param {Object} credentials - {email: string, password: string}
   * @returns {Object} Datos de usuario con permisos
   */
  login: async (credentials) => {
    try {
      const response = await apiLogin.post('/', credentials);
      
      // Validación estructural de la respuesta
      if (!response.data?.data?.roles_fk?.permisos_fk) {
        throw new Error('Estructura de respuesta inválida');
      }

      // Extraer datos críticos
      const { token, data: userData } = response.data;
      const permisos = userData.roles_fk.permisos_fk;

      // Almacenamiento con claves del .env
      localStorage.setItem(
        import.meta.env.VITE_AUTH_TOKEN_KEY, 
        token
      );
      
      localStorage.setItem(
        import.meta.env.VITE_USER_DATA_KEY,
        JSON.stringify({
          id: userData.id,
          uuid: userData.uuid,
          permisos // Permisos sin cifrar pero estructurados
        })
      );

      return {
        ...response.data,
        permisos
      };

    } catch (error) {
      const errorMessage = import.meta.env.DEV 
        ? `Error: ${error.message}` 
        : 'Credenciales incorrectas o error de conexión';
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Destruye la sesión de forma segura
   */
  logout: async () => {
    try {
      await apiLogin.post('/logout');
      // Limpiar almacenamiento usando claves del .env
      localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
      localStorage.removeItem(import.meta.env.VITE_USER_DATA_KEY);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error en logout:', error);
      }
    }
  }
};

export default LoginService;