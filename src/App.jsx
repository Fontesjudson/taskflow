import Kanban from './Componentes/Kanban';
import Sidebar from './Componentes/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Sobre from './pages/Sobre';
import RotaPrivada from './Componentes/RotaPrivada';

function App() {
return (
       
<div className='app-layout'>
  <Sidebar/>
  <main className='app-conteudo'>
    <Routes>
<Route path='/' element={ 
<RotaPrivada>
  <Kanban/>
  </RotaPrivada>} />
<Route path='/sobre' element={<Sobre/>} />
<Route path='/login' element={<Login />} />
    </Routes>
    </main>
    </div>
  );
}

export default App;
