import styles from './TarefaItem.module.css';

function TarefaItem({
   texto,  
   prioridade = 'media',
   onEditar,
   cidade = "",
   onDeletar,
  

   onMover = null,
   colunaAnterior = null,
   colunaProxima = null,
  }) {
   
  const classeItem = (onEditar ? styles.tarefa + ' ' + styles.concluida : styles.tarefa) + ' ' + styles[prioridade];
  const classeTexto = onEditar ? styles.textoTarefa + ' ' + styles['texto-tarefa'] : styles.textoTarefa;
  const classePrioridade = styles['badge-prioridade'] + ' ' + styles['badge-' + prioridade];

  const modoKanban = onMover !== null;

   return (
     <li className={classeItem}>
      <div className={styles.conteudo}>
       <span className={classeTexto} onDoubleClick={onEditar}>{texto}</span>
       {cidade && <span className={styles.cidade}>{cidade}</span>}
       </div>
       <span className={classePrioridade}>{prioridade}</span>
       <div className = {styles.acoes}>
        {modoKanban && colunaAnterior && (
       <button 
       className={styles.btnMover}
       onClick={() => onMover(colunaAnterior)}
       title='Mover para a coluna anterior'> ←
       </button>
       )}

       {modoKanban && colunaProxima && (
        <button
          className={styles.btnMover}
          onClick={() => onMover(colunaProxima)}
          title="Mover para próxima coluna">→
        </button>
        )}

        <button className={styles.btnDeletar} onClick={onDeletar}>
          X
        </button>
        </div>


     </li>
   );
}

export default TarefaItem;