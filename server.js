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
   📋 LISTAR
============================ */
app.get('/usuarios', async (req, res) => {
  const usuarios = await mongoose.connection.db
    .collection('usuarios')
    .find({}, { projection: { senha: 0 } })
    .toArray();

  res.json(usuarios);
});

/* ============================
   ✏️ EDITAR
============================ */
app.put('/usuarios/:usuario', async (req, res) => {
  const { usuario } = req.params;
  const { nome, senha, tipo } = req.body;

  await mongoose.connection.db
    .collection('usuarios')
    .updateOne(
      { usuario },
      { $set: { nome, senha, tipo } }
    );

  res.send("Usuário atualizado com sucesso!");
});

/* ============================
   ❌ EXCLUIR
============================ */
app.delete('/usuarios/:usuario', async (req, res) => {
  const { usuario } = req.params;

  await mongoose.connection.db
    .collection('usuarios')
    .deleteOne({ usuario });

  res.send("Usuário removido com sucesso!");
});

/* ============================
   🧠 VALIDAÇÃO DE FLUXO
============================ */
function validarFluxo(ultimo, novo) {

  if (!ultimo && novo !== 'entrada') return false;

  if (ultimo === 'entrada' && !['intervalo','saida'].includes(novo)) return false;

  if (ultimo === 'intervalo' && novo !== 'retorno') return false;

  if (ultimo === 'retorno' && novo !== 'saida') return false;

  if (ultimo === 'saida' && novo !== 'entrada') return false;

  return true;
}

/* ============================
   🕒 BATER PONTO (NÍVEL HARD)
============================ */
app.post('/bater-ponto', async (req, res) => {
  try {
    const { tipo, nome, usuario } = req.body;

    if (!tipo || !nome || !usuario) {
      return res.status(400).send("Dados inválidos");
    }

    const collection = mongoose.connection.db.collection('pontos');

    // 🔥 BUSCAR ÚLTIMO REGISTRO
    const ultimo = await collection.findOne(
      { usuario },
      { sort: { data: -1 } }
    );

    // 🚫 BLOQUEIO DUPLICADO
    if (ultimo && ultimo.tipo === tipo) {
      return res.status(400).send("Ponto duplicado bloqueado!");
    }

    // 🚫 BLOQUEIO CLIQUE RÁPIDO (30s)
    if (ultimo) {
      const diff = (new Date() - new Date(ultimo.data)) / 1000;

      if (diff < 30) {
        return res.status(400).send("Aguarde alguns segundos para novo registro");
      }
    }

    // 🚫 VALIDAÇÃO DE FLUXO
    const ultimoTipo = ultimo ? ultimo.tipo : null;

    if (!validarFluxo(ultimoTipo, tipo)) {
      return res.status(400).send("Sequência de ponto inválida!");
    }

    // ✅ SALVAR
    await collection.insertOne({
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

  const { usuario } = req.params;

  const registros = await mongoose.connection.db
    .collection('pontos')
    .find({ usuario })
    .sort({ data: -1 })
    .toArray();

  res.json(registros);
});

/* ============================ */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Rodando na porta", PORT));
