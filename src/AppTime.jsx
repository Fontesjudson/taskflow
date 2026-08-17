function AppTime() {
    const minhaPromise = new Promise((resolve, reject) => {
    
        setTimeout(() => {
            const operacaodeuCerto = true; // Simulando uma operação assíncrona
            if (operacaodeuCerto) {
                resolve('Dados chegaram!');
            } else {
                reject('A operação falhou.');
            }
        }, 5000);
    });

    async function buscarUsuario(id) {
        try {
            const resposta = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
            const usuario = await resposta.json();
            console.log('Nome', usuario.name);
        } catch (error) {
            console.error('Erro:', error.message);
            return;
        } finally {
            console.log('Finalizado');
        }
    }

    function execPromise() {
        const minhaPromise = new Promise((resolve, reject) => {

            setTimeout(() => {
                const operacaoDeuCerto = true;
                if (operacaoDeuCerto) {
                    resolve('Dados chegaram!');
                } else {
                    reject('A operação falhou.');
                }
            }, 5000);
        });

        minhaPromise
            .then((mensagem) => {
                console.log('Sucesso: ' + mensagem);
            })
            .catch((erro) => {
                console.error('Erro: ' + erro);
            });
            console.log('Promise criada, aguardando o resultado...');
    }


    return (
        <div>
            <button onClick={() => {
                minhaPromise
                    .then((mensagem) => {
                        console.log('Sucesso: ' + mensagem);
                    })
                    .catch((erro) => {
                        console.error('Erro: ' + erro);
                    });
                    console.log('Promise criada, aguardando o resultado...');
            }}>
                Executar Operação
            </button>
            <button onClick={execPromise}>Testa promise (função)</button>
            <button onClick={() => buscarUsuario(1)}>Buscar usuário</button>
            <h1>AppTime</h1>
        </div>
    );
}

export default AppTime;