import TarefaItem from './TarefaItem';

const CLASSE_PRIORIDADE = { 1: 'baixa', 2: 'media', 3: 'alta' };

function ListaTarefas({
  tarefas, 
  prioridades = [],
  onDeletar, 
  onConcluir,
  onMover = null,
  colunaAnterior = null,
  colunaProxima = null,
}) {
  return (
    <section id="lista-section">
      {tarefas.length === 0 && (
        <p className="msg-vazia">
          Nenhuma tarefa cadastrada. Adicione uma acima!
        </p>
      )}
      
      {tarefas.length > 0 && (
        <ul id="lista-tarefas">
          {tarefas.map(tarefa => {
            const prioridade = prioridades.find(p => p.id === tarefa.idPrioridade);
            
          //  return (
              <TarefaItem
                key={tarefa.id}
                texto={tarefa.texto}
                prioridade={CLASSE_PRIORIDADE[tarefa.idPrioridade] || 'media'}
                rotuloPrioridade={prioridade?.descricao}
                concluida={tarefa.concluida}
                onDeletar={() => onDeletar(tarefa.id)}
                onConcluir={() => onConcluir(tarefa.id)}
                onMover={onMover ? (novaColuna) => onMover(tarefa.id, novaColuna) : null}
                colunaAnterior={colunaAnterior}
                colunaProxima={colunaProxima}
              />
            
          })}
        </ul>
      )}
    </section>
  );
}

export default ListaTarefas;