import "../ProjectBox/ProjectBox.js";

class ProjectGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set data(projects) {
    this.render(projects);
  }

  render(projects) {
    this.shadowRoot.innerHTML = `
      <style>
        .project-grid-wrapper {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 25px;
          width: 100%;
          padding-bottom: 40px;
        }

        project-box {
          width: 100%;
        }

        @media (max-width: 1200px) {
          .project-grid-wrapper {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .project-grid-wrapper {
            padding-bottom: 20px;
            gap: 15px;
          }
        }
      </style>

      <div class="project-grid-wrapper"></div>
    `;

    const wrapper = this.shadowRoot.querySelector(".project-grid-wrapper");

    projects.forEach((project) => {
      const box = document.createElement("project-box");
      box.setAttribute("id", project.project_id);
      box.setAttribute("title", project.project_title);
      box.setAttribute("description", project.project_description);
      box.setAttribute("skills", project.project_skills);
      box.setAttribute("date", project.project_date);
      box.setAttribute("image", project.project_image);
      box.setAttribute("website", project.project_website);
      wrapper.appendChild(box);
    });
  }
}

customElements.define("project-grid", ProjectGrid);
