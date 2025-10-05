document.addEventListener('DOMContentLoaded', () => {

  const btn = document.getElementById('actionBtn');
  const garden = document.getElementById('garden');
  const sky = document.getElementById('sky');
  const music = document.getElementById('music');
  let step = 0;

  const PETAL_COUNT = 24;
  const dateChars = "06 / 23 / 25".split("");
  const INITIAL_CLOUDS = dateChars.length;
  let cloudElems = [];

  function el(tag, cls){ const d=document.createElement(tag); if(cls) d.className=cls; return d; }

  // 🌸 Flower letters coordinates (framed inside garden)
  const lettersCoords = [];
  const letters = "I LOVE YOU MARY";
  const numFlowersPerLetter = 12;
  const fieldTop = window.innerHeight * 0.55;
  const fieldHeight = window.innerHeight * 0.35;
  const fieldWidth = window.innerWidth;
  const totalLetters = letters.replace(/ /g,"").length;
  let letterIndex = 0;

  letters.split("").forEach(char => {
    if(char === " ") return;
    for(let i=0;i<numFlowersPerLetter;i++){
      const x = fieldWidth*0.1 + letterIndex*(fieldWidth*0.8/totalLetters) + Math.random()*40-20;
      const y = fieldTop + Math.random()*fieldHeight;
      lettersCoords.push({x,y});
    }
    letterIndex++;
  });

  // Spawn initial clouds
  function spawnInitialClouds(){
    cloudElems = [];
    for(let i=0;i<INITIAL_CLOUDS;i++){
      const c = el('div','cloud'); 
      c.textContent = "";
      c.style.left = Math.random()*window.innerWidth + 'px';
      c.style.top = Math.random()*window.innerHeight*0.45 + 'px';
      sky.appendChild(c);
      cloudElems.push(c);
    }
  }

  // Place flowers
  function placeFlowers(){
    lettersCoords.forEach(p=>{
      const f = el('div','flower');
      f.style.left = p.x+'px';
      f.style.top = p.y+'px';
      f.style.backgroundImage = Math.random()<0.5 ? 'url(rose.png)' : 'url(hibiscus.png)';
      garden.appendChild(f);
      setTimeout(()=>{ f.style.opacity=1; f.style.transform='scale(1)'; }, Math.random()*800);
    });

    for(let i=0;i<PETAL_COUNT;i++){
      const p = el('div','petal');
      p.style.left = Math.random()*window.innerWidth+'px';
      p.style.top = -(Math.random()*200+20)+'px';
      p.style.animationDuration = (4+Math.random()*4)+'s';
      p.style.animationDelay = (Math.random()*5)+'s';
      garden.appendChild(p);
    }
  }

  // Clouds form date
  function cloudsFormDate(){
    const topBase = window.innerHeight*0.12;
    const arcHeight = 60;
    cloudElems.forEach((c,i)=>{
      const spacing = window.innerWidth / (cloudElems.length+1);
      const x = spacing*(i+1);
      const y = topBase - Math.sin((i/(cloudElems.length-1))*Math.PI)*arcHeight;
      c.textContent = dateChars[i];
      c.classList.add('letter');
      setTimeout(()=>{ c.style.left = x+'px'; c.style.top = y+'px'; c.style.opacity=1; }, i*200);
    });
  }

  // Button click
  btn.addEventListener('click', ()=>{
    if(step===0){
      placeFlowers();
      btn.textContent="Water the Garden";
      step=1;
    } else if(step===1){
      btn.textContent="Water Again";
      step=2;
    } else if(step===2){
      btn.textContent="Look Up";
      step=3;
    } else if(step===3){
      sky.classList.add('sunset');
      cloudsFormDate();

      if(music){
        music.volume = 0;
        music.play();
        let vol=0;
        const t = setInterval(()=>{
          vol+=0.02;
          music.volume = Math.min(0.55,vol);
          if(vol>=0.54) clearInterval(t);
        },120);
      }

      const msg = el('div'); 
      msg.id='finalMsg'; 
      msg.textContent="🌤️ Every flower blooms for you, sweetheart. 💕";
      document.getElementById('scene').appendChild(msg);
      setTimeout(()=>msg.style.opacity=1,1800);

      btn.style.display='none';
      step=4;
    }
  });

  spawnInitialClouds();

});
