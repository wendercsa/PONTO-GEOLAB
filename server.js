const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// 🔥 IMPORTANTE: usar variável do Render
const MONGO = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/geolab";

mongoose.connect(MONGO)
.then(()=>console.log("Mongo conectado"))
.catch(err=>console.log(err));

// MODELOS
const User = mongoose.model('User', {
  nome: String,
  email: String,
  senha: String,
  tipo: String
});

const Registro = mongoose.model('Registro', {
  email: String,
  tipo: String,
  data: String,
  hora: String,
  lat: Number,
  lng: Number
});

// LOGIN
app.post('/login', async (req,res)=>{
 const user = await User.findOne(req.body);
 if(!user) return res.status(401).send("Erro login");
 const token = jwt.sign({email:user.email}, "segredo");
 res.json({token, user});
});

// AUTH
function auth(req,res,next){
 try{
  const decoded = jwt.verify(req.headers.authorization,"segredo");
  req.user = decoded;
  next();
 }catch{
  res.status(401).send("Token inválido");
 }
}

// REGISTRO
app.post('/ponto', auth, async (req,res)=>{
 const now = new Date();

 await Registro.create({
  email:req.user.email,
  tipo:req.body.tipo,
  data:now.toLocaleDateString('pt-BR'),
  hora:now.toLocaleTimeString('pt-BR'),
  lat:req.body.lat,
  lng:req.body.lng
 });

 res.send("OK");
});

// ESPELHO
app.get('/registros', auth, async (req,res)=>{
 const dados = await Registro.find({email:req.user.email});
 res.json(dados);
});

// PORTA RENDER
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("Rodando..."));
