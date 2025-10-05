const btn = document.getElementById('actionBtn');
const garden = document.getElementById('garden');
const sky = document.getElementById('sky');
const music = document.getElementById('music');
let step = 0;

// Base letter coordinates
const baseLetters = [
  // I
  {x:100, y:200, type:'rose', w:10, h:60},
  // L
  {x:150, y:200, type:'hibiscus', w:40, h:60},
  // O
  {x:250, y:200, type:'rose', w:60, h:60},
  // V
  {x:350, y:200, type:'hibiscus', w:60, h:60},
  // E
  {x:450, y:200, type:'rose', w:50, h:60},
  // Y
  {x:520, y:200, type:'hibiscus', w:50, h:60},
  // O
  {x:600, y:200, type:'rose', w:60, h:60},
  // U
  {x:700, y:200, type:'hibiscus', w:60, h:60},
  // M
  {x:800, y:200, type:'rose', w:60, h:60},
  // A
  {x:900, y:200, type:'hibiscus', w:50, h:60},
  // R
  {x:980, y:200, type:'rose', w:50, h:60},
  // Y
  {x:1050, y:200, type:'hibiscus', w:50, h:60},
];

// Generate multiple flowers for each letter
function generateFlowers() {
  const flowers = [];
  baseLetters.forEach(letter=>{
    const cols = Math.floor(letter.w / 10);
    const rows = Math.floor(letter.h / 10);
    for(let i=0;i<cols;i++){
      for(let j=0;j<rows;j++){
        flowers.push({
          x: letter.x + i*10 + Math.random()*5, 
          y: letter.y + j*10 + Math.random()*5,
          type: letter.type
        });
      }
    }
  });
  return flowers;
}

const flowers = generateFlowers();

btn.addEventListener('click', () => {
  if(step===0) plantSeeds();
  else if(step===1) waterOnce();
  else if(step===2) waterAgain();
  else if(step===3) lookUp();
});

function plantSeeds() {
  flowers.forEach(pos=>{
    const f = document.createElement('div');
    f.classList.add('flower');
    f.style.left = pos.x+'px';
    f.style.top = pos.y+'px';
    f.style.backgroundImage = pos.type==='rose'?'url(rose.png)':'url(hibiscus.png)';
    garden.appendChild(f);
  });
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

function plantSeeds() {
  flowers.forEach(pos=>{
    const f = document.createElement('div');
    f.classList.add('flower');
    f.style.left = pos.x+'px'; f.style.top = pos.y+'px';
    f.style.backgroundImage = pos.type==='rose'?'url(rose.png)':'url(hibiscus.png)';
    garden.appendChild(f);

    const leaf = document.createElement('div');
    leaf.classList.add('leaf');
    leaf.style.left = (pos.x+Math.random()*20-10)+'px';
    leaf.style.top = (pos.y+Math.random()*20-10)+'px';
    garden.appendChild(leaf);
  });
  // Create falling petals
  for(let i=0;i<20;i++){
    const p = document.createElement('div');
    p.classList.add('petal');
    p.style.left = Math.random()*window.innerWidth+'px';
    p.style.top = -20+'px';
    p.style.animationDelay = Math.random()*5+'s';
    garden.appendChild(p);
  }
  btn.textContent="Water the Garden"; step++;
}

function waterOnce() {
  document.querySelectorAll('.flower').forEach(f=>{ f.style.opacity=1; f.style.transform="scale(0.5) rotate(-5deg)"; });
  document.querySelectorAll('.leaf').forEach(l=>l.style.opacity=1);
  btn.textContent="Water Again"; step++;
}

function waterAgain() {
  document.querySelectorAll('.flower').forEach((f,i)=>{ setTimeout(()=>f.style.transform="scale(1) rotate(0deg)",i*150); });
  btn.textContent="Look Up"; step++;
}

function lookUp() {
  btn.style.display="none";
  music.volume=0; music.play();
  let vol=0; const fade=setInterval(()=>{ if(vol<0.5){vol+=0.01; music.volume=vol;} else clearInterval(fade); },100);

  // Sky pan
  sky.style.transition="transform 8s ease-in-out"; sky.style.transform="translateY(-100px)";
  garden.style.transition="transform 8s ease-in-out"; garden.style.transform="translateY(-50px)";

  // Clouds
  const cloudText="06 / 23 / 2024";
  cloudText.split("").forEach((c,i)=>{
    const cloud=document.createElement('div');
    cloud.classList.add('cloud'); cloud.style.left=(100+i*40)+'px'; cloud.style.top="50px"; cloud.textContent=c;
    sky.appendChild(cloud); setTimeout(()=>{ cloud.style.opacity=1; cloud.style.transform="translateX(20px)"; }, i*300);
  });

  // Butterflies
  for(let i=0;i<5;i++){
    const b=document.createElement('div');
    b.classList.add('butterfly'); b.style.backgroundImage='url(butterfly.png)';
    b.style.left=Math.random()*window.innerWidth+'px'; b.style.top=Math.random()*200+'px';
    sky.appendChild(b);
  }

  // Final message
  setTimeout(()=>{
    const msg=document.createElement('div'); msg.id='finalMsg';
    msg.textContent="🌤️ Every flower blooms for you, sweetheart. 💕"; sky.appendChild(msg);
    setTimeout(()=>msg.style.opacity=1,500);
  },4000);
}
