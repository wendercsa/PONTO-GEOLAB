function login(){
 fetch('/login',{method:'POST',headers:{'Content-Type':'application/json'},
 body:JSON.stringify({email:email.value,senha:senha.value})})
 .then(r=>r.json()).then(d=>{
  localStorage.token=d.token;
  localStorage.user=JSON.stringify(d.user);
  location='home.html';
 });
}

function registrar(tipo){
 navigator.geolocation.getCurrentPosition(p=>{
  fetch('/ponto',{
   method:'POST',
   headers:{
    'Content-Type':'application/json',
    'Authorization':localStorage.token
   },
   body:JSON.stringify({
    tipo,
    lat:p.coords.latitude,
    lng:p.coords.longitude
   })
  });
 });
}

function carregar(){
 fetch('/registros',{
  headers:{'Authorization':localStorage.token}
 })
 .then(r=>r.json())
 .then(d=>{
  d.forEach(i=>{
   lista.innerHTML+=`<li>${i.data} - ${i.tipo} - ${i.hora}</li>`;
  });
 });
}

function pdf(){
 window.open('/pdf');
}
