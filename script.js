// PASTE PROJECT LINKS HERE
const projects = Array.from({ length: 15 }, (_, i) => {
  const num = (i + 1).toString().padStart(2, '0');
  return {
    title: `Project ${num}`,
    description: "This is a one-line description placeholder for the project.",
    url: "#"
  };
});

document.addEventListener("DOMContentLoaded", () => {
  const projectsGrid = document.getElementById("projectsGrid");
  
  if (!projectsGrid) return;
  
  projects.forEach((project, index) => {
    const num = (index + 1).toString().padStart(2, '0');
    
    // Create anchor element for the card
    const card = document.createElement("a");
    card.href = project.url;
    card.className = "project-card";
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.setAttribute("aria-label", `View ${project.title}`);
    
    // SVG icon for external link
    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right">
        <path d="M7 7h10v10"/>
        <path d="M7 17 17 7"/>
      </svg>
    `;
    
    // Construct card inner HTML
    card.innerHTML = `
      <div class="card-header">
        <span class="project-number">${num}</span>
        <div class="icon-wrapper" aria-hidden="true">
          ${svgIcon}
        </div>
      </div>
      <h2 class="project-title">${project.title}</h2>
      <p class="project-description">${project.description}</p>
    `;
    
    projectsGrid.appendChild(card);
  });
});
