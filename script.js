
const ENDPOINT_BASE = 'http://127.0.0.1:5000/clientes';
const ENDPOINT_LISTA_TODOS = `${ENDPOINT_BASE}/lista`;


const formularioCriacao = document.getElementById('create-form');
const inputNomeCriacao = document.getElementById('create-name');
const inputCpfCriacao = document.getElementById('create-description');

const inputStatusCriacaoElement = document.getElementById('create-status');

const formularioAtualizacao = document.getElementById('update-form');
const inputAtualizacaoId = document.getElementById('update-id');
const inputNomeAtualizacao = document.getElementById('update-name');
const inputCpfAtualizacao = document.getElementById('update-description');
const inputStatusAtualizacaoElement = document.getElementById('update-status'); 
const botaoCancelarAtualizacao = document.getElementById('cancel-update');
const listaClientesElemento = document.getElementById('item-list');

// READ (Listar clientes)
async function buscarListarClientes() {
    listaClientesElemento.innerHTML = '<p>Carregando clientes...</p>';
    try {
        const resposta = await fetch(ENDPOINT_LISTA_TODOS);
        const dados = await resposta.json();
        console.log('Clientes recebidos:', dados);
        exibirClientesNaTela(dados);
    } catch (erro) {
        listaClientesElemento.innerHTML = `<p style="color:red">Erro ao buscar clientes: ${erro.message}</p>`;
    }
}

// CREATE
async function criarCliente(evento) {
    evento.preventDefault();

    const nome = inputNomeCriacao.value.trim();
    const cpf = inputCpfCriacao.value.trim();
    const status = inputStatusCriacaoElement.value.trim();

    const res = document.getElementById('res');
    res.innerHTML = ''; // Limpa mensagens anteriores

    if (!nome || !cpf) {
        res.innerHTML = '<p class="text-red-500">Preencha todos os campos</p>';
        return;
    }

    if (!/^\d{11}$/.test(cpf)) {
        res.innerHTML = '<p class="text-red-500">CPF inválido. Digite exatamente 11 números.</p>';
        setTimeout(() => {
            res.innerHTML = '';
        }, 4000);
        return;
    }

    

    try {
        const resposta = await fetch(ENDPOINT_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, cpf, status })
        });

        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.Mensagem || dados.mensagem);

        res.innerHTML = `<p class="text-green-600">${dados.mensagem}</p>`;
        inputNomeCriacao.value = '';
        inputCpfCriacao.value = '';
        inputStatusCriacaoElement.value = '';
        await buscarListarClientes();
    } catch (erro) {
        res.innerHTML = `<p class="text-red-500">Erro ao criar cliente: ${erro.message}</p>`;
        setTimeout(() => {
            res.innerHTML = '';
        }, 4000);
    }
}


// UPDATE
async function atualizarCliente(evento) {
    evento.preventDefault();
    const id = inputAtualizacaoId.value;
    const nome = inputNomeAtualizacao.value;
    const cpf = inputCpfAtualizacao.value;
    const status = inputStatusAtualizacaoElement.value;



    if (!id || !nome || !cpf || !status) {
        res2.innerHTML = '<p class="text-red-500">Preencha todos os campos para atualizar</p>';
        return;
    }

    if (!/^\d{11}$/.test(cpf)) {
        res2.innerHTML = '<p class="text-red-500">CPF inválido. Digite exatamente 11 números.</p>';
        setTimeout(() => {
            res2.innerHTML = '';
        }, 4000);
        return;
    }

    if (status.toLowerCase() !== 'ativo' && status.toLowerCase() !== 'bloqueado') {
        res2.innerHTML = '<p class="text-red-500">Erro ao criar cliente: Status inválido. Use ativo ou bloqueado.</p>';
        setTimeout(() => {
            res2.innerHTML = '';
        }, 4000);
        return;
        
    }
    
    try {
        const resposta = await fetch(`${ENDPOINT_BASE}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, cpf, status })
        });

        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.Mensagem || 'Erro ao atualizar');

        res2.innerHTML = `<p class="text-green-600">${dados.Mensagem}</p>`;
        esconderFormularioAtualizacao();
        await buscarListarClientes();
    } catch (erro) {
        res2.innerHTML = `<p class="text-red-500">Erro: ${erro.message}</p>`;
    }
}


// DELETE
async function excluirCliente(id) {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
        const resposta = await fetch(`${ENDPOINT_BASE}/${id}`, { method: 'DELETE' });
        const dados = await resposta.json();
        if (!resposta.ok) throw new Error(dados.mensagem);

        alert(dados.mensagem);
        await buscarListarClientes();
    } catch (erro) {
        alert(`Erro ao excluir cliente: ${erro.message}`);
    }
}

function exibirClientesNaTela(clientes) {
    listaClientesElemento.innerHTML = '';
    if (!clientes.length) {
        listaClientesElemento.innerHTML = '<p>Nenhum cliente encontrado.</p>';
        return;
    }
    console.log('Renderizando clientes:', clientes);
    for (const cliente of clientes) {
        const div = document.createElement('div');
        div.className = 'border border-gray-300 p-2 mb-3 rounded flex justify-between items-center';
        div.innerHTML = `
            <div class="corpo">
                <strong>${cliente.nome}</strong>
                <p><small>CPF: ${cliente.cpf}</small></p>
                <p><small>Status: ${cliente.status}</small></p>
                <p><small>ID: ${cliente.id}</small></p>
                <br>
                <button class="edit-btn">🖊 Editar</button>
                <button class="delete-btn">🗑 Excluir</button>
            
            </div>
            
        `;

        div.querySelector('.edit-btn').addEventListener('click', () => {
            exibirFormularioAtualizacao(cliente);
        });

        div.querySelector('.delete-btn').addEventListener('click', () => {
            excluirCliente(cliente.id);
        });

        listaClientesElemento.appendChild(div);
    }
}

function exibirFormularioAtualizacao(cliente) {
    inputAtualizacaoId.value = cliente.id;
    inputNomeAtualizacao.value = cliente.nome;
    inputCpfAtualizacao.value = cliente.cpf;
    inputStatusAtualizacaoElement.value = cliente.status; // Preenche o campo de status na edição

    formularioAtualizacao.classList.remove('hidden');
    formularioCriacao.classList.add('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function esconderFormularioAtualizacao() {
    inputAtualizacaoId.value = '';
    inputNomeAtualizacao.value = '';
    inputCpfAtualizacao.value = '';
    inputStatusAtualizacaoElement.value = ''; // Limpa o campo de status ao cancelar

    formularioAtualizacao.classList.add('hidden');
    formularioCriacao.classList.remove('hidden');
}

formularioCriacao.addEventListener('submit', criarCliente);
formularioAtualizacao.addEventListener('submit', atualizarCliente);
botaoCancelarAtualizacao.addEventListener('click', esconderFormularioAtualizacao);

document.addEventListener('DOMContentLoaded', buscarListarClientes);


document.addEventListener('DOMContentLoaded', () => {
    
    if (inputStatusCriacaoElement) {
        console.log('Valor inicial do status (CREATE):', inputStatusCriacaoElement.value);
    }
    if (inputStatusAtualizacaoElement) {
        console.log('Elemento de status (UPDATE) encontrado:', inputStatusAtualizacaoElement);
    }
});