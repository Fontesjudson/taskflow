import Header from "../Componentes/Header";
import ListaTarefas from "../Componentes/ListaTarefas"; 
import { useState, useEffect } from "react";
import axios from "axios";
import ModalTarefa from '../Componentes/ModalTarefa';

function Kanban() {
  const URL_API = 'https://6a85aaef9c451dc67a63ec7f.mockapi.io/apiV1/tarefas';

  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const [texto, setTexto] = useState('');
  const [cep, setCep] = useState('');
  const [prioridade, setPrioridade] = useState('media');

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
    async function carregarTarefas() {
      try {
        setCarregando(true);
        setErro('');
        const resposta = await axios.get(URL_API);
        setTarefas(resposta.data);
      } catch (e) {
        setErro('Erro ao carregar tarefas. Verifique a conexão.');
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }
    carregarTarefas();
  }, []); 

  
  const BuscarEndereco = async (cepParaBuscar) => {
    if (!cepParaBuscar) return;
    try {
      const resposta = await axios.get(
        `https://viacep.com.br/ws/${cepParaBuscar}/json/`
      );
      console.log("CEP data:", resposta.data);
    } catch (error) {
      console.error("Erro ao buscar CEP:", error.message); 
    }
  };

  const adicionarTarefa = async () => {
    if (texto.trim() === "") return;

    const novaTarefaDados = {
      texto: texto,
      concluida: false,
      prioridade: prioridade,
      coluna: "afazer",
    };

    try {
      const resposta = await axios.post(URL_API, novaTarefaDados);
      setTarefas((tarefasAtuais) => [...tarefasAtuais, resposta.data]);

      if (cep) {
        BuscarEndereco(cep);
      }

      setTexto('');
      setCep('');
      setPrioridade('media');
    } catch (e) {
      setErro('Erro ao adicionar tarefa.');
      console.error(e);
    }
  };

  async function salvarTarefa(dados) {
    try {
      if (dados.id !== undefined) {
        const { data: tarefaEditada } = await axios.put(`${URL_API}/${dados.id}`, {
          texto: dados.texto,
          prioridade: dados.prioridade,
          cidade: dados.cidade,
          coluna: dados.coluna,
        });
        setTarefas(tarefasAtuais =>
          tarefasAtuais.map(t => (t.id === dados.id ? tarefaEditada : t))
        );
      } else {
        const { data: novaTarefa } = await axios.post(URL_API, dados);
        setTarefas(tarefasAtuais => [...tarefasAtuais, novaTarefa]);
      }
      setModalAberto(false);
    } catch (e) {
      setErro('Erro ao salvar tarefa. Tente novamente.');
      console.error(e);
    }
  }
 
  async function deletarTarefa(id) {
    const confirmado = window.confirm('Tem certeza que deseja deletar esta tarefa?');
    if (!confirmado) return;

    try {
      await axios.delete(`${URL_API}/${id}`);
      setTarefas(tarefasAtuais => tarefasAtuais.filter(t => t.id !== id));
    } catch (e) {
      setErro('Erro ao deletar tarefa. Tente novamente.');
      console.error(e);
    }
  }

  const alternarConcluida = async (id) => {
    const tarefaAlvo = tarefas.find(t => t.id === id);
    if (!tarefaAlvo) return;

    try {
      const { data: tarefaAtualizada } = await axios.patch(`${URL_API}/${id}`, {
        concluida: !tarefaAlvo.concluida
      });
      setTarefas(tarefas.map(t => (t.id === id ? tarefaAtualizada : t)));
    } catch (e) {
      console.error('Erro ao alterar estado de concluída:', e);
    }
  };

  async function moverTarefa(id, novaColuna) {
    try {
      const { data: tarefaMovida } = await axios.patch(
        `${URL_API}/${id}`,
        { coluna: novaColuna }
      );
      setTarefas(tarefasAtuais =>
        tarefasAtuais.map(t => (t.id === id ? tarefaMovida : t))
      );
    } catch (e) {
      setErro('Erro ao mover tarefa. Tente novamente');
      console.error(e);
    }
  }

  return (
    <>
      <Header
        titulo="TaskFlow"
        subtitulo="Gerencie suas tarefas"
        tarefas={tarefas}
      />

      {carregando && (
        <p style={{ textAlign: 'center', color: '#94A3B8' }}>Carregando tarefas...</p>
      )}
      
      {erro && (
        <p style={{ textAlign: 'center', color: '#EF4444' }}>{erro}</p>
      )}

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

        <div className="filtro-prioridade">
          <label>Filtrar por prioridade: </label>
          <select
            value={filtroPrioridade}
            onChange={(e) => setFiltroPrioridade(e.target.value)}
          >
            <option value="todas">Todas</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </select>
        </div>

        {!carregando && !erro && (
          <div className="kanban-quadro">
            {/* Coluna A Fazer */}
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
                onEditar={abrirModalEditar}
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
                onEditar={abrirModalEditar}
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
                onEditar={abrirModalEditar}
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
        )}
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