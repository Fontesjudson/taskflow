import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Kanban from './kanban';
import { AuthProvider } from '../Contexts/AuthContext';
import api from '../api';

vi.mock('../api', () => ({
    default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
    mensagensDeErro: vi.fn(() => ['erro']),
}));

const respostas = {
    '/prioridades': [
        { id: 1, descricao: 'Alto' },
        { id: 2, descricao: 'Medio' },
    ],
    '/tarefas': [
        { id: 1, texto: 'modelar o banco', coluna: 'afazer',
            prioridade: 'Alto' 
        },
        { id: 2, texto: 'Criar a API', coluna: 'andamento',
            prioridade: 'Medio'
        }
    ],
    '/usuarios': [{ id: 1, nome: 'Ana Lima' }],
    '/projetos': [{ id: 2, nome: 'TaskFlow' }],
};

function desenharKanban() {
    render(<AuthProvider><Kanban /></AuthProvider>);
 } 
 
 beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockInplementation((url) => 
    Promise.resolve({ data: respostas[url]}) 
  );
});

describe('Kanban', () => {
    test('mostra carregando enquanto a API não responde', () => {
        desenharKanban();

        expect(screen.getByText('Carregando tarefas...'))
        .toBeInTheDocument();
    });
});
 
    test('depois da resposta, as tarefas aparecem', async () => {
      desenharKanban();

      expect(await screen.findByText('Modelar o banco')).toBeInTheDocument();
      expect(screen.getByText('Criar a API')).toBeInTheDocument();
      expect(screen.queryByText('Carregando tarefas...'))
        .not.toBeInTheDocument();
      expect(api.get).toHaveBeenCalledWith('/tarefas');
});

    test('se a API falha, mostra a mensagem de erro', async () => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
      api.get.mockRejectedValue(new Error('Network Error'));
      desenharKanban();

      expect(await screen.findByText(
        'Erro ao carregar tarefas. Verifique a conexao.'
      )).toBeInTheDocument();
});

    test('criar: o + abre o modal e a tarefa aparece', async () => {
        const user = userEvent.setup();
        api.post.mockResolvedValue({
          data: { id: 3, texto: 'Testar o Kanban', coluna: 'afazer',
          prioridade: 'Médio' },
          });
          desenharKanban();

          await user.click(await screen.findByTitle('Nova tarefa em A Fazer'));
          await user.type(screen.getByLabelText('Tarefa'), 'Testar o Kanban');
          await user.click(screen.getByRole('button', { name: 'Salvar' }));

          expect(api.post).toHaveBeenCalledWith('/tarefas', expect.objectContaining({
            texto: 'Testar o Kanban',
            coluna: 'afazer',
          }));
          expect(await screen.findByText('Testar o Kanban')).toBeInTheDocument();
});

test('com onSalvar que nunca responde, o botão vira "salvando..." e fica desabilitado', async () => {
    const user = userEvent.setup(); 

    await user.findByText('Salvando...')

    expect(screen.getByRole).toBeDisabled();
})