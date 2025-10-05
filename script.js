const btn = document.getElementById('actionBtn');
const garden = document.getElementById('garden');
const sky = document.getElementById('sky');
const music = document.getElementById('music');
let step = 0;

// Flower positions for letters
const flowers = [
  {x:100,y:200,type:'rose'}, {x:140,y:200,type:'hibiscus'},
  {x:200,y:200,type:'rose'}, /* fill for "I ❤️ YOU MARY" */
];

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
