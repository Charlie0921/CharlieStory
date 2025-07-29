// components/ProjectBox/ProjectBox.js
class ProjectBox extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ["title", "description", "skills", "date"];
  }

  get title() {
    return this.getAttribute("title");
  }

  get description() {
    return this.getAttribute("description");
  }

  get skills() {
    return this.getAttribute("skills");
  }

  get date() {
    return this.getAttribute("date");
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        .box {
          border: 1px solid #ccc;
          border-radius: 10px;
          padding: 1rem;
          margin: 0.5rem;
          width: 200px;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
        }
        h2 {
          margin: 0 0 0.5rem 0;
        }
        div {
          margin-bottom: 0.5rem;
        }
      </style>
      <div class="box">
        <h2>${this.title}</h2>
        <div><strong>Description:</strong> ${this.description}</div>
        <div><strong>Skills:</strong> ${this.skills}</div>
        <div><strong>Date:</strong> ${this.date}</div>
      </div>
    `;
  }
}

customElements.define('project-box', ProjectBox);
