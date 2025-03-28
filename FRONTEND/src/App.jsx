// App.jsx
import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  InputAdornment,
  FormControl,
  TextField,
  IconButton,
  OutlinedInput,
  InputLabel,
  Button,
  Stack,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff, Send as SendIcon, BorderAll } from '@mui/icons-material';
import LoadingBackdrop from './components/LoadingBackdrop';
import RecoverPassword from './components/recoverpassword';
import LoginService from './services/api/login-list/LoginService';
import { useAuth } from "./context/AuthContext";
import logoMP from './assets/icons/logoMP.svg';
import fondoSVG from './assets/icons/fondo.svg';
import { useQueryClient } from '@tanstack/react-query';
import './font.css';

const version = import.meta.env.VITE_VERSION || '1.1.1';

const commonBoxSx = {
  borderRadius: '10px',
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  color: '#616161',
};

const textFieldSx = {
  borderRadius: '10px',
  '& fieldset': { borderRadius: '10px', borderColor: '#A4A4A4' }
};

function App() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRecoverDialogOpen, setIsRecoverDialogOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlertVisible(false);
    try {
      // 1. Hacemos login
      const { token, data: userData, permisos } = await LoginService.login({ email, password });
      // 2. Guardamos token/usuario en el AuthContext
      login({ user: { ...userData, permisos }, token });

      // 4. Navegamos al Dashboard
      navigate('/dashboard');
    } catch (error) {
      setAlertVisible(true);
      setTimeout(() => setAlertVisible(false), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingBackdrop open={loading} />
      <RecoverPassword open={isRecoverDialogOpen} onClose={() => setIsRecoverDialogOpen(false)} />
      <div
        className="flex items-center justify-center h-screen"
        
      >
        {alertVisible && (
          <Stack sx={{ position: 'absolute', top: '1rem', right: '1rem', maxWidth: '300px' }}>
            <Alert variant="filled" severity="error">
              Credenciales incorrectas
            </Alert>
          </Stack>
        )}
        <div className="flex flex-row bg-white rounded-3xl shadow-md w-5/6 h-5/6 mx-auto items-center justify-center">
          {/* Panel izquierdo con información */}
          <div className="flex flex-col items-center justify-center rounded-l-2xl bg-[#152B52] w-1/2 h-full text-white px-8 py-16">
            <h1 className="font-Quicksand text-9xl font-bold text-[#ACC8FA]">SERF</h1>
            <h3 className="font-Quicksand text-lg font-semibold mb-4 text-center">
              Sistema Estadistico <br />Reporte Fiscal (SERF)
            </h3>
            <p className="font-Quicksand text-center font-light leading-relaxed max-w-sm text-sm">
              El Sistema Estadistico de Reporte Fiscal (SERF) es una herramienta desarrollada para el análisis y
              seguimiento del desempeño en la fiscalía. Facilita la generación de reportes detallados y rankings que
              permiten evaluar el rendimiento de fiscales, despachos y dependencias.
            </p>
          </div>
          {/* Panel derecho con formulario */}
          <div className="relative flex flex-col items-center justify-center w-1/2 h-full rounded-r-2xl bg-white">
            <div className="h-30 w-60">
              <img src={logoMP} alt="Logo MP"/>
            </div>
            <form onSubmit={handleLogin} className="w-full max-w-xs">
              <h2 className="font-Quicksand text-2xl font-semibold text-center text-[#616161]">Iniciar sesión</h2>
              <p className="font-Quicksand text-xs font-normal text-center text-[#616161] mb-5">
                Por favor, ingrese sus credenciales correctamente para acceder al sistema.
              </p>
              {/* Campo correo electrónico con margen superior adicional */}
              <Box sx={commonBoxSx} noValidate autoComplete="off" className="mb-5">
                <TextField
                  label="Correo electrónico*."
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={textFieldSx}
                />
              </Box>
              {/* Campo contraseña */}
              <Box sx={commonBoxSx} noValidate autoComplete="off" className="mb-5">
                <FormControl fullWidth variant="outlined">
                  <InputLabel size="small" sx={{fontWeight: '500' }}>
                    Contraseña*.
                  </InputLabel>
                  <OutlinedInput
                    type={showPassword ? 'text' : 'password'}
                    size="small"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={togglePasswordVisibility}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Contraseña*."
                    sx={textFieldSx}
                  />
                </FormControl>
              </Box>
              <Stack spacing={2} sx={{ width: '100%' }}>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  type="submit"
                  sx={{
                    backgroundColor: '#152B52',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '0.5rem',
                    width: '100%',
                    marginTop: '0.5rem',
                  }}
                >
                  Ingresar
                </Button>
              </Stack>
              <p className="text-[#616161] text-xs text-right mt-3 mb-0">
                ¿Olvidó su contraseña?{' '}
                <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => setIsRecoverDialogOpen(true)}>
                  Recuperar
                </span>
              </p>
            </form>
            {/* Versión del sistema en la esquina inferior derecha */}
            <p className="absolute bottom-4 right-4 text-xs text-gray-500">Versión {version}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
