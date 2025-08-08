class ProjectModal extends HTMLElement {
  connectedClassback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
        
        
        `;
  }
}

customElements.define("project-modal", ProjectModal);
