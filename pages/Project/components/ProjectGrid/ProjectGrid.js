// components/ProjectWrapper/ProjectWrapper.js
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
    // Render the initial wrapper
    this.shadowRoot.innerHTML = ` <style>
      .project-grid-wrapper {
          display: grid;
          grid-template-columns: repeat(3, 1fr); 
          width: 100%;
          max-width: 900px;
          gap: 10px;
        }

      @media (max-width: 740px) {
        .project-grid-wrapper {
          display: grid;
          grid-template-columns: repeat(1, 1fr); 
          width: 100%;
        }
      }
      
      project-box {
       display: flex;
       justify-content: center;
       align-items: center;
      }
    </style>
    <div class="project-grid-wrapper"></div>`;
    const wrapper = this.shadowRoot.querySelector(".project-grid-wrapper");

    // Now safely append project boxes
    projects.forEach((project) => {
      const box = document.createElement("project-box");
      box.setAttribute("id", project.project_id);
      box.setAttribute("title", project.project_title);
      box.setAttribute("description", project.project_description);
      box.setAttribute("skills", project.project_skills);
      box.setAttribute("date", project.project_date);
      box.setAttribute("image", project.project_image);
      wrapper.appendChild(box);
    });
  }
}

customElements.define("project-grid", ProjectGrid);
