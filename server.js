const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const PDFDocument = require('pdfkit');

const app = express();
app.use(express.json());
app.use(express.static('public'));

mongoose.connect("mongodb://127.0.0.1:27017/geolab");

// MODELS
const User = mongoose.model('User', {
  nome: String,
  email: String,
  senha: String,
  tipo: String,
  empresa: String
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
 if(!user) return res.status(401).send("Erro");
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

// PONTO
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

// REGISTROS
app.get('/registros', auth, async (req,res)=>{
 const dados = await Registro.find({email:req.user.email});
 res.json(dados);
});

// PDF
app.get('/pdf', auth, async (req,res)=>{
 const dados = await Registro.find({email:req.user.email});
 const doc = new PDFDocument();
 res.setHeader('Content-Type','application/pdf');
 doc.pipe(res);
 doc.text("Folha de Ponto\n\n");
 dados.forEach(r=>doc.text(`${r.data} - ${r.tipo} - ${r.hora}`));
 doc.end();
});

app.listen(3000);
