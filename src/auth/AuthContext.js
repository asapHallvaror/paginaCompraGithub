import React, { useContext, createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const signin = async (rutEmpresa, password) => {
    // Aquí es donde autenticarías al usuario
    if (rutEmpresa === '123' && password === 'password') {
      const user = { rutEmpresa };
      setUser(user);
      return user;
    } else {
      alert('Invalid credentials');
      return null;
    }
  };

  const signout = cb => {
    setUser(null);
    navigate("/");
    cb();
  };

  return {
    user,
    signin,
    signout,
  };
}
