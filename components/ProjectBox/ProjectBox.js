class ProjectBox extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["id", "title", "description", "skills", "date", "image", "website"];
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
  get website() {
    return this.getAttribute("website");
  }

  attributeChangedCallback() {
    this.render();
  }

  connectedCallback() {
    this.render();

    // Handle click: open website if available, else modal
    this.addEventListener("click", () => {
      if (this.website && this.website.trim() !== "") {
        window.open(this.website, "_blank", "noopener,noreferrer");
      } else {
        this.dispatchEvent(
          new CustomEvent("open-modal", {
            detail: { id: this.id },
            bubbles: true,
            composed: true,
          })
        );
      }
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
          cursor: pointer;
          font-family: "Inter";
        }

        .project-box {
          display: flex;
          flex-direction: column;
          background-color: #3a8b76;
          border-radius: 25px;
          color: white;
          height: 100%;
          min-height: 380px;
          padding: 0;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          overflow: hidden;
        }

        .project-box:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .image-wrapper {
          width: 100%;
          height: 220px;
          background-color: #d7e6db;
          overflow: hidden;
          flex-shrink: 0;
        }

        .image-wrapper img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .content {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 20px;
          gap: 12px;
        }

        .title {
          font-size: 22px;
          font-weight: 700;
          line-height: 1.2;
        }

        .description {
          font-size: 14px;
          line-height: 1.5;
          opacity: 0.95;
          flex: 1;
        }

        .footer {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: auto;
        }

        .date {
          font-size: 13px;
          opacity: 0.85;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .tag {
          background-color: #d8e8d4;
          color: #27482b;
          font-size: 12px;
          font-weight: 600;
          border-radius: 12px;
          padding: 4px 10px;
        }

        @media (max-width: 768px) {
          .project-box {
            min-height: 350px;
          }

          .image-wrapper {
            height: 180px;
          }

          .title {
            font-size: 20px;
          }

          .description {
            font-size: 13px;
          }
        }
      </style>

      <div class="project-box">
        <div class="image-wrapper">
          <img src="${this.image || "../../img/dessert.png"}" alt="${
      this.title
    }" />
        </div>
        <div class="content">
          <div class="title">${this.title}</div>
          <div class="description">${this.description}</div>
          <div class="footer">
            <div class="date">${this.date}</div>
            <div class="tags">
              ${skillArray.map((s) => `<span class="tag">${s}</span>`).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define("project-box", ProjectBox);
