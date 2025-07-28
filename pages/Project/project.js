
const projects = [
    {
        title: "Charlie's Story (without Framework)",
        description: "Personal Story Website",
        skills: "HTML, Java, CSS",
        date: "August 31, 2022 -> October 19,2024"
    },
    {
        title: "Tanyak Laundry",
        description: "A laundry management web-app used by military residents that displays machine usage with notifications",
        skills: "React.js, CSS, HTML, TypeScript",
        date: "August 4, 2024 -> January 22, 2025"
    },
    {
        title: "Faulty Sewage Pipe AI Detector",
        description: "A competition was to accurately classify the types of faults in the sewage pipes and receive the highest Public Test Score.",
        skills: "Yolo, Jupyter, Python",
        date: "June 17, 2024 -> June 21, 2024"
    },
    {
        title: "Responsive TodoList (without framework)",
        description: "",
        skills: "HTML, CSS, JavaScript",
        date: "March 1, 2024 -> March 24, 2024"
    },
    {
        title: "BeyondClass",
        description: "BeyondClass is a website that provides information about school opportunities such as competitions, scholarships, and networks so that students can have easier and equal access.",
        skills: "React.js, JavaScript, CSS, HTML",
        date: "June 23, 2022 -> April 23, 2023"
    }
]

// project.js
class ProjectBox extends HTMLElement {
  constructor(project) {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const container = document.createElement("div");
    container.innerHTML = `
      <style>
        .card {
          border: 1px solid #ccc;
          padding: 1em;
          margin: 1em;
          border-radius: 10px;
          width: 250px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        img {
          width: 100%;
          border-radius: 8px;
        }
        h3 {
          margin: 0.5em 0 0.2em;
        }
        p {
          margin: 0.2em 0;
        }
      </style>
      <div class="card">
        <img src="${project.image || 'images/placeholder.png'}" alt="${project.title}">
        <div class="project-info">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <p><strong>Skills:</strong> ${project.skills}</p>
          <p><strong>Date:</strong> ${project.date}</p>
        </div>
      </div>
    `;

    shadow.appendChild(container);
  }
}

// Define the custom element
customElements.define("project-box", ProjectBox);

// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#project-container");
  if (!container) {
    console.error("Missing container: #project-container");
    return;
  }

  projects.forEach((proj) => {
    const card = new ProjectBox(proj);
    container.appendChild(card);
  });
});