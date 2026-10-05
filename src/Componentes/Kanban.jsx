import api from "../api";
import Header from "../componentes/Header.jsx";
import ListaTarefas from "../componentes/ListaTarefas.jsx";
import ModalTarefa from "../componentes/ModalTarefa.jsx";

import { useState, useEffect } from "react";

function Kanban() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [filtroPrioridade, setFiltroPrioridade] = useState("todas");
  const [modalAberto, setModalAberto] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState("afazer");

  useEffect(() => {
    async function carregarTarefas() {
      try {
        setCarregando(true);
        setErro("");
        const resposta = await api.get("/tarefas");
        setTarefas(resposta.data);
      } catch (e) {
        setErro("Erro ao carregar tarefas. Verifique a conexão.");
        console.error(e);
      } finally {
        setCarregando(false);
      }
    }
    carregarTarefas();
  }, []);

  useEffect(() => {
    const pendentes = tarefas.filter((t) => t.coluna !== "concluido").length;
    document.title = pendentes > 0 ? `(${pendentes}) TaskFlow` : "TaskFlow";
  }, [tarefas]);

  async function salvarTarefa(dados) {
    
    if (dados.id === undefined) {
      try {
        const resposta = await api.post("/tarefas", dados);
        setTarefas([...tarefas, resposta.data]);
      } catch (err) {
        setErro("Erro ao criar tarefa. Tente novamente.");
        console.error(err);
      }
    } else {
      try {
        const resposta = await api.put(`/tarefas/${dados.id}`, dados);
        setTarefas(tarefas.map((t) => (t.id === dados.id ? resposta.data : t)));
      } catch (err) {
        setErro("Erro ao editar tarefa. Tente novamente.");
        console.error(err);
      }
    }
  }

  async function moverTarefa(id, novaColuna) {
    try {
      const tarefa = tarefas.find((t) => t.id === id);
      const resposta = await api.put(`/tarefas/${id}`, {
        texto: tarefa.texto,
        prioridade: tarefa.prioridade,
        concluida: tarefa.concluida,
        coluna: novaColuna,
      });
      const tarefaMovida = resposta.data;

      setTarefas((tarefasAtuais) =>
        tarefasAtuais.map((t) => (t.id === id ? tarefaMovida : t)),
      );
    } catch (e) {
      setErro("Erro ao mover tarefa. Tente novamente.");
      console.error(e);
    }
  }

  async function deletarTarefa(id) {
    const confirmado = window.confirm(
      "Tem certeza que deseja deletar esta tarefa?",
    );
    if (!confirmado) return;

    try {
      await api.delete(`/tarefas/${id}`);
      setTarefas((tarefasAtuais) => tarefasAtuais.filter((t) => t.id !== id));
    } catch (e) {
      setErro("Erro ao deletar tarefa. Tente novamente.");
      console.error(e);
    }
  }

  const limparColuna = (nomeColuna) => {
    const confirmado = window.confirm(
      "Tem certeza que deseja limpar todas as tarefas desta coluna?",
    );
    if (confirmado) {
      setTarefas(tarefas.filter((t) => t.coluna !== nomeColuna));
    }
  };

  const tarefasPorColuna = (nomeColuna) => {
    return tarefas.filter((t) => {
      const bateColuna = t.coluna === nomeColuna;
      const batePrioridade =
        filtroPrioridade === "todas" || t.prioridade === filtroPrioridade;
      return bateColuna && batePrioridade;
    });
  };

  const totalTarefas = tarefas.length;
  const pendentes = tarefas.filter((t) => t.coluna !== "concluido").length;
  const concluidas = tarefas.filter((t) => t.coluna === "concluido").length;

  function abrirModalCriar(coluna) {
    setTarefaEditando(null);
    setColunaAtiva(coluna);
    setModalAberto(true);
  }

  function abrirModalEditar(tarefa) {
    setTarefaEditando(tarefa);
    setColunaAtiva(tarefa.coluna);
    setModalAberto(true);
  }

  return (
    <div id="Kanban">
      <Header
        titulo="TaskFlow Kanban"
        subtitulo="Crie e organize suas tarefas."
        total={totalTarefas}
        pendentes={pendentes}
        concluidas={concluidas}
      />
      <main className="container">
        {carregando && (
          <p style={{ textAlign: "center", color: "#94A3B8" }}>
            Carregando tarefas...
          </p>
        )}
        {erro && (
          <p style={{ textAlign: "center", color: "#EF4444" }}>{erro}</p>
        )}

        <section id="filtros">
          <button
            type="button"
            className={`btn-filtro ${filtroPrioridade === "todas" ? "ativo" : ""}`}
            onClick={() => setFiltroPrioridade("todas")}
          >
            Todas
          </button>
          <button
            type="button"
            className={`btn-filtro ${filtroPrioridade === "alta" ? "ativo" : ""}`}
            onClick={() => setFiltroPrioridade("alta")}
          >
            🔴 Alta
          </button>
          <button
            type="button"
            className={`btn-filtro ${filtroPrioridade === "media" ? "ativo" : ""}`}
            onClick={() => setFiltroPrioridade("media")}
          >
            🟡 Média
          </button>
          <button
            type="button"
            className={`btn-filtro ${filtroPrioridade === "baixa" ? "ativo" : ""}`}
            onClick={() => setFiltroPrioridade("baixa")}
          >
            🟢 Baixa
          </button>
        </section>

        {!carregando && (
          <div className="kanban-quadro">
            <div className="kanban-coluna">
              <div className="kanban-coluna-header">
                <h2>A Fazer</h2>
                <div className="kanban-coluna-header-acoes">
                  <span className="kanban-contador">
                    {tarefasPorColuna("afazer").length}
                  </span>
                  <button
                    className="kanban-btn-add"
                    onClick={() => abrirModalCriar("afazer")}
                  >
                    +
                  </button>
                  <button
                    className="kanban-btn-limpar"
                    onClick={() => limparColuna("afazer")}
                  >
                   
                  </button>
                </div>
              </div>
              <ListaTarefas
                tarefas={tarefasPorColuna("afazer")}
                onDeletar={deletarTarefa}
                onMover={moverTarefa}
                colunaAnterior={null}
                colunaProxima="andamento"
                onEditar={abrirModalEditar}
              />
            </div>

            <div className="kanban-coluna">
              <div className="kanban-coluna-header">
                <h2>Em Andamento</h2>
                <div className="kanban-coluna-header-acoes">
                  <span className="kanban-contador">
                    {tarefasPorColuna("andamento").length}
                  </span>
                  <button
                    className="kanban-btn-add"
                    onClick={() => abrirModalCriar("andamento")}
                  >
                    +
                  </button>
                  <button
                    className="kanban-btn-limpar"
                    onClick={() => limparColuna("andamento")}
                  >
                
                  </button>
                </div>
              </div>
              <ListaTarefas
                tarefas={tarefasPorColuna("andamento")}
                onDeletar={deletarTarefa}
                onMover={moverTarefa}
                colunaAnterior="afazer"
                colunaProxima="concluido"
                onEditar={abrirModalEditar}
              />
            </div>

            <div className="kanban-coluna">
              <div className="kanban-coluna-header">
                <h2>Concluído</h2>
                <div className="kanban-coluna-header-acoes">
                  <span className="kanban-contador">
                    {tarefasPorColuna("concluido").length}
                  </span>
                  <button
                    className="kanban-btn-add"
                    onClick={() => abrirModalCriar("concluido")}
                  >
                    +
                  </button>
                  <button
                    className="kanban-btn-limpar"
                    onClick={() => limparColuna("concluido")}
                  >
                    
                  </button>
                </div>
              </div>
              <ListaTarefas
                tarefas={tarefasPorColuna("concluido")}
                onDeletar={deletarTarefa}
                onMover={moverTarefa}
                colunaAnterior="andamento"
                colunaProxima={null}
                onEditar={abrirModalEditar}
              />
            </div>
          </div>
        )}
      </main>

      {modalAberto && (
        <ModalTarefa
          aberto={modalAberto}
          tarefa={tarefaEditando}
          coluna={colunaAtiva}
          onSalvar={salvarTarefa}
          onFechar={() => setModalAberto(false)}
        />
      )}
    </div>
  );
}

export default Kanban;


/*import api from '../api';
import Header from "../Componentes/Header";
import ListaTarefas from "../Componentes/ListaTarefas"; 
import { useState, useEffect } from "react";
import ModalTarefa from '../Componentes/ModalTarefa';

function Kanban() {
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

  function abrirModalCriar(coluna = "afazer") {
    setTarefaEditando(null);
    setColunaAtiva(coluna);
    setModalAberto(true);
  }

  function abrirModalEditar(tarefa) {
    setTarefaEditando(tarefa);
    setColunaAtiva(tarefa.coluna || "afazer");
    setModalAberto(true);
  }

  useEffect(() => {
    async function carregarTarefas() {
      try {
        setCarregando(true);
        setErro('');
        const resposta = await api.get('/tarefas');
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
      const resposta = await api.get(
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
      const resposta = await api.post('/tarefas', novaTarefaDados);
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
    if (!dados.id) {
      try {
        const resposta = await api.post('/tarefas', dados);
        setTarefas(prev => [...prev, resposta.data]);
        setModalAberto(false);
      } catch (err) {
        setErro('Erro ao salvar tarefa. Tente novamente.');
        console.error(err);
      }
    } else {
      try {
        const resposta = await api.put(`/tarefas/${dados.id}`, dados);
        setTarefas(prev => prev.map(t => t.id === dados.id ? resposta.data : t));
        setModalAberto(false);
      } catch (err) {
        setErro('Erro ao editar tarefa. Tente novamente.');
        console.error(err);
      }
    }
  }
 
  async function deletarTarefa(id) {
    const confirmado = window.confirm('Tem certeza que deseja deletar esta tarefa?');
    if (!confirmado) return;

    try {
      await api.delete(`/tarefas/${id}`);
      setTarefas(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setErro('Erro ao deletar tarefa.');
      console.error(err);
    }
  }

  const alternarConcluida = async (id) => {
    const tarefaAlvo = tarefas.find(t => t.id === id);
    if (!tarefaAlvo) return;

    try {
      const { data: tarefaAtualizada } = await api.patch(`/tarefas/${id}`, {
        concluida: !tarefaAlvo.concluida
      });
      setTarefas(prev => prev.map(t => t.id === id ? tarefaAtualizada : t));
    } catch (e) {
      console.error('Erro ao alterar estado de concluída:', e);
    }
  };

  async function moverTarefa(id, novaColuna) {
    try {
      const { data: tarefaMovida } = await api.patch(`/tarefas/${id}`, { 
        coluna: novaColuna 
      });
      setTarefas(prev => prev.map(t => t.id === id ? tarefaMovida : t));
    } catch (e) {
      setErro('Erro ao mover tarefa. Tente novamente');
      console.error(e);
    }
  }

  return (
    <>
      <Header subtitulo="Gerencie suas tarefas" tarefas="{tarefas}" titulo="TaskFlow"/>
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
            <div className="kanban-coluna1">
              <div className="kanban-coluna-header">
                <h3>A Fazer</h3>
                <span className="kanban-contador">
                  {tarefasFiltradas.filter((t) => t.coluna === "afazer").length}
                </span>
              </div>
              <ListaTarefas tarefas={tarefasFiltradas.filter((t) => t.coluna === "afazer")}
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
              <ListaTarefas tarefas={tarefasFiltradas.filter((t) => t.coluna === "andamento")}
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
              <ListaTarefas tarefas={tarefasFiltradas.filter((t) => t.coluna === "concluido")}
                onDeletar={deletarTarefa}
                onConcluir={alternarConcluida}
                onMover={moverTarefa}
                onEditar={abrirModalEditar}
                colunaAnterior="andamento"
                colunaProxima={null}
              />
            </div>

            <ModalTarefa aberto={modalAberto} onFechar={() => {
                setModalAberto(false);
                setTarefaEditando(null);
              }}
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

export default Kanban;*/