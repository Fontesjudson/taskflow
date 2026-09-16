import { Routes, Route } from "react-router-dom";
import { useAuth } from "./Contexts/AuthContext";
import "./App.css";
import Kanban from "./Componentes/Kanban";
import Sobre from "./pages/Sobre";
import Login from "./pages/Login";
import Sidebar from "./Componentes/Sidebar";
import RotaPrivada from "./Componentes/RotaPrivada";

function App() {

  const { token } = useAuth();

  console.log(useAuth)
  return (
    <div className="app-layout">
      {token && <Sidebar />}
      marginLeft: token ? '220px' : '0'
       
      <main className="app-conteudo">
        <Routes>
          <Route 
            path="/" 
            element={
              <RotaPrivada>
                <Kanban />
              </RotaPrivada>
            } 
          />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<h1>Página não encontrada</h1>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;


