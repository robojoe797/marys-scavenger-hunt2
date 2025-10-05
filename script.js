const btn = document.getElementById('actionBtn');
const garden = document.getElementById('garden');
const sky = document.getElementById('sky');
const music = document.getElementById('music');
let step = 0;

// Config
const PETAL_COUNT=24;
const INITIAL_CLOUDS=11; // matches characters in "06 / 23 / 2024"

// Helper
function el(tag,cls){const d=document.createElement(tag); if(cls)d.className=cls; return d;}

// Flower letters coordinates (bigger letters, more pronounced)
const lettersCoords=[];
const startX=100; const startY=50; const letterSpacing=60;
const letters="I LOVE YOU MARY";
letters.split("").forEach((char,i)=>{
  if(char===" "){return;}
  // place 12 flowers per letter
  for(let j=0;j<12;j++){
    const x=startX+i*letterSpacing + Math.random()*40-20;
    const y=startY + Math.random()*60;
    lettersCoords.push({x,y});
  }
});

// Clouds for date characters
const dateChars="06 / 23 / 2024".split("");
let cloudElems=[];

// Spawn initial drifting clouds
function spawnInitialClouds(){
  for(let i=0;i<INITIAL_CLOUDS;i++){
    const c=el('div','cloud'); c.textContent="";
    c.style.left=Math.random()*window.innerWidth+'px';
    c.style.top=Math.random()*window.innerHeight*0.45+'px';
    sky.appendChild(c); cloudElems.push(c);
  }
}

// Place flowers
function placeFlowers(){
  lettersCoords.forEach(p=>{
    const f=el('div','flower');
    f.style.left=p.x+'px'; f.style.top=p.y+'px';
    f.style.backgroundImage=Math.random()<0.5?'url(rose.png)':'url(hibiscus.png)';
    garden.appendChild(f);
    setTimeout(()=>{f.style.opacity=1; f.style.transform='scale(1)';}, Math.random()*800);
  });
  // Petals
  for(let i=0;i<PETAL_COUNT;i++){
    const p=el('div','petal');
    p.style.left=Math.random()*window.innerWidth+'px';
    p.style.top=-(Math.random()*200+20)+'px';
    p.style.animationDuration=(4+Math.random()*4)+'s';
    p.style.animationDelay=(Math.random()*5)+'s';
    garden.appendChild(p);
  }
}

// Clouds form date in upward arc
function cloudsFormDate(){
  const topBase=window.innerHeight*0.12;
  const arcHeight=60;
  cloudElems.forEach((c,i)=>{
    const x=50+i*(window.innerWidth-100)/cloudElems.length;
    const y=topBase - Math.sin((i/cloudElems.length)*Math.PI)*arcHeight;
    c.textContent=dateChars[i] || "";
    c.classList.add('letter');
    setTimeout(()=>{c.style.left=x+'px'; c.style.top=y+'px'; c.style.opacity=1;}, i*200);
  });
}

// Button clicks
btn.addEventListener('click',()=>{
  if(step===0){
    placeFlowers(); btn.textContent="Water the Garden"; step=1;
  }else if(step===1){
    btn.textContent="Water Again"; step=2;
  }else if(step===2){
    btn.textContent="Look Up"; step=3;
  }else if(step===3){
    sky.classList.add('sunset');
    cloudsFormDate();
    if(music){music.volume=0; music.play(); let vol=0; const t=setInterval(()=>{vol+=0.02; music.volume=Math.min(0.55,vol); if(vol>=0.54)clearInterval(t);},120);}
    const msg=el('div'); msg.id='finalMsg'; msg.textContent="🌤️ Every flower blooms for you, sweetheart. 💕"; document.getElementById('scene').appendChild(msg);
    setTimeout(()=>msg.style.opacity=1,1800);
    btn.style.display='none';
    step=4;
  }
});

spawnInitialClouds();
