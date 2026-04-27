🎬 CineStream API

API REST desenvolvida com Node.js e Express para gerenciamento de filmes, usuários e favoritos.

---

🚀 Tecnologias utilizadas

- Node.js
- Express
- JavaScript

---

📂 Estrutura do Projeto

- Filmes → Cadastro, listagem e remoção
- Usuários → Cadastro, listagem, atualização e remoção
- Favoritos → Relacionamento entre usuários e filmes

---

⚙️ Como executar o projeto

1. Clone o repositório

git clone https://github.com/seu-usuario/seu-repositorio.git

2. Acesse a pasta

cd nome-do-projeto

3. Instale as dependências

npm install

4. Execute o servidor

npm start

ou em modo desenvolvimento:

npm run dev

---

🌐 Base da API

http://localhost:3000

---

📌 Endpoints

🎬 Filmes

Método| Rota| Descrição
GET| /filmes| Listar todos os filmes
GET| /filmes/:id| Buscar filme por ID
POST| /filmes| Cadastrar novo filme
DELETE| /filmes/:id| Remover filme

---

👤 Usuários

Método| Rota| Descrição
GET| /usuarios| Listar usuários
GET| /usuarios/:id| Buscar usuário por ID
POST| /usuarios| Criar usuário
PUT| /usuarios/:id| Atualizar usuário
DELETE| /usuarios/:id| Remover usuário

---

⭐ Favoritos

Método| Rota| Descrição
GET| /favoritos| Listar favoritos
GET| /favoritos/usuario/:id_usuario| Favoritos por usuário
POST| /favoritos| Adicionar favorito
DELETE| /favoritos/:id| Remover favorito

---

🧠 Regras de Negócio

- IDs são gerados automaticamente
- Não é possível:
  - Favoritar filme inexistente
  - Favoritar filme duplicado
  - Deletar usuário com favoritos
  - Deletar filme que está em favoritos
- Emails de usuários são únicos

---

💾 Persistência

Os dados são armazenados em memória (arrays), ou seja:

- Funcionam enquanto o servidor estiver rodando
- Ao reiniciar o servidor, os dados são resetados

---

📦 Exemplo de requisição (POST /filmes)

{
  "titulo": "Matrix",
  "genero": "Ficção",
  "ano_lancamento": 1999
}

---

👨‍💻 Autor

Ricardo Mazon

---

📄 Licença

Este projeto está sob a licença ISC.
