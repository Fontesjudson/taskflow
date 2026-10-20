import axios from 'axios';

export function mensagensDeErro(erro) {
    const dados = erro.response?.data?.erro;
    if (!dados) {
        return 'Não foi possível conectar à API.';
    }
    if (dados.detalhes) return dados.detalhes;
    return [dados.mensagem];
}

  const api = axios.create({
    baseURL: import.meta.env.VITE_URL_BSSE_API,
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = 'Bearer ${token}';
    }
    return config;
});

api.interceptors.response.use(
    resposta => resposta,
    erro => {
        const ehlogin = erro.config.url?.includes('/auth/login');
        if (erro.response?.status === 401 && !ehlogin) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(erro);
    }
);
export default api