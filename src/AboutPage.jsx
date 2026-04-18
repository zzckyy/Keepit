import './App.css';

function AboutPage() {
  return (
    <div className="box">
        <div>
          <h1 className='title is-3'>About kiply</h1>
          <p>Learn more about our app</p>
      </div>

        <div className="about-section">
          <h2>What is kiply?</h2>
          <p>
            kiply is a modern, minimalist notes application designed to help you organize your thoughts,
            tasks, and ideas in a clean and intuitive way. Whether you're jotting down quick notes,
            managing to-do lists, or creating detailed lists, kiply provides the tools you need.
          </p>
        </div>

        <div className="about-section">
          <h2>Features</h2>
          <ul className="feature-list">
            <li><i className="fas fa-sticky-note"></i> Rich text notes with autosave</li>
            <li><i className="fas fa-tasks"></i> Interactive to-do lists with checkboxes</li>
            <li><i className="fas fa-list"></i> Flexible list creation and management</li>
            <li><i className="fas fa-palette"></i> Light and dark theme support</li>
            <li><i className="fas fa-save"></i> Automatic data saving to local storage</li>
            <li><i className="fas fa-mobile-alt"></i> Responsive design for all devices</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>Technology Stack</h2>
          <div className="tech-stack">
            <span className="tech-badge">React</span>
            <span className="tech-badge">Vite</span>
            <span className="tech-badge">JavaScript</span>
            <span className="tech-badge">CSS3</span>
            <span className="tech-badge">Font Awesome</span>
            <span className="tech-badge">Bulma</span>
          </div>
        </div>

        <div className="about-section">
          <h2>Contact</h2>
          <p>
            Have questions or feedback? We'd love to hear from you!
          </p>
          <div className="contact-links">
            <a href="mailto:support@kiply.app" className="contact-link">
              <i className="fas fa-envelope"></i> support@kiply.app
            </a>
            <a href="https://github.com/kiply" target="_blank" rel="noopener noreferrer" className="contact-link">
              <i className="fab fa-github"></i> GitHub
            </a>
          </div>
        </div>

        <div className="about-section">
          <h2>Version</h2>
          <p>kiply v1.0.0</p>
          <p>Built with ❤️ using modern web technologies</p>
        </div>
    </div>
  );
}

export default AboutPage;