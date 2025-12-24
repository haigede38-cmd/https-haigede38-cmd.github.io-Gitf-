// Confetti + interaction + countdown (target: 2026-01-01 00:00:00 local time)
(() => {
  // Canvas confetti
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const particles = [];
  const colors = ['#e6c07a','#f7e9c8','#ffd89b','#ffffff'];

  function rand(min,max){ return Math.random()*(max-min)+min }

  function makeParticle(originX){
    const size = rand(6,16);
    return {
      x: typeof originX === 'number' ? originX : rand(0,w),
      y: -10,
      vx: rand(-1.2,1.2),
      vy: rand(1.2,3.2),
      r: size,
      rot: rand(0,360),
      vr: rand(-6,6),
      color: colors[Math.floor(rand(0,colors.length))],
      ttl: rand(400,1000)
    };
  }

  function spawn(n=6, originX){
    for(let i=0;i<n;i++) particles.push(makeParticle(originX));
  }

  function resize(){
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  }
  addEventListener('resize', resize);

  function update(){
    ctx.clearRect(0,0,w,h);
    if(particles.length < 120 && Math.random() < 0.5) spawn(2);
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.vy += 0.03; // gravity
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.ttl--;
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*0.6);
      ctx.restore();

      if(p.y > h + 50 || p.ttl <= 0) particles.splice(i,1);
    }
    requestAnimationFrame(update);
  }
  spawn(40);
  update();

  // Reveal button interaction
  const revealBtn = document.getElementById('revealBtn');
  const surprise = document.getElementById('surprise');
  revealBtn.addEventListener('click', (e) => {
    const isHidden = surprise.hidden;
    surprise.hidden = !isHidden;
    surprise.setAttribute('aria-hidden', String(!isHidden));
    revealBtn.setAttribute('aria-expanded', String(isHidden));
    revealBtn.textContent = isHidden ? 'Tutup Pesan' : 'Buka Pesan';
    if(isHidden){
      // burst confetti centered on button
      const rect = e.currentTarget.getBoundingClientRect();
      const originX = rect.left + rect.width/2;
      for(let i=0;i<90;i++) spawn(1, originX);
    }
  });

  // Countdown to 1 January 2026 00:00:00 (local)
  const target = new Date('2026-01-01T00:00:00');
  const elDays = document.getElementById('days');
  const elHours = document.getElementById('hours');
  const elMinutes = document.getElementById('minutes');
  const elSeconds = document.getElementById('seconds');

  function pad(n){ return String(n).padStart(2,'0') }

  function tick(){
    const now = new Date();
    let diff = Math.max(0, Math.floor((target - now)/1000));
    const days = Math.floor(diff / 86400); diff %= 86400;
    const hours = Math.floor(diff / 3600); diff %= 3600;
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    elDays.textContent = pad(days);
    elHours.textContent = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);

    if((target - now) <= 0){
      // Reached new year — celebratory state
      const greeting = document.querySelector('.greeting');
      greeting.textContent = 'Selamat Tahun Baru 2026!';
      // big confetti burst
      for(let i=0;i<300;i++) spawn(1);
      // stop updating countdown (optional keep showing zeros)
      clearInterval(intervalId);
    }
  }

  // Initial tick and interval
  tick();
  const intervalId = setInterval(tick, 1000);

  // Small performance improvement: pause canvas when tab hidden
  document.addEventListener('visibilitychange', () => {
    if(document.hidden){
      // stop animation by not doing anything (requestAnimationFrame will stop naturally)
    } else {
      resize();
    }
  });
})();