// components/ProjectBox/ProjectBox.js
class ProjectBox extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["title", "description", "skills", "date", "image"];
  }

  get image() {
    return this.getAttribute("image");
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
        .project-box-wrapper {
          background-color: blue;
          border: 1px solid #ccc;
          border-radius: 10px;
          width: 250px;
          height: 300px;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
  }
        .project-box-img-wrapper{
        width: 100%;
        height: 40%;

        display: flex;
        justify-content: center;
        }
        img {
        width: 90%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
        }
        h2 {
          font-size: 20px;
          margin: 0 0 0.5rem 0;
        }
        div {
          background-color: yellow;
          margin-bottom: 0.5rem;
          font-size: 13px;
        }
        .project-box-wrapper .project-box-description{
          font-size: 15px;
          text-overflow: nowrap;
        }
        .
      </style>
      <div class="project-box-wrapper">
        <div class="project-box-img-wrapper"><img src = ${this.image}></img></div>
        <h2>${this.title}</h2>
        <div class="project-box-description">${this.description}</div>
        <div><strong>Skills:</strong> ${this.skills}</div>
        <div><strong>Date:</strong> ${this.date}</div>
      </div>
    `;
  }
}

customElements.define("project-box", ProjectBox);
