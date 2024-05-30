import React, { useContext, createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Crear un contexto de autenticación
const AuthContext = createContext();

// Proveedor de autenticación
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// Gancho para usar la autenticación
export function useAuth() {
  return useContext(AuthContext);
}

// Proveedor de autenticación personalizado
function useProvideAuth() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const signin = cb => {
    // Aquí es donde autenticarías al usuario
    setUser("user");
    cb();
  };

  const signout = cb => {
    setUser(null);
    navigate("/"); // Redirigir al inicio de sesión al cerrar sesión
    cb();
  };

  return {
    user,
    signin,
    signout
  };
}