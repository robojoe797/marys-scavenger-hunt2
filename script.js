const btn = document.getElementById('actionBtn');
const garden = document.getElementById('garden');
const sky = document.getElementById('sky');
const music = document.getElementById('music');
let step = 0;

// Config
const PETAL_COUNT = 24;

// Date string and cloud config
const dateChars = "06 / 23 / 25".split("");
const INITIAL_CLOUDS = dateChars.length;
let cloudElems = [];

// Helper to create element
function el(tag, cls){ const d=document.createElement(tag); if(cls) d.className=cls; return d; }

// 🌸 Flower letters coordinates (framed inside garden)
const lettersCoords = [];
const letters = "I LOVE YOU MARY";
const numFlowersPerLetter = 12;
const fieldTop = window.innerHeight * 0.55; // top of garden
const fieldHeight = window.innerHeight * 0.35; // height of garden
const fieldWidth = window.innerWidth;
const totalLetters = letters.replace(/ /g,"").length;
let letterIndex = 0;

letters.split("").forEach(char=>{
  if(char===" ") return;
  for(let i=0;i<numFlowersPerLetter;i++){
    const x = fieldWidth*0.1 + letterIndex*(fieldWidth*0.8/totalLetters) + Math.random()*40-20;
    const y = fieldTop + Math.random()*fieldHeight; // stay within garden
    lettersCoords.push({x,y});
  }
  letterIndex++;
});

// Spawn initial clouds
function spawnInitialClouds(){
  for(let i=0;i<INITIAL_CLOUDS;i++){
    const c = el('div','cloud'); c.textContent = "";
    c.style.left = Math.random()*window.innerWidth + 'px';
    c.style.top = Math.random()*window.innerHeight*0.45 + 'px';
    sky.appendChild(c);
    cloudElems.push(c);
  }
}

// Place flowers on ground
function placeFlowers(){
  lettersCoords.forEach(p=>{
    const f = el('div','flower');
    f.style.left = p.x + 'px';
    f.style.top = p.y + 'px';
    f.style.backgroundImage = Math.random()<0.5 ? 'url(rose.png)' : 'url(hibiscus.png)';
    garden.appendChild(f);
    setTimeout(()=>{ f.style.opacity=1; f.style.transform='scale(1)'; }, Math.random()*800);
  });

  // Petals
  for(let i=0;i<PETAL_COUNT;i++){
    const p

  
