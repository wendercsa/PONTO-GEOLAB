const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 🔥 conexão segura
const client = new MongoClient(process.env.MONGO_URL);

let db;

async function conectar() {
  try {
    await client.connect();
    db = client.db();
    console.log("MongoDB conectado 🚀");
  } catch (err) {
    console.error("Erro ao conectar no Mongo:", err);
  }
}

conectar();

// LOGIN
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  if (email === "admin@geolab.com.br" && senha === "123") {
    return res.json({
      mensagem: "Login realizado",
      usuario: { email }
    });
  }

  return res.status(401).json({ mensagem: "Usuário inválido" });
});

// REGISTRAR PONTO
app.post('/ponto', async (req, res) => {
  try {
    const { tipo, email } = req.body;

    const registro = {
      tipo,
      email,
      data: new Date()
    };

    await db.collection('registros').insertOne(registro);

    res.send(`Ponto registrado: ${tipo}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao registrar ponto");
  }
});

// LISTAR
app.get('/registros/:email', async (req, res) => {
  try {
    const dados = await db
      .collection('registros')
      .find({ email: req.params.email })
      .sort({ data: 1 })
      .toArray();

    res.json(dados);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro ao buscar registros");
  }
});

// TESTE
app.get('/', (req, res) => {
  res.send("Geolab Sistema de Ponto 🚀");
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
