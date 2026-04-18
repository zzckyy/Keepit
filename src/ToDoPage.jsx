import { useState, useEffect, useRef } from 'react';
import './App.css';

function ToDoPage() {
  const [todoBoxes, setTodoBoxes] = useState([]);
  const [saveState, setSaveState] = useState('Saved');
  const saveTimeout = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('todoBoxes')) || [];
    setTodoBoxes(saved);
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem('todoBoxes', JSON.stringify(data));
    setSaveState('Saved');
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setSaveState('Saving...');
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(() => {
      saveToStorage(todoBoxes);
      saveTimeout.current = null;
    }, 800);

    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [todoBoxes]);

  const manualSave = () => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
      saveTimeout.current = null;
    }
    saveToStorage(todoBoxes);
  };

  const addBox = () => {
    const newBox = {
      id: Date.now(),
      title: 'New To-Do',
      items: [],
    };
    setTodoBoxes([newBox, ...todoBoxes]);
  };

  const updateBoxTitle = (boxId, value) => {
    setTodoBoxes(todoBoxes.map(box =>
      box.id === boxId ? { ...box, title: value } : box
    ));
  };

  const addItem = (boxId) => {
    setTodoBoxes(todoBoxes.map(box =>
      box.id === boxId
        ? { ...box, items: [...box.items, { id: Date.now(), text: '', done: false }] }
        : box
    ));
  };

  const updateItemText = (boxId, itemId, value) => {
    setTodoBoxes(todoBoxes.map(box =>
      box.id === boxId
        ? {
          ...box,
          items: box.items.map(item =>
            item.id === itemId ? { ...item, text: value } : item
          )
        }
        : box
    ));
  };

  const toggleDone = (boxId, itemId) => {
    setTodoBoxes(todoBoxes.map(box =>
      box.id === boxId
        ? {
          ...box,
          items: box.items.map(item =>
            item.id === itemId ? { ...item, done: !item.done } : item
          )
        }
        : box
    ));
  };

  const deleteBox = (boxId) => {
    setTodoBoxes(todoBoxes.filter(box => box.id !== boxId));
  };

  const deleteItem = (boxId, itemId) => {
    setTodoBoxes(todoBoxes.map(box =>
      box.id === boxId
        ? { ...box, items: box.items.filter(item => item.id !== itemId) }
        : box
    ));
  };

  return (
    <div className="">
      <div className="">
          <h1 className='title is-3'>To-Do</h1>
          {/* <p>Tambah dan centang item yang sudah selesai langsung dari setiap box.</p> */}
      </div>
      {saveState === 'Saving...' && (
        <div className="status-toast">Saving...</div>
      )}

      <div className="fixed-grid">
        {todoBoxes.map(box => (
          <div key={box.id} className="cell box">
            <div className="box-top">
              <input
                className="box-title"
                type="text"
                value={box.title}
                onChange={(e) => updateBoxTitle(box.id, e.target.value)}
                placeholder="Title To-Do"
              />
              <button className="box-delete" onClick={() => deleteBox(box.id)} title="Delete box">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="item-list">
              {box.items.length === 0 && (
                <p className="empty-box-text">Tidak ada item. Tambahkan item baru di bawah.</p>
              )}
              {box.items.map(item => (
                <div key={item.id} className="todo-item">
                  <label className="todo-checkbox">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggleDone(box.id, item.id)}
                    />
                    <span className={item.done ? 'item-text done' : 'item-text'}>
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => updateItemText(box.id, item.id, e.target.value)}
                        placeholder="Describe task..."
                        className="item-input"
                      />
                    </span>
                  </label>
                  <button className="item-delete" onClick={() => deleteItem(box.id, item.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>

            <button className="box-action" onClick={() => addItem(box.id)}>
              <i className="fas fa-plus"></i> Add task
            </button>
          </div>
        ))}
      </div>

      <button className="add-btn" onClick={addBox} title="Add To-Do Box">
        <i className="fas fa-plus"></i>
      </button>
    </div>
  );
}

export default ToDoPage;
