import { createContext, useContext, useState, useEffect } from 'react';


const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  
  const [logado, setLogado] = useState(() => {
    return localStorage.getItem("logado") === "true";
  });

  function login() {
    setLogado(true);
    localStorage.setItem("logado", "true");
  }

  function logout() {
    setLogado(false);
    localStorage.removeItem("logado");
  }

  return (
    <AuthContext.Provider value={{ logado, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider');
  }
  return context;
}

