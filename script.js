// helper
const $ = s => document.querySelector(s);

// ----------------- No button dodge + random navigation -----------------
function initNoButtons(){
  document.querySelectorAll('[data-next]').forEach(btn=>{
    let lastTap = 0, taps = 0, evadeCount = 0;
    ['mouseenter','pointerenter','touchstart'].forEach(ev=>{
      btn.addEventListener(ev, (e)=>{
        if(Math.random() < 0.85 && evadeCount < 8){
          moveRandom(btn);
          evadeCount++;
        }
      }, {passive:true});
    });

    btn.addEventListener('click',(e)=>{
      e.preventDefault();
      const now = Date.now();
      if(now - lastTap < 400) taps++; else taps = 1;
      lastTap = now;

      if(taps >= 2) {
        const next = btn.getAttribute('data-next');
        if(next) location.href = next;
        return;
      }

      if(Math.random() < 0.6){
        moveRandom(btn);
      } else {
        const next = btn.getAttribute('data-next');
        if(next) location.href = next;
      }
    });
  });
}

function moveRandom(el){
  el.style.position = 'fixed';
  const rect = el.getBoundingClientRect();
  const pad = 12;
  const maxX = Math.max(0, window.innerWidth - rect.width - pad);
  const maxY = Math.max(60, window.innerHeight - rect.height - pad);
  const x = Math.floor(Math.random() * maxX) + pad;
  const y = Math.floor(Math.random() * maxY) + pad;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.animate(
    [{transform:'scale(1.03)'},{transform:'scale(0.98)'},{transform:'scale(1)'}],
    {duration:300}
  );
}

// ----------------- Confetti for YES page -----------------
function fireConfetti(){
  const c = document.createElement('canvas');
  c.style.position='fixed'; c.style.left=0; c.style.top=0; c.style.width='100%'; c.style.height='100%';
  c.style.pointerEvents='none'; document.body.appendChild(c);
  const ctx = c.getContext('2d');
  function resize(){ 
    c.width = innerWidth * devicePixelRatio; 
    c.height = innerHeight * devicePixelRatio; 
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); 
  }
  resize(); window.addEventListener('resize', resize);
  const parts = Array.from({length:90}, ()=>({
    x: Math.random()*innerWidth,
    y: -20-Math.random()*200,
    r: 4+Math.random()*6,
    s: 1+Math.random()*3,
    col: `hsl(${Math.random()*360} 80% 60%)`
  }));
  let t=0;
  const id = setInterval(()=>{
    ctx.clearRect(0,0,c.width,c.height);
    parts.forEach(p=>{
      p.y += p.s; 
      p.x += Math.sin((p.y)/20) * 2;
      ctx.fillStyle = p.col; 
      ctx.beginPath(); 
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2); 
      ctx.fill();
    });
    t++; if(t>220){ clearInterval(id); c.remove(); }
  },16);
}

// ----------------- Emoji rain small effect -----------------
function emojiRain(){
  const pack = ['😂','😜','😍','✨','💖','😅','🥺'];
  for(let i=0;i<18;i++){
    const el = document.createElement('div');
    el.textContent = pack[Math.floor(Math.random()*pack.length)];
    el.style.position='fixed';
    el.style.left = (5 + Math.random()*90) + '%';
    el.style.top = '-10vh';
    el.style.fontSize = (18 + Math.random()*30) + 'px';
    el.style.pointerEvents = 'none';
    el.style.zIndex = 9999;
    el.style.transition = 'transform 2.5s linear, opacity 2.5s';
    document.body.appendChild(el);
    requestAnimationFrame(()=> el.style.transform = `translateY(120vh) rotate(${360*Math.random()}deg)` );
    setTimeout(()=> el.style.opacity = '0', 2200);
    setTimeout(()=> el.remove(), 2600);
  }
}

// ----------------- Send Response (Google Form / Console) -----------------
function sendResponse(answer){
  // Example: Google Form link
  fetch("https://docs.google.com/forms/d/e/1FAIpQLSfc596th0r9VO8DhaxJ3QcNyKct_6jS_bx0sLT4qVDBwnbZfw/formResponse", {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `entry.1778823217=${encodeURIComponent(answer)}`
  }).catch(err=>console.log("Response save error:", err));

  console.log("Saved Response:", answer);
}

// ----------------- Final NO Button -----------------
const finalNo = $('#finalNo');
if (finalNo) {
  finalNo.addEventListener('click', e => {
    e.preventDefault();

    // ✅ Save response
    sendResponse("Final NO");

    // 💖 heart rain animation
    for (let i = 0; i < 30; i++) {
      const heart = document.createElement('div');
      heart.textContent = "💖";
      heart.style = `position:fixed; left:${Math.random()*90}%; top:-10px; font-size:${20+Math.random()*20}px; z-index:9999; transition:transform 2s linear, opacity 2s;`;
      document.body.appendChild(heart);
      setTimeout(() => {
        heart.style.transform = 'translateY(100vh) rotate(360deg)';
        heart.style.opacity = '0';
      }, 50);
      setTimeout(() => heart.remove(), 2200);
    }

    // ✅ Redirect to yes.html always
    setTimeout(() => window.location.href = "yes1.html", 2200);
  });
}

// ----------------- Init when DOM ready -----------------
document.addEventListener('DOMContentLoaded', ()=>{
  initNoButtons();
  if(document.body.getAttribute('data-confetti') === 'yes') fireConfetti();
  if(document.body.getAttribute('data-emoji') === '1') emojiRain();
});
