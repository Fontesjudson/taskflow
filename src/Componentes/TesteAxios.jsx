import axios from 'axios';
import { useState } from 'react';

function TesteAxios() {
    const [cep, setCep] = useState('');

    async function exemplo() {
    }

    const BuscarEndereço = async (cep) => {
        try {

            const resposta = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

            console.log('cep data', resposta.data);
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <div>
            <button onClick={exemplo}> Testar Axios</button>
            <br/>
        <input type="text" placeholder="Digite o CEP" value={cep} onChange={(e) => setCep(e.target.value)} />
        <button onClick={BuscarEndereço}>Buscar Endereço</button>
        </div>
    );
}
export default TesteAxios;