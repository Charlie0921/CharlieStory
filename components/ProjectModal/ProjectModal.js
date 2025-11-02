class ProjectModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  set data(project) {
    this.project = project;
    this.render();
  }

  render() {
    if (!this.project) return;

    this.shadowRoot.innerHTML = `
      <style>
        .overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal {
          background: white;
          border-radius: 10px;
          padding: 20px;
          max-width: 600px;
          width: 90%;
          max-height: 80%;
          overflow-y: auto;
          position: relative;
        }
        h2 {
          margin-top: 0;
        }
        button {
          background: none;
          border: none;
          font-size: 40px;
          cursor: pointer;
          position: absolute;
          top: 10px;
          right: 20px;
          length: 10px;
        }
      </style>
      <div class="overlay">
        <div class="modal">
          <button id="close">&times;</button>
          <h2>${this.project.project_title}</h2>
<p><strong>Inspirations:</strong> ${
      this.project.details?.project_inspirations || ""
    }</p>
<p><strong>What It Does:</strong> ${
      this.project.details?.project_whatitdoes || ""
    }</p>
<p><strong>Challenges:</strong> ${
      this.project.details?.project_challenges || ""
    }</p>
<p><strong>Resolutions:</strong> ${
      this.project.details?.project_resolutions || ""
    }</p>
<p><strong>Accomplishments:</strong> ${
      this.project.details?.project_accomplishments || ""
    }</p>
<p><strong>Lessons Learned:</strong> ${
      this.project.details?.project_lessons || ""
    }</p>

        </div>
      </div>
    `;

    this.shadowRoot.querySelector("#close").addEventListener("click", () => {
      this.remove();
    });
  }
}

customElements.define("project-modal", ProjectModal);
