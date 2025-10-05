const btn = document.getElementById('actionBtn');
const garden = document.getElementById('garden');
const sky = document.getElementById('sky');
const music = document.getElementById('music');
let step = 0;

// Flower & cloud config
const FLOWER_SIZE = 25;
const PETAL_COUNT = 24;
const INITIAL_CLOUDS = 20;

// Helper
function el(tag,cls){ const d=document.createElement(tag); if(cls)d.className=cls; return d; }

// 🌸 Flower coordinates for "I LOVE YOU MARY" (rough manual layout)
const lettersCoords = [
  // X,Y for each flower (adjusted for curve), example small array
  {x:100,y:50},{x:120,y:50},{x:140,y:50},{x:160,y:50},
  {x:220,y:50},{x:240,y:50},{x:260,y:50},{x:280,y:50},
  {x:320,y:50},{x:340,y:50},{x:360,y:50},{x:380,y:50},
  {x:420,y:50},{x:440,y:50},{x:460,y:50},{x:480,y:50},
  {x:520,y:50},{x:540,y:50},{x:560,y:50},{x:580,y:50}
]; // Add more coordinates for denser letters

// Clouds array
let cloudElems=[];

// Spawn initial drifting clouds
function spawnInitialClouds(){
  for(let i=0;i<INITIAL_CLOUDS;i++){
    const c=el('div','cloud');
    const left=Math.random()*window.innerWidth;
    const top=Math.random()*window.innerHeight*0.45;
    c.style.left=left+'px'; c.style.top=top+'px';
    sky.appendChild(c);
    cloudElems.push(c);
  }
}

// Place flowers on ground
function placeFlowers(){
  lettersCoords.forEach(p=>{
    const f=el('div','flower');
    f.style.left=p.x+'px'; f.style.top=p.y+'px';
    f.style.backgroundImage=Math.random()<0.5 ? 'url(rose.png)' : 'url(hibiscus.png)';
    garden.appendChild(f);
    setTimeout(()=>{f.style.opacity=1; f.style.transform='scale(1)';}, Math.random()*800);
  });
  // petals
  for(let i=0;i<PETAL_COUNT;i++){
    const p=el('div','petal');
    p.style.left=Math.random()*window.innerWidth+'px';
    p.style.top=-(Math.random()*200+20)+'px';
    p.style.animationDuration=(4+Math.random()*4)+'s';
    p.style.animationDelay=(Math.random()*5)+'s';
    garden.appendChild(p);
  }
}

// Clouds form upward arc for date
function cloudsFormDate(){
  const dateText="06 / 23 / 2024";
  const topBase=window.innerHeight*0.12;
  const arcHeight=60;
  cloudElems.forEach((c,i)=>{
    const x=50+ i*(window.innerWidth-100)/cloudElems.length;
    const y=topBase - Math.sin((i/cloudElems.length)*Math.PI)*arcHeight;
    c.classList.add('letter');
    setTimeout(()=>{c.style.left=x+'px'; c.style.top=y+'px'; c.style.opacity=1;}, i*150);
  });
}

// Button clicks
btn.addEventListener('click',()=>{
  if(step===0){
    placeFlowers();
    btn.textContent="Water the Garden";
    step=1;
  }else if(step===1){
    // water animation optional
    btn.textContent="Water Again";
    step=2;
  }else if(step===2){
    // final bloom optional
    btn.textContent="Look Up";
    step=3;
  }else if(step===3){
    // sunset sky
    sky.classList.add('sunset');
    cloudsFormDate();
    if(music){music.volume=0; music.play(); let vol=0; const t=setInterval(()=>{vol+=0.02; music.volume=Math.min(0.55,vol); if(vol>=0.54)clearInterval(t);},120);}
    const msg=el('div'); msg.id='finalMsg'; msg.textContent="🌤️ Every flower blooms for you, sweetheart. 💕"; document.getElementById('scene').appendChild(msg);
    setTimeout(()=>msg.style.opacity=1, 1800);
    btn.style.display='none';
    step=4;
  }
});

spawnInitialClouds();
