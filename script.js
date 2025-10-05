const btn = document.getElementById('actionBtn');
const garden = document.getElementById('garden');
const sky = document.getElementById('sky');
const music = document.getElementById('music');
let step = 0;

// Precise coordinates for each letter stroke
const flowers = [
  // I
  {x:100,y:200,type:'rose'},{x:100,y:230,type:'rose'},{x:100,y:260,type:'rose'},{x:100,y:290,type:'rose'},
  // L
  {x:140,y:200,type:'hibiscus'},{x:140,y:230,type:'hibiscus'},{x:140,y:260,type:'hibiscus'},
  {x:170,y:260,type:'hibiscus'},{x:200,y:260,type:'hibiscus'},
  // O
  {x:240,y:200,type:'rose'},{x:270,y:200,type:'rose'},{x:300,y:230,type:'rose'},
  {x:270,y:260,type:'rose'},{x:240,y:260,type:'rose'},
  // V
  {x:340,y:200,type:'hibiscus'},{x:360,y:260,type:'hibiscus'},{x:380,y:200,type:'hibiscus'},
  // E
  {x:420,y:200,type:'rose'},{x:420,y:230,type:'rose'},{x:420,y:260,type:'rose'},
  {x:450,y:200,type:'rose'},{x:450,y:230,type:'rose'},{x:480,y:200,type:'rose'},
  // Y
  {x:520,y:200,type:'hibiscus'},{x:540,y:230,type:'hibiscus'},{x:560,y:200,type:'hibiscus'},{x:540,y:260,type:'hibiscus'},
  // O
  {x:600,y:200,type:'rose'},{x:630,y:200,type:'rose'},{x:660,y:230,type:'rose'},{x:630,y:260,type:'rose'},{x:600,y:260,type:'rose'},
  // U
  {x:700,y:200,type:'hibiscus'},{x:700,y:260,type:'hibiscus'},{x:730,y:260,type:'hibiscus'},
  {x:760,y:260,type:'hibiscus'},{x:760,y:200,type:'hibiscus'},
  // M
  {x:800,y:260,type:'rose'},{x:800,y:200,type:'rose'},{x:830,y:230,type:'rose'},{x:860,y:200,type:'rose'},{x:860,y:260,type:'rose'},
  // A
  {x:900,y:260,type:'hibiscus'},{x:920,y:200,type:'hibiscus'},{x:940,y:260,type:'hibiscus'},{x:920,y:230,type:'hibiscus'},
  // R
  {x:980,y:260,type:'rose'},{x:980,y:200,type:'rose'},{x:1010,y:200,type:'rose'},{x:1010,y:230,type:'rose'},{x:1010,y:260,type:'rose'},
  // Y
  {x:1050,y:200,type:'hibiscus'},{x:1070,y:230,type:'hibiscus'},{x:1090,y:200,type:'hibiscus'},{x:1070,y:260,type:'hibiscus'}
];

// Plant flowers
function plantSeeds() {
  flowers.forEach(pos=>{
    const f=document.createElement('div');
    f.classList.add('flower');
    f.style.left = pos.x + Math.random()*4 - 2 + 'px'; // slight randomness
    f.style.top = pos.y + Math.random()*4 - 2 + 'px';
    f.style.backgroundImage = pos.type==='rose'?'url(rose.png)':'url(hibiscus.png)';
    garden.appendChild(f);
  });
  // Falling petals
  for(let i=0;i<20;i++){
    const p=document.createElement('div');
    p.classList.add('petal');
    p.style.left=Math.random()*window.innerWidth+'px';
    p.style.top='-20px';
    p.style.animationDelay=Math.random()*5+'s';
    garden.appendChild(p);
  }
  btn.textContent="Water the Garden"; step++;
}

function waterOnce() {
  document.querySelectorAll('.flower').forEach(f=>{
    f.style.opacity=1;
    f.style.transform="scale(0.5) rotate(-5deg)";
  });
  btn.textContent="Water Again"; step++;
}

function waterAgain() {
  document.querySelectorAll('.flower').forEach((f,i)=>{
    setTimeout(()=>f.style.transform="scale(1) rotate(0deg)", i*50);
  });
  btn.textContent="Look Up"; step++;
}

function lookUp() {
  btn.style.display="none";
  music.volume=0; music.play();
  let vol=0; const fade=setInterval(()=>{ if(vol<0.5){vol+=0.01; music.volume=vol;} else clearInterval(fade); },100);

  sky.style.transition="transform 8s ease-in-out"; sky.style.transform="translateY(-100px)";
  garden.style.transition="transform 8s ease-in-out"; garden.style.transform="translateY(-50px)";

  const cloudText="06 / 23 / 2024";
  cloudText.split("").forEach((c,i)=>{
    const cloud=document.createElement('div');
    cloud.classList.add('cloud');
    cloud.style.left=(100+i*40)+'px';
    cloud.style.top="50px";
    cloud.textContent=c;
    sky.appendChild(cloud);
    setTimeout(()=>{ cloud.style.opacity=1; cloud.style.transform="translateX(20px)"; }, i*300);
  });

  setTimeout(()=>{
    const msg=document.createElement('div'); msg.id='finalMsg';
    msg.textContent="🌤️ Every flower blooms for you, sweetheart. 💕"; sky.appendChild(msg);
    setTimeout(()=>msg.style.opacity=1,500);
  },4000);
}

btn.addEventListener('click', () => {
  if(step===0) plantSeeds();
  else if(step===1) waterOnce();
  else if(step===2) waterAgain();
  else if(step===3) lookUp();
});
