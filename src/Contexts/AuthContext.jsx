import { createContext, useContext, useState, /*useEffect*/ } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  
  const [token, setToken] = useState(
    () => { localStorage.getItem("token") || null;
});
  const [usuario, setUsuario] = useState (null);

  function login(dadosUsuario, tokenRecebido) {
    setUsuario(dadosUsuario)
    setToken(tokenRecebido);
    localStorage.setItem("token", tokenRecebido);
  }

  function logout() {
    setUsuario(null);
    setToken(null)
    localStorage.removeItem("token");
  }

  const logado = !!token;

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout, logado }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth fora do AuthProvider');
  }
  return context;
}

