import { useState, useEffect } from 'react';
import './App.css';

function SettingsPage() {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedLanguage = localStorage.getItem('language') || 'en';
    const savedNotifications = localStorage.getItem('notifications') === 'true';

    setTheme(savedTheme);
    setLanguage(savedLanguage);
    setNotifications(savedNotifications);

    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleNotificationsChange = (enabled) => {
    setNotifications(enabled);
    localStorage.setItem('notifications', enabled.toString());
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="box fullbody">
      <div className="">
          <h1 className='title is-3'>Settings</h1>
          <p>Customize your app experience</p>
      </div>

        <div className="settings-section">
          <h2>Appearance</h2>
          <div className="setting-item">
            <label>Theme</label>
            <div className="theme-options">
              <button
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <i className="fas fa-sun"></i> Light
              </button>
              <button
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <i className="fas fa-moon"></i> Dark
              </button>
            </div>
          </div>

        <div className="settings-section">
          <h2>Language</h2>
          <div className="setting-item">
            <label>Language</label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="language-select"
            >
              <option value="en">English</option>
              <option value="id">Bahasa Indonesia</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h2>Notifications</h2>
          <div className="setting-item">
            <label>Enable notifications</label>
            <label className="switch">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => handleNotificationsChange(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>Data Management</h2>
          <div className="setting-item">
            <button className="danger-btn" onClick={clearAllData}>
              <i className="fas fa-trash"></i> Clear All Data
            </button>
            <p className="warning-text">This will permanently delete all your notes, lists, and to-do items.</p>
          </div>
        </div>

        <div className="settings-section">
          <h2>About</h2>
          <div className="setting-item">
            <p>kiply v1.0.0</p>
            <p>A simple and elegant notes app built with React.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;