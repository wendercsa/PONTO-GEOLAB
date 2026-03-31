const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(express.static('public'));

// 🔥 CONEXÃO MONGO
mongoose.connect("mongodb+srv://admin:Geolab2026@cluster0.rhncglg.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("Mongo conectado"))
  .catch(err => console.log(err));

/* ============================
   🔐 LOGIN
============================ */
app.post('/login', async (req, res) => {
  const { usuario, senha } = req.body;

  const user = await mongoose.connection.db
    .collection('usuarios')
    .findOne({ usuario, senha });

  if (!user) {
    return res.status(401).send("Usuário ou senha inválidos");
  }

  res.json({
    nome: user.nome,
    tipo: user.tipo,
    usuario: user.usuario
  });
});

/* ============================
   👤 CADASTRO
============================ */
app.post('/cadastrar-usuario', async (req, res) => {
  const { usuario, senha, nome, tipo } = req.body;

  const existe = await mongoose.connection.db
    .collection('usuarios')
    .findOne({ usuario });

  if (existe) {
    return res.status(400).send("Usuário já existe");
  }

  await mongoose.connection.db
    .collection('usuarios')
    .insertOne({ usuario, senha, nome, tipo });

  res.send("Usuário cadastrado com sucesso!");
});

/* ============================
   📋 LISTAR USUÁRIOS
============================ */
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await mongoose.connection.db
      .collection('usuarios')
      .find({}, { projection: { senha: 0 } })
      .toArray();

    res.json(usuarios);
  } catch (err) {
    res.status(500).send("Erro ao buscar usuários");
  }
});

/* ============================
   ❌ EXCLUIR USUÁRIO
============================ */
app.delete('/usuarios/:usuario', async (req, res) => {
  try {
    const { usuario } = req.params;

    await mongoose.connection.db
      .collection('usuarios')
      .deleteOne({ usuario });

    res.send("Usuário removido com sucesso!");
  } catch (err) {
    res.status(500).send("Erro ao remover usuário");
  }
});

/* ============================
   🕒 BATER PONTO
============================ */
app.post('/bater-ponto', async (req, res) => {
  try {
    const { tipo, nome, usuario } = req.body;

    await mongoose.connection.db
      .collection('pontos')
      .insertOne({
        nome,
        usuario,
        tipo,
        data: new Date()
      });

    res.send("Ponto registrado com sucesso!");
  } catch (err) {
    res.status(500).send("Erro ao salvar ponto");
  }
});

/* ============================
   📊 HISTÓRICO
============================ */
app.get('/historico/:usuario', async (req, res) => {
  try {
    const { usuario } = req.params;

    const registros = await mongoose.connection.db
      .collection('pontos')
      .find({ usuario })
      .sort({ data: -1 })
      .toArray();

    res.json(registros);
  } catch (err) {
    res.status(500).send("Erro ao buscar histórico");
  }
});

/* ============================ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Rodando na porta", PORT));
