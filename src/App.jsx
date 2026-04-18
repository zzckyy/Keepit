import { useState, useEffect } from 'react';
import { NavLink, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import EditorNotes from './EditorNotes';
import ToDoPage from './ToDoPage';
import ListPage from './ListPage';
import SettingsPage from './SettingsPage';
import AboutPage from './AboutPage';
import './App.css';
import 'bulma/css/bulma.css';

function App() {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes')) || [];
    setNotes(savedNotes);
  }, [location.pathname]);

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const editNote = (id) => {
    navigate(`/editor/${id}`);
  };

  const addNote = () => {
    navigate('/editor');
  };

  return (
    <div className="app-container fullbody">
      {/* SIDEBAR (desktop only) */}
      <aside className="sidebar">
        <div className="menu p-4">
          <p className="menu-label">kiply</p>
          <ul className="menu-list">
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'is-active' : ''}>Notes</NavLink></li>
            <li className="my-2"><NavLink to="/list" className={({ isActive }) => isActive ? 'is-active' : ''}>List</NavLink></li>
            <li className="my-2"><NavLink to="/todo" className={({ isActive }) => isActive ? 'is-active' : ''}>To-Do</NavLink></li>
            <li className="my-2"><NavLink to="/settings" className={({ isActive }) => isActive ? 'is-active' : ''}>Settings</NavLink></li>
            <li className="my-2"><NavLink to="/about" className={({ isActive }) => isActive ? 'is-active' : ''}>About</NavLink></li>
          </ul>
        </div>
      </aside>

      {/* CONTENT */}
      <div className="main-content p-4">
        <Routes>
          <Route path="/" element={
            <>
              <h1 className="title">Your Notes</h1>

              <div className="notes-grid">
                {notes.map(note => (
                  <div key={note.id} className="note-box" onClick={() => editNote(note.id)}>
                    <h3 className="note-title">{note.title.length > 20 ? note.title.slice(0, 20) + '...' : note.title || 'Untitled'}</h3>
                    <p className="note-content">{note.content.length > 80 ? note.content.slice(0, 80) + '...' : note.content}</p>
                    <small className="note-date">Created: {new Date(note.createdAt).toLocaleDateString()}</small>
                    <button className="delete-btn" onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>

              {notes.length === 0 && (
                <div className="empty-state">
                  <p>No notes yet. Click the + button to add your first note!</p>
                </div>
              )}

              <button className="add-btn" onClick={addNote} title="Add New Note">
                <i className="fas fa-plus"></i>
              </button>
            </>
          } />
          <Route path="/list" element={<ListPage />} />
          <Route path="/todo" element={<ToDoPage />} />
          <Route path="/editor/:id?" element={<EditorNotes />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;