/*
import { useState } from 'react';
import { useEffect } from 'react';
import './Componentes/AppminiKanban.css';

function AppminiKanban() {

  const [tarefas, setTarefas] = useState( [] );
   const salvo = localStorage.getItem('taskflow-Kanban');
  if (!salvo) {
    return [];
  }
  return JSON.parse(salvo);

  const [cep, setCep] = useState('');

       
    

  function moverTarefa(id, novaColuna) {
    setTarefas(tarefas.map (t => 
        t.id === id ? {...t, coluna: novaColuna } : t
    ) );
  }
  const texto

function adicionarTarefa () {
    if (texto.trim() === '') {
       return;
    }

    
    const novaTarefa = {
      id: proximoId,
      texto: texto.trim(),
      concluida: false,
      coluna: 'afazer',

      id: proximoId,
      texto: texto.trim(),
      concluida: false,
      coluna: 'Em andamento',

      id: proximoId,
      texto: texto.trim(),
      concluida: false,
      coluna: 'Concluído',
    }
  return (
    <div>
    <Header>
      <h1>Mini Kanban</h1>
      <p>Gerencie suas tarefas</p>
      <input type="text" placeholder="Digite o CEP" value={cep} onChange={(e) => setCep(e.target.value)} />
      <button onClick={setTarefas}> Adicionar</button>
    </Header>

    
    <div className='coluna1'>
      <h2>A fazer </h2>
      {tarefas.filter(tarefa =>
      tarefa.coluna === 'afazer').map(t => (
        <div key={t.id} className='card'>
          <p>{t.texto}</p>
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
          <button onClick={() => moverTarefa(t.id, 'Em andamento')}>Mover →</button>
        </div>
      ))
    }
    

  <div className='coluna2'>
      <h2>Em andamento</h2>
      {tarefas.filter(tarefa =>
      tarefa.coluna === 'Em andamento').map(t => (
        <div key={t.id} className='card'>
          <button onClick={() => moverTarefa(t.id, 'afazer')}>← Mover</button>
          <p>{t.texto}</p>
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
          <button onClick={() => moverTarefa(t.id, 'Concluído')}>Mover →</button>
        </div>
      ))}
    </div>

  <div className='coluna3'>
      <h2>Concluído</h2>
      {tarefas.filter(tarefa =>
      tarefa.coluna === 'Concluído').map(t => (
        <div key={t.id} className='card'>
          <button onClick={() => moverTarefa(t.id, 'Em andamento')}>← Mover</button>
          <p>{t.texto}</p>
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
        </div>
      ))}
    </div>  
    </div>
    </div>
    
    
  
  
    )}
  }
}
export default AppminiKanban;
*/