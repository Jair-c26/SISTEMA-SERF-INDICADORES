// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 1. Importa QueryClient y QueryClientProvider
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.jsx";
import Dashboard from "./dashboard.jsx";
import ControlPanel from "./pages/ControlPanel/ControlPanel";
import PrivateRoute from "./routes/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import "./font.css";

// Para mostrar toasts
import { Toaster } from "./components/ui/Toaster.jsx";

// 2. Crea una instancia de QueryClient
const queryClient = new QueryClient();

// 3. Renderiza la app con QueryClientProvider
const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route
              path="/dashboard/*"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>

          {/* Tu componente Toaster para notificaciones */}
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);
