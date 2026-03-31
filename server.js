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
   ✏️ EDITAR USUÁRIO
============================ */
app.put('/usuarios/:usuario', async (req, res) => {
  try {
    const { usuario } = req.params;
    const { nome, senha, tipo } = req.body;

    await mongoose.connection.db
      .collection('usuarios')
      .updateOne(
        { usuario },
        { $set: { nome, senha, tipo } }
      );

    res.send("Usuário atualizado com sucesso!");
  } catch (err) {
    res.status(500).send("Erro ao atualizar usuário");
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
   📍 CONFIGURAÇÃO DA EMPRESA (OPCIONAL)
============================ */
// 👉 Coloque a localização da sua empresa aqui (Google Maps)
const LAT_EMPRESA = -16.6869;
const LNG_EMPRESA = -49.2648;
const RAIO_METROS = 200;

/* ============================
   📏 FUNÇÃO DISTÂNCIA
============================ */
function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/* ============================
   🕒 BATER PONTO COM GEO
============================ */
app.post('/bater-ponto', async (req, res) => {
  try {
    const { tipo, nome, usuario, latitude, longitude } = req.body;

    // 🔥 VALIDA SE VEIO LOCALIZAÇÃO
    if (!latitude || !longitude) {
      return res.status(400).send("Localização não informada");
    }

    // 🔥 VALIDA DISTÂNCIA (OPCIONAL)
    const distancia = calcularDistancia(
      latitude,
      longitude,
      LAT_EMPRESA,
      LNG_EMPRESA
    );

    if (distancia > RAIO_METROS) {
      return res.status(403).send("Você não está na empresa!");
    }

    await mongoose.connection.db
      .collection('pontos')
      .insertOne({
        nome,
        usuario,
        tipo,
        latitude,
        longitude,
        data: new Date()
      });

    res.send("Ponto registrado com localização!");
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
