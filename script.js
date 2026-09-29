// PASTE PROJECT LINKS HERE
const projects = Array.from({ length: 15 }, (_, i) => {
  const num = (i + 1).toString().padStart(2, '0');
  return {
    title: `Project ${num}`,
    team: "TEAM: TBD",
    url: "#"
  };
});

document.addEventListener("DOMContentLoaded", () => {
  const projectsGrid = document.getElementById("projectsGrid");
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (projectsGrid) {
    projects.forEach((project, index) => {
      const num = (index + 1).toString().padStart(2, '0');
      
      const card = document.createElement("a");
      card.href = project.url;
      card.className = "project-cell";
      if (!prefersReducedMotion) {
        card.classList.add("animate-hidden");
      }
      card.target = "_blank";
      card.rel = "noopener noreferrer";
      card.setAttribute("aria-label", `View ${project.title}`);
      
      const svgIcon = `
        <svg class="cell-arrow" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter">
          <path d="M7 7h10v10"/>
          <path d="M7 17 17 7"/>
        </svg>
      `;
      
      const pendingTag = project.url === "#" ? `<div class="cell-bottom">LINK PENDING</div>` : `<div></div>`;
      
      card.innerHTML = `
        <div class="cell-top">
          <span class="cell-num">${num}</span>
          ${svgIcon}
        </div>
        <div class="cell-middle">
          <h3 class="cell-title">${project.title}</h3>
          <div class="cell-meta">${project.team}</div>
        </div>
        ${pendingTag}
      `;
      
      projectsGrid.appendChild(card);
    });

    if (!prefersReducedMotion) {
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      };
      
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cell = entry.target;
            const index = Array.from(projectsGrid.children).indexOf(cell);
            const delay = (index % 3) * 100;
            
            setTimeout(() => {
              cell.classList.remove("animate-hidden");
              cell.classList.add("animate-visible");
            }, delay);
            
            obs.unobserve(cell);
          }
        });
      }, observerOptions);

      const cells = document.querySelectorAll(".project-cell");
      cells.forEach(cell => observer.observe(cell));
    }
  }

  // --- HERO CANVAS NETWORK ---
  const canvas = document.getElementById("hero-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height;
    let nodes = [];
    let mouse = { x: -1000, y: -1000 };
    let inkRgb = { r: 14, g: 14, b: 12 };

    function updateInkColor() {
      const ink = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim();
      if (ink && ink.startsWith('#')) {
        let hex = ink;
        let r=14, g=14, b=12;
        if(hex.length === 4) {
          r = parseInt(hex[1]+hex[1], 16);
          g = parseInt(hex[2]+hex[2], 16);
          b = parseInt(hex[3]+hex[3], 16);
        } else if (hex.length === 7) {
          r = parseInt(hex.substring(1,3), 16);
          g = parseInt(hex.substring(3,5), 16);
          b = parseInt(hex.substring(5,7), 16);
        }
        inkRgb = {r, g, b};
      }
    }

    function initNodes() {
      nodes = [];
      const numNodes = 60;
      for (let i = 0; i < numNodes; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4
        });
      }
    }

    function resize() {
      updateInkColor();
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      initNodes();
      
      if (prefersReducedMotion) {
        draw();
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!prefersReducedMotion) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;
        }
        
        // Node visibility: more visible on the right half (up to 0.4 opacity)
        const visibility = (0.2 + 0.8 * (n.x / width)) * 0.4;
        
        // Connect to mouse
        const dxMouse = mouse.x - n.x;
        const dyMouse = mouse.y - n.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 180) {
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          const op = (1 - distMouse / 180) * visibility;
          ctx.strokeStyle = `rgba(${inkRgb.r}, ${inkRgb.g}, ${inkRgb.b}, ${op})`;
          ctx.stroke();
        }

        // Connect to other nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n2.x - n.x;
          const dy = n2.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            const visibility2 = (0.2 + 0.8 * (n2.x / width)) * 0.4;
            const op = (1 - dist / 140) * Math.min(visibility, visibility2);
            ctx.strokeStyle = `rgba(${inkRgb.r}, ${inkRgb.g}, ${inkRgb.b}, ${op})`;
            ctx.stroke();
          }
        }
        
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${inkRgb.r}, ${inkRgb.g}, ${inkRgb.b}, ${visibility})`;
        ctx.fill();
      }
      
      if (!prefersReducedMotion) {
        requestAnimationFrame(draw);
      }
    }

    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    
    document.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    // Dark mode toggle listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      updateInkColor();
      if (prefersReducedMotion) draw();
    });

    resize();
    if (!prefersReducedMotion) {
      draw();
    }
  }
});
