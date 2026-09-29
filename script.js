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
  if (!projectsGrid) return;
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    
    // SVG arrow that rotates 45deg on hover
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

  // IntersectionObserver for staggered fade up
  if (!prefersReducedMotion) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add a staggered delay based on DOM order for cells appearing together
          const cell = entry.target;
          const index = Array.from(projectsGrid.children).indexOf(cell);
          const delay = (index % 3) * 100; // 0, 100, 200 ms
          
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
});
