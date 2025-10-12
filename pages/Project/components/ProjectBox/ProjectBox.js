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

    // Modal trigger
    this.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("open-modal", {
          detail: { id: this.id },
          bubbles: true,
          composed: true,
        })
      );
    });
  }

  render() {
    const skillArray =
      this.skills && this.skills.length > 0
        ? this.skills.split(",").map((s) => s.trim())
        : [];

    this.shadow.innerHTML = `
      <style>
        :host {
          display: block;
          margin-bottom: 25px;
          cursor: pointer;
          font-family: "Open Sans", sans-serif;
        }

        .project-box {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          background-color: #3a8b76; /* green card */
          border-radius: 15px;
          color: white;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .project-box:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 14px rgba(0, 0, 0, 0.2);
        }

        .image-wrapper {
          flex: 0 0 130px;
          height: 130px;
          background-color: #d7e6db;
          border-radius: 10px;
          overflow: hidden;
        }

        .image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .date {
          font-size: 13px;
          opacity: 0.9;
          margin-bottom: 8px;
        }

        .description {
          font-size: 14px;
          line-height: 1.4;
          margin-bottom: 10px;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .tag {
          background-color: #f3f3f3;
          color: #2f2f2f;
          font-size: 11px;
          font-weight: 600;
          border-radius: 12px;
          padding: 3px 8px;
        }

        @media (max-width: 700px) {
          .project-box {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .image-wrapper {
            width: 100%;
            height: 180px;
          }

          .content {
            align-items: center;
          }

          .tags {
            justify-content: center;
          }
        }
      </style>

      <div class="project-box">
        <div class="image-wrapper">
          <img src="${this.image || "./img/default.jpg"}" alt="${this.title}" />
        </div>
        <div class="content">
          <div>
            <div class="title">${this.title}</div>
            <div class="date">${this.date}</div>
            <div class="description">${this.description}</div>
          </div>
          <div class="tags">
            ${skillArray.map((s) => `<span class="tag">${s}</span>`).join("")}
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("project-box", ProjectBox);
