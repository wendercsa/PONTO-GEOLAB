const express = require('express');
const mongoose = require('mongoose');

const app = express();

// 🔥 CONEXÃO MONGO (APENAS UMA VEZ!)
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://admin:Geolab2026@cluster0.rhncglg.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("Mongo conectado"))
  .catch(err => console.log(err));

// 🔥 ESSENCIAL
app.use(express.json());
app.use(express.static('public'));

// =============================
// 🔐 LOGIN (NOVO)
// =============================

// 👤 usuários fixos (simples por enquanto)
const usuarios = [
  { usuario: "wender", senha: "123" },
  { usuario: "admin", senha: "admin" }
];

// 🔐 ROTA LOGIN
app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  const user = usuarios.find(
    u => u.usuario === usuario && u.senha === senha
  );

  if (user) {
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
});

// =============================
// 🔥 ROTAS DO SISTEMA
// =============================

// 🔥 ROTA PRINCIPAL
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// 🔥 SALVAR PONTO
app.post('/bater-ponto', async (req, res) => {
  try {
    const { tipo, nome } = req.body;

    const registro = {
      nome,
      tipo,
      data: new Date()
    };

    await mongoose.connection.db
      .collection('pontos')
      .insertOne(registro);

    res.send("Ponto registrado com sucesso!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Erro ao salvar ponto");
  }
});

// 🔥 BUSCAR HISTÓRICO
app.get('/historico', async (req, res) => {
  try {
    const registros = await mongoose.connection.db
      .collection('pontos')
      .find()
      .sort({ data: -1 })
      .toArray();

    res.json(registros);
  } catch (err) {
    console.log(err);
    res.status(500).send("Erro ao buscar histórico");
  }
});

// =============================
// 🚀 PORTA (RENDER)
// =============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Rodando na porta", PORT);
});
