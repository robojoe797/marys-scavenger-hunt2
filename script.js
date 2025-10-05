/* script.js - fully self-contained */

/*
Assets needed in the same folder:
 - rose.png      (red rose, ~200x200 or similar)
 - hibiscus.png  (pink hibiscus)
 - butterfly.png (optional if you want butterflies)
 - nature.mp3    (soft loop)
Place these files in the same repo root as index.html
*/

const btn = document.getElementById('actionBtn');
const garden = document.getElementById('garden');
const sky = document.getElementById('sky');
const music = document.getElementById('music');
let step = 0;

// config
const FLOWER_SIZE = 25;    // px
const DENSITY_STEP = 8;    // sampling step for text->flowers (smaller => more flowers)
const PETAL_COUNT = 24;
const INITIAL_CLOUDS = 20;

// helper - create element
function el(tag, cls){ const d = document.createElement(tag); if(cls) d.className = cls; return d; }

/* ---------- 1) Create drifting clouds at start ---------- */
const cloudElems = [];
function spawnInitialClouds(){
  for(let i=0;i<INITIAL_CLOUDS;i++){
    const c = el('div','cloud');
    // random size variations
    const w = 120 + Math.random()*180;
    const h = 40 + Math.random()*30;
    c.style.width = w + 'px';
    c.style.height = h + 'px';
    // random starting position within top 45% of screen
    const left = Math.random() * window.innerWidth;
    const top = Math.random() * (window.innerHeight * 0.45);
    c.style.left = left + 'px';
    c.style.top = top + 'px';
    // random drift animation speed and direction (use inline animation)
    const duration = 18 + Math.random()*22;
    c.style.animation = `driftRight ${duration}s ease-in-out infinite alternate`;
    c.style.animationDelay = (Math.random()*5)+'s';
    c.dataset.id = i;
    sky.appendChild(c);
    cloudElems.push(c);
  }
}
spawnInitialClouds();

/* ---------- 2) Draw text to offscreen canvas and sample pixels to create flowers ---------- */

/* function: sampleTextToPoints(text, font, offsetX, offsetY)
   returns array of points {x,y} where the text pixels are opaque.
   We sample with step = DENSITY_STEP for performance and to control density.
*/
function sampleTextToPoints(text, font, offsetX, offsetY, maxWidth) {
  const canvas = document.createElement('canvas');
  const W = Math.max(window.innerWidth, 1200);
  const H = 300;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = 'black';
  ctx.textBaseline = 'top';
  ctx.font = font;
  // center text horizontally if maxWidth given
  let x = offsetX || 40;
  if (maxWidth) {
    const m = ctx.measureText(text).width;
    x = (W - m) / 2;
  }
  const y = offsetY || 10;
  ctx.fillText(text, x, y);

  const img = ctx.getImageData(0,0,W,H).data;
  const points = [];
  for(let px = 0; px < W; px += DENSITY_STEP){
    for(let py = 0; py < H; py += DENSITY_STEP){
      const idx = (py * W + px) * 4;
      const alpha = img[idx+3];
      if(alpha > 10){
        points.push({x: px, y: py});
      }
    }
  }
  return {points, canvasWidth: W, canvasHeight: H, textX: x, textY: y};
}

/* Place flower elements aligned to sampled points (map canvas to garden area) */
function placeFlowersForGround(){
  // text to draw: "I LOVE YOU MARY"
  const text = "I LOVE YOU MARY";
  // pick font size proportional to screen width
  const fontSize = Math.floor(Math.max(48, window.innerWidth / 12));
  const font = `${fontSize}px "Georgia", serif`;
  const sample = sampleTextToPoints(text, font, 0, 0, true);
  const pts = sample.points;

  // target region in garden (we'll vertically center the text inside #garden)
  const gardenRect = garden.getBoundingClientRect();
  const canvasW = sample.canvasWidth;
  const canvasH = sample.canvasHeight;

  // compute scale to fit canvasW into garden width minus margins
  const margin = 120;
  const availableW = Math.max(600, gardenRect.width - margin * 2);
  const scale = Math.min(1, availableW / canvasW);

  // vertical offset so text sits nicely in garden
  const topOffset = gardenRect.top + 12;

  // randomly assign type rose/hibiscus
  pts.forEach((p, i) => {
    // map sample coordinate to page coordinate
    const pageX = (p.x * scale) + (window.innerWidth - canvasW*scale)/2 + (Math.random()*6 - 3);
    const pageY = topOffset + (p.y * scale) + (Math.random()*6 - 3);

    const f = el('div','flower');
    f.style.left = pageX + 'px';
    f.style.top = pageY + 'px';
    // alternate types for natural look
    const type = Math.random() < 0.55 ? 'rose' : 'hibiscus';
    f.style.backgroundImage = `url(${type === 'rose' ? 'rose.png' : 'hibiscus.png'})`;
    // small rotation random
    f.style.transform = `scale(0) rotate(${(Math.random()*40-20).toFixed(1)}deg)`;
    garden.appendChild(f);

    // occasionally place a leaf near the flower
    if(Math.random() < 0.18){
      const leaf = el('div','leaf');
      leaf.style.left = (pageX + (Math.random()*20 - 8)) + 'px';
      leaf.style.top = (pageY + (Math.random()*10 + 6)) + 'px';
      garden.appendChild(leaf);
      // reveal leaf later during watering
    }
  });

  // add petals floating above garden (they fall continually)
  for(let i=0;i<PETAL_COUNT;i++){
    const p = el('div','petal');
    p.style.left = Math.random() * window.innerWidth + 'px';
    p.style.top = - (Math.random()*200 + 20) + 'px';
    p.style.animationDuration = (4 + Math.random()*4) + 's';
    p.style.animationDelay = (Math.random()*5) + 's';
    garden.appendChild(p);
  }
}

/* ---------- 3) Interaction: planting + watering + final lookUp ---------- */

function plantSeeds(){
  // Prevent double planting
  if(document.querySelectorAll('.flower').length > 0) return;
  btn.textContent = "Water the Garden";
  btn.disabled = false; // just in case
  // create flowers from text
  placeFlowersForGround();
  step = 1;
}

function waterOnce(){
  if(step !== 1) return;
  // reveal initial sprouts (scale to 0.45)
  document.querySelectorAll('.flower').forEach((f, i) => {
    setTimeout(() => {
      f.style.opacity = 1;
      f.style.transform = `scale(0.45) rotate(${(Math.random()*20-10).toFixed(1)}deg)`;
    }, i * 6);
  });
  document.querySelectorAll('.leaf').forEach((l, i) => {
    setTimeout(()=> l.style.opacity = 1, i*30);
  });
  btn.textContent = "Water Again";
  step = 2;
}

function waterAgain(){
  if(step !== 2) return;
  // final bloom (scale to 1)
  document.querySelectorAll('.flower').forEach((f, i) => {
    setTimeout(() => {
      f.style.transform = `scale(1) rotate(${(Math.random()*12-6).toFixed(1)}deg)`;
      f.style.opacity = 1;
      // little pop glow
      f.style.transitionTimingFunction = 'cubic-bezier(.17,.7,.3,1.2)';
    }, i * 8);
  });
  btn.textContent = "Look Up";
  step = 3;
}

/* ---------- 4) Clouds gather to form date ---------- */

/* Sample date text positions (similar to ground method) but return a set of target points
   which we will assign to the first N clouds and animate them into place.
*/
function sampleDatePoints(){
  const text = "06 / 23 / 2024";
  const fontSize = Math.floor(Math.max(64, window.innerWidth / 18));
  const font = `bold ${fontSize}px "Georgia", serif`;
  const sample = sampleTextToPoints(text, font, 0, 0, true);
  const pts = sample.points;

  // center date toward top third of screen
  const targetTop = Math.floor(window.innerHeight * 0.12);
  const canvasW = sample.canvasWidth;
  const scale = Math.min(1, (window.innerWidth * 0.8) / canvasW);
  const leftOffset = (window.innerWidth - canvasW*scale) / 2;

  // pick as many points as initial clouds (we'll cluster multiple points per cloud if needed)
  const targets = [];
  // sample evenly across pts so we get up to INITIAL_CLOUDS targets
  const step = Math.max(1, Math.floor(pts.length / INITIAL_CLOUDS));
  for(let i=0;i<pts.length;i+=step){
    const p = pts[i];
    const tx = leftOffset + p.x * scale + (Math.random()*8 - 4);
    const ty = targetTop + p.y * scale + (Math.random()*6 - 3);
    targets.push({x:tx, y:ty});
    if(targets.length >= INITIAL_CLOUDS) break;
  }
  return targets;
}

function lookUp(){
  if(step !== 3) return;
  btn.style.display = 'none';
  // play music and fade in
  if(music){
    music.volume = 0;
    music.play().catch(()=>{/* autoplay may be blocked until user interaction (we had clicks) */});
    let vol = 0;
    const t = setInterval(()=> {
      vol += 0.02;
      music.volume = Math.min(0.55, vol);
      if(vol >= 0.54) clearInterval(t);
    }, 120);
  }

  // gently tilt camera: translate sky up a bit and garden up
  sky.style.transition = "transform 7s ease-in-out";
  sky.style.transform = "translateY(-80px)";
  garden.style.transition = "transform 7s ease-in-out";
  garden.style.transform = "translateY(-40px)";

  // compute targets and animate clouds into place
  const targets = sampleDatePoints(); // array of {x,y}
  // choose N clouds to animate (match targets length)
  const count = Math.min(targets.length, cloudElems.length);

  // for unused clouds, we can fade them away or move them off-screen softly
  cloudElems.forEach((c, idx) => {
    c.style.animation = ''; // stop drift so we can animate
  });

  // animate selected clouds to target points (staggered)
  for(let i=0;i<count;i++){
    const cloud = cloudElems[i];
    const t = targets[i];
    // make cloud circular/puffy for letters
    cloud.classList.add('letter');
    // set final size slightly larger for puffiness
    cloud.style.width = '68px';
    cloud.style.height = '68px';
    cloud.style.left = parseFloat(cloud.style.left) + 'px'; // keep current pos as start
    cloud.style.top = parseFloat(cloud.style.top) + 'px';
    // animate to target
    setTimeout(() => {
      cloud.style.transition = `all ${1200 + i*30}ms cubic-bezier(.2,.9,.2,1)`;
      cloud.style.left = (t.x - 34) + 'px'; // center
      cloud.style.top = (t.y - 34) + 'px';
      cloud.style.opacity = 1;
    }, i * 120);
  }

  // fade out any remaining clouds that are not used and let them drift away gently
  for(let j = count; j < cloudElems.length; j++){
    const c = cloudElems[j];
    setTimeout(()=> {
      c.style.transition = 'all 2200ms ease';
      c.style.opacity = 0.0;
      c.style.transform = 'translateY(-60px)';
    }, 600 + (j-count)*60);
  }

  // after clouds settle, show final message
  setTimeout(()=> {
    const msg = document.getElementById('finalMsg') || el('div','');
    msg.id = 'finalMsg';
    msg.textContent = "🌤️ Every flower blooms for you, sweetheart. 💕";
    document.getElementById('scene').appendChild(msg);
    setTimeout(()=> msg.style.opacity = 1, 350);
  }, 1600 + count * 120);

  step = 4;
}

/* ---------- 5) Wire up button ---------- */
btn.addEventListener('click', () => {
  if(step === 0){ plantSeeds(); }         // create & place flowers
  else if(step === 1){ waterOnce(); }     // first water
  else if(step === 2){ waterAgain(); }    // second water
  else if(step === 3){ lookUp(); }        // clouds form date
});

/* make sure buttons enable/disable appropriately at reloads */
btn.textContent = "Plant Seeds";
btn.disabled = false;

/* ---------- 6) responsive: reposition on resize ---------- */
let resizeTimer = null;
window.addEventListener('resize', () => {
  // if the flowers haven't been planted yet nothing to do
  // If planted, we keep them where they are; for major layout change we could re-generate
  if(resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(()=> {
    // For best fidelity, reload page on dramatic resize to re-sample text and reposition
    // (simpler than trying to recompute all positions perfectly)
    // but only prompt user if they have not progressed far:
    // If stage <=1 we can safely re-create; otherwise do nothing.
    if(step < 2){
      // clear garden and re-place
      garden.innerHTML = '';
      cloudElems.forEach(c => c.remove());
      cloudElems.length = 0;
      spawnInitialClouds();
      // re-generate if user already had planted
      if(step > 0){
        placeFlowersForGround();
      }
    }
  }, 250);
});

/* ---------- 7) initial gentle parallax for sky clouds ---------- */
// Slightly offset cloud speeds for a real feeling (we already set animation above)

