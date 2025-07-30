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
      .wrapper {
        display: grid;
        grid-template-columns: repeat(3, 1fr); /* 3 columns */
        background-color: red;
        width: 700px;
      }

      project-box {
       background-color: green;
       display: flex;
       justify-content: center;
       align-items: center;
      }
    </style>
    <div class="wrapper"></div>`;
    const wrapper = this.shadowRoot.querySelector(".wrapper");

    // Now safely append project boxes
    projects.forEach((project) => {
      const box = document.createElement("project-box");
      box.setAttribute("title", project.title);
      box.setAttribute("description", project.description);
      box.setAttribute("skills", project.skills);
      box.setAttribute("date", project.date);
      box.setAttribute("image", project.image);
      wrapper.appendChild(box);
    });
  }
}

customElements.define("project-grid", ProjectGrid);
