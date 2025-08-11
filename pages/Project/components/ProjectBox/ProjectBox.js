// components/ProjectBox/ProjectBox.js
class ProjectBox extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["id", "title", "description", "skills", "date", "image"];
  }

  get id() {
    return this.getAttribute("id");
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

    // Open modal when clicked
    this.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("open-modal", {
          detail: { id: this.idAttr },
          bubbles: true,
        })
      );
    });
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        .project-box-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ccc;
          border-radius: 10px;
          width: 250px;
          height: 300px;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.1);
        }

        .project-box-content-wrapper{
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 90%;
          width: 90%; 
        }

        .project-box-wrapper .project-box-description{
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 15px;
        }

        .project-box-img-wrapper{
        width: 100%;
        height: 40%;
        display: flex;
        justify-content: center;
        }

        .project-box-wrapper {
          cursor: pointer;
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
      </style>
      <div class="project-box-wrapper">
        <div class = "project-box-content-wrapper">
          <div class="project-box-img-wrapper"><img src = ${this.image}></img></div>
          <h2>${this.title}</h2>
          <div class="project-box-description">${this.description}</div>
          <div><strong>Skills:</strong> ${this.skills}</div>
          <div><strong>Date:</strong> ${this.date}</div>
        </div>
      </div>
    `;
  }
}

customElements.define("project-box", ProjectBox);
