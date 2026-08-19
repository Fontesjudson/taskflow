import Header from "../componentes/Header";
import ListaTarefas from "../componentes/ListaTarefas"; 
import { useState, useEffect } from "react";
import axios from "axios";
import ModalTarefa from '../componentes/ModalTarefa';

function Kanban() {
  const [tarefas, setTarefas] = useState(() => {
    const tarefasSalvas = localStorage.getItem("tarefas");
    if (!tarefasSalvas) return [];
    try {
      const tarefasConvertidas = JSON.parse(tarefasSalvas);
      return Array.isArray(tarefasConvertidas) ? tarefasConvertidas : [];
    } catch {
      return [];
    }
  });

  const [proximaId, setProximaId] = useState(() => {
    const tarefasSalvas = localStorage.getItem("tarefas");
    if (!tarefasSalvas) return 1;
    const lista = JSON.parse(tarefasSalvas);
    if (!Array.isArray(lista) || lista.length === 0) return 1;
    return Math.max(...lista.map((t) => t.id || 0)) + 1;
  });

  // Estados que faltavam no formulário
  const [texto, setTexto] = useState("");
  const [prioridade, setPrioridade] = useState("media");
  const [cep, setCep] = useState("");

  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState("afazer");
  const [filtroPrioridade, setFiltroPrioridade] = useState('todas');

  const tarefasFiltradas = tarefas.filter((t) => {
    if (filtroPrioridade === 'todas') return true;
    return t.prioridade === filtroPrioridade;
  });

  function abrirModalEditar(tarefa) {
    setTarefaEditando(tarefa);
    setModalAberto(true);
  }

  useEffect(() => {
    const pendentes = tarefas.filter((t) => t.coluna === 'afazer').length;

    if (pendentes > 0) {
      document.title = `(${pendentes}) TaskFlow`;
    } else {
      document.title = 'TaskFlow';
    }
    
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }, [tarefas]);

  const BuscarEndereco = async (cepParaBuscar) => {
    if (!cepParaBuscar) return;
    try {
      const resposta = await axios.get(
        `https://viacep.com.br/ws/${cepParaBuscar}/json/`
      );
      console.log("cep data", resposta.data);
    } catch (error) {
      console.error(error.message); 
    }
  };

  const adicionarTarefa = () => {
    if (texto.trim() === "") return;

    const novaTarefa = {
      id: proximaId,
      texto: texto,
      concluida: false,
      prioridade: prioridade,
      coluna: "afazer",
    };

    setTarefas([...tarefas, novaTarefa]);
    setProximaId(proximaId + 1);

    if (cep) {
      BuscarEndereco(cep);
    }

    setTexto("");
    setPrioridade("media");
    setCep("");
  };

  function salvarTarefa(dados) {
    if (dados.id !== undefined) {
      setTarefas(
        tarefas.map((t) => (t.id === dados.id ? { ...t, ...dados } : t))
      );
    } else {
      setTarefas([...tarefas, { ...dados, id: proximaId }]);
      setProximaId(proximaId + 1);
    }
  }

  const deletarTarefa = (id) => {
    const confirmado = window.confirm(
      'Tem certeza que deseja deletar esta tarefa?'
    );

    if (confirmado) {
      setTarefas(tarefas.filter((t) => t.id !== id));
    }
  };

  const alternarConcluida = (id) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
      )
    );
  };

  const moverTarefa = (id, novaColuna) => {
    setTarefas(
      tarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, coluna: novaColuna } : tarefa
      )
    );
  };

  return (
    <>
      <Header
        titulo="TaskFlow "
        subtitulo="Gerencie suas tarefas"
        tarefas={tarefas}
      />

      <main className="container">
        <section id="formulario">
          <div className="campo-linha">
            <input
              id="input-tarefa"
              type="text"
              placeholder="Nova tarefa..."
              required
              autoComplete="off"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
            />
            <input
              type="text"
              placeholder="Digite o CEP"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
            />

            <select
              id="sel-prioridade"
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
            >
              <option value="alta">🔴 Alta</option>
              <option value="media">🟡 Média</option>
              <option value="baixa">🟢 Baixa</option>
            </select>

            <button id="btn-adicionar" type="button" onClick={adicionarTarefa}>
              Adicionar
            </button>
          </div>
        </section>

        <div className='filtro-prioridade'>
          <label>Filtrar por prioridade:</label>
          <select
            value={filtroPrioridade}
            onChange={(e) => setFiltroPrioridade(e.target.value)}
          >
           <option value='todas'>Todas</option>
           <option value='alta'>Alta</option>
           <option value='media'>Media</option>
           <option value='baixa'>Baixa</option>
          </select>
        </div>

        <div className="kanban-quadro">
          <div className="kanban-coluna1">
            <div className="kanban-coluna-header">
              <h3>A Fazer</h3>
              <span className="kanban-contador">
                {tarefasFiltradas.filter((t) => t.coluna === "afazer").length}
              </span>
            </div>
            <ListaTarefas
              tarefas={tarefasFiltradas.filter((t) => t.coluna === "afazer")}
              onDeletar={deletarTarefa}
              onConcluir={alternarConcluida}
              onMover={moverTarefa}
              colunaAnterior={null}
              colunaProxima="andamento"
            />
          </div>

          <div className="kanban-coluna2">
            <div className="kanban-coluna-header">
              <h3>Em Andamento</h3>
              <span className="kanban-contador">
                {tarefasFiltradas.filter((t) => t.coluna === "andamento").length}
              </span>
            </div>
            <ListaTarefas
              tarefas={tarefasFiltradas.filter((t) => t.coluna === "andamento")}
              onDeletar={deletarTarefa}
              onConcluir={alternarConcluida}
              onMover={moverTarefa}
              colunaAnterior="afazer"
              colunaProxima="concluido"
            />
          </div>

          <div className="kanban-coluna3">
            <div className="kanban-coluna-header">
              <h3>Concluído</h3>
              <span className="kanban-contador">
                {tarefasFiltradas.filter((t) => t.coluna === "concluido").length}
              </span>
            </div>
            <ListaTarefas
              tarefas={tarefasFiltradas.filter((t) => t.coluna === "concluido")}
              onDeletar={deletarTarefa}
              onConcluir={alternarConcluida}
              onMover={moverTarefa}
              colunaAnterior="andamento"
              colunaProxima={null}
            />
          </div>

          <ModalTarefa
            aberto={modalAberto}
            onFechar={() => setModalAberto(false)}
            onSalvar={salvarTarefa}
            tarefa={tarefaEditando}
            coluna={colunaAtiva}
          />
        </div>
      </main>

      <footer>
        <p>
          TaskFlow &copy; 2026 &mdash; Prof. Alan Glei &mdash; SENAI CTGAS-ER
        </p>
      </footer>
    </>
  );
}

export default Kanban;