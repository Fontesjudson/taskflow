import { useState } from 'react';
import Header from './Componentes/Header';
import ListaTarefas from './Componentes/ListaTarefas';
import Contador from './Componentes/Contador';
import { useEffect } from 'react';

function App() {
 
  const [tarefas, setTarefas] = useState(() => {
    const salvo = localStorage.getItem('taskflow-tarefas');
    if (!salvo) {
      return [];
    }
    return JSON.parse(salvo);
  });

  const [proximoId, setProximoId] = useState(1);
  const [texto, setTexto] = useState('');
  const [prioridade, setPrioridade] = useState('media');

  useEffect(() => {
    const pendentes = tarefas.filter(tarefa => !tarefa.concluida).length;
    if (pendentes > 0) {
      document.title = `TaskFlow (${pendentes})`;
    } else {
      document.title = 'TaskFlow';
    }
  }, [tarefas]);

  function adicionarTarefa () {
    if (texto.trim() === '') {
       return;
    }
  
    const nova = {
      id: proximoId,
      texto: texto.trim(),
      concluida: false,
      prioridade: prioridade,
    };
    setTarefas([...tarefas, nova]);
    setProximoId(proximoId + 1);
    setTexto('');
    setPrioridade('media');
  }
    const deletarTarefa = (id) => {
      const tarefasAtualizadas = tarefas.filter(tarefa => tarefa.id !== id);
      setTarefas(tarefasAtualizadas); 
    }  
    
    const alternarConcluida = (id) => {
      const tarefasAtualizadas = tarefas.map(tarefa => {
        if (tarefa.id === id) {
          return { ...tarefa, concluida: !tarefa.concluida };
        }
        return tarefa;
      });
      setTarefas(tarefasAtualizadas);
    };  

  return (
    

  <div id='app'>
    <Contador />
    <Header
      titulo='TaskFlow'
      subtitulo='Gerencie suas tarefas'
    />
  
    <main className='container'>
     <section id='formulario'>
      <div className='campo-linha'>
       <input id='input-tarefa'
              type='text' 
              placeholder='Nova tarefa...'
              value={texto}
              required
              autocomplete='off'
              onChange={e => {
                setTexto(e.target.value)}}
                onKeyDown={e => e.key === 'Enter' && adicionarTarefa()}
              />
     <select id='sel-prioridade'
             value={prioridade}
              onChange={e => setPrioridade(e.target.value)}>

      <option value='alta'>Alta</option>
      <option value='media'>Media</option>
      <option value='baixa'>Baixa</option>
     </select>
      <button id='btn-adicionar' type='button' onClick={adicionarTarefa}>
        Adicionar
      </button>
      </div>
      </section>

    <section  id='controles'>
      <div id='filtros'> 
      <button className="btn-filtro ativo" data-filtro="todas">Todas</button>
      <button className="btn-filtro" data-filtro="pendentes">Pendentes</button>
      <button className="btn-filtro" data-filtro="concluidas">Conluidas</button>
      </div>
      </section>
     
     <ListaTarefas tarefas={tarefas} onDeletar={deletarTarefa} onConcluir={alternarConcluida} />
    </main>

    <footer>
     <p>TaskFlow 2026 - Prof. Alan Glei</p>
    </footer>
  </div>
  );
}

export default App;
