import styles from './Header.module.css';

function Header ({ titulo, subtitulo = "Informe o subtítulo" }) {

{/*const total = tarefas.length;
const pendentes = tarefas.filter(tarefa => !tarefa.concluida).length;
const concluidas = tarefas.filter(tarefa => tarefa.concluida).length;*/}

return (
<header className={styles.header}>
  <div className={styles.container}>
  <div className={styles.logo}>
   <h1>{titulo}</h1> 
   <p>{subtitulo}</p>
  </div>

  {/*<div id="contadores">
    <span id="cont-total">{`${total} tarefas`}</span>
    <span className='separador'>·</span>
    <span id="cont-pendentes">{`${pendentes} pendentes`}</span>
    <span className='separador'>·</span>
    <span id="cont-concluidas">{`${concluidas} concluídas`}</span>
  </div>*/}
  </div>
</header>

 );
}
export default Header;