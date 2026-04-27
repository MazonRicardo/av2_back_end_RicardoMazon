const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let filmes = [];
let usuarios = [];
let favoritos = [];

let filmeIdCounter = 6;
let usuarioIdCounter = 4;
let favoritoIdCounter = 5;

function carregarDadosIniciais() {
    filmes = [
        { id: 1, titulo: "Duna: Parte Dois", genero: "Ficção Científica", ano_lancamento: 2024 },
        { id: 2, titulo: "Oppenheimer", genero: "Drama Histórico", ano_lancamento: 2023 },
        { id: 3, titulo: "Barbie", genero: "Comédia", ano_lancamento: 2023 },
        { id: 4, titulo: "The Batman", genero: "Ação", ano_lancamento: 2022 },
        { id: 5, titulo: "Tudo em Todo Lugar ao Mesmo Tempo", genero: "Ação / Comédia", ano_lancamento: 2022 }
    ];

    usuarios = [
        { id: 1, nome: "Ricardo Silva", email: "ricardo@email.com", plano: "Premium" },
        { id: 2, nome: "Ana Oliveira", email: "ana.oliveira@email.com", plano: "Básico" },
        { id: 3, nome: "João Mendes", email: "joao.mendes@email.com", plano: "Premium" }
    ];

    favoritos = [
        { id: 1, id_usuario: 1, id_filme: 1 },
        { id: 2, id_usuario: 1, id_filme: 5 },
        { id: 3, id_usuario: 2, id_filme: 3 },
        { id: 4, id_usuario: 3, id_filme: 2 }
    ];
}

carregarDadosIniciais();

function encontrarFilme(id) {
    return filmes.find(f => f.id === parseInt(id));
}

function encontrarUsuario(id) {
    return usuarios.find(u => u.id === parseInt(id));
}

// ================= FILMES =================

app.get('/filmes', (req, res) => res.json(filmes));

app.get('/filmes/:id', (req, res) => {
    const filme = encontrarFilme(req.params.id);
    if (!filme) return res.status(404).json({ erro: "Filme não encontrado" });
    res.json(filme);
});

app.post('/filmes', (req, res) => {
    const { titulo, genero, ano_lancamento } = req.body;
    if (!titulo || !genero || !ano_lancamento) {
        return res.status(400).json({ erro: "Campos obrigatórios" });
    }

    const novo = {
        id: filmeIdCounter++,
        titulo,
        genero,
        ano_lancamento: parseInt(ano_lancamento)
    };

    filmes.push(novo);
    res.status(201).json(novo);
});

app.delete('/filmes/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const usado = favoritos.some(f => f.id_filme === id);
    if (usado) return res.status(400).json({ erro: "Filme está em favoritos" });

    const index = filmes.findIndex(f => f.id === id);
    if (index === -1) return res.status(404).json({ erro: "Filme não encontrado" });

    filmes.splice(index, 1);
    res.json({ mensagem: "Filme removido" });
});

// ================= USUÁRIOS =================

app.get('/usuarios', (req, res) => res.json(usuarios));

app.get('/usuarios/:id', (req, res) => {
    const user = encontrarUsuario(req.params.id);
    if (!user) return res.status(404).json({ erro: "Usuário não encontrado" });
    res.json(user);
});

app.post('/usuarios', (req, res) => {
    const { nome, email, plano } = req.body;

    if (!nome || !email || !plano) {
        return res.status(400).json({ erro: "Campos obrigatórios" });
    }

    if (usuarios.some(u => u.email === email)) {
        return res.status(400).json({ erro: "Email já existe" });
    }

    if (!["Básico", "Premium"].includes(plano)) {
        return res.status(400).json({ erro: "Plano inválido" });
    }

    const novo = { id: usuarioIdCounter++, nome, email, plano };
    usuarios.push(novo);

    res.status(201).json(novo);
});

app.put('/usuarios/:id', (req, res) => {
    const user = encontrarUsuario(req.params.id);
    if (!user) return res.status(404).json({ erro: "Usuário não encontrado" });

    const { nome, email, plano } = req.body;

    if (email && usuarios.some(u => u.email === email && u.id !== user.id)) {
        return res.status(400).json({ erro: "Email já em uso" });
    }

    if (plano && !["Básico", "Premium"].includes(plano)) {
        return res.status(400).json({ erro: "Plano inválido" });
    }

    if (nome) user.nome = nome;
    if (email) user.email = email;
    if (plano) user.plano = plano;

    res.json(user);
});

app.delete('/usuarios/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const temFav = favoritos.some(f => f.id_usuario === id);
    if (temFav) return res.status(400).json({ erro: "Usuário possui favoritos" });

    const index = usuarios.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).json({ erro: "Usuário não encontrado" });

    usuarios.splice(index, 1);
    res.json({ mensagem: "Usuário removido" });
});

// ================= FAVORITOS =================

app.get('/favoritos', (req, res) => res.json(favoritos));

app.post('/favoritos', (req, res) => {
    const { id_usuario, id_filme } = req.body;

    if (!id_usuario || !id_filme) {
        return res.status(400).json({ erro: "Campos obrigatórios" });
    }

    if (!encontrarUsuario(id_usuario)) return res.status(404).json({ erro: "Usuário não encontrado" });
    if (!encontrarFilme(id_filme)) return res.status(404).json({ erro: "Filme não encontrado" });

    if (favoritos.some(f => f.id_usuario == id_usuario && f.id_filme == id_filme)) {
        return res.status(400).json({ erro: "Já favoritado" });
    }

    const novo = {
        id: favoritoIdCounter++,
        id_usuario: parseInt(id_usuario),
        id_filme: parseInt(id_filme)
    };

    favoritos.push(novo);
    res.status(201).json(novo);
});

app.get('/favoritos/usuario/:id_usuario', (req, res) => {
    const id = parseInt(req.params.id_usuario);

    const lista = favoritos
        .filter(f => f.id_usuario === id)
        .map(f => ({ ...f, filme: encontrarFilme(f.id_filme) }));

    res.json(lista);
});

app.delete('/favoritos/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = favoritos.findIndex(f => f.id === id);
    if (index === -1) return res.status(404).json({ erro: "Favorito não encontrado" });

    favoritos.splice(index, 1);
    res.json({ mensagem: "Favorito removido" });
});

// ================= SERVER =================

app.listen(port, () => {
    console.log(`🚀 Rodando em http://localhost:${port}`);
});
