import { useState, useEffect, useRef } from 'react';
import './App.css';

function ListPage() {
  const [lists, setLists] = useState([]);
  const [saveState, setSaveState] = useState('Saved');
  const saveTimeout = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('lists')) || [];
    setLists(saved);
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem('lists', JSON.stringify(data));
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
      saveToStorage(lists);
      saveTimeout.current = null;
    }, 800);

    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [lists]);

  const manualSave = () => {
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
      saveTimeout.current = null;
    }
    saveToStorage(lists);
  };

  const addList = () => {
    const newList = {
      id: Date.now(),
      title: 'New list',
      items: [],
    };
    setLists([newList, ...lists]);
  };

  const updateListTitle = (listId, value) => {
    setLists(lists.map(list =>
      list.id === listId ? { ...list, title: value } : list
    ));
  };

  const addListItem = (listId) => {
    setLists(lists.map(list =>
      list.id === listId
        ? { ...list, items: [...list.items, { id: Date.now(), text: '' }] }
        : list
    ));
  };

  const updateListItem = (listId, itemId, value) => {
    setLists(lists.map(list =>
      list.id === listId
        ? {
          ...list,
          items: list.items.map(item =>
            item.id === itemId ? { ...item, text: value } : item
          )
        }
        : list
    ));
  };

  const deleteList = (listId) => {
    setLists(lists.filter(list => list.id !== listId));
  };

  const deleteListItem = (listId, itemId) => {
    setLists(lists.map(list =>
      list.id === listId
        ? { ...list, items: list.items.filter(item => item.id !== itemId) }
        : list
    ));
  };

  return (
    <div className="">
      <div className="">
          <h1 className='title is-3'>List</h1>
          {/* <p className='subtitle is-3'>Buat daftar yang dapat diisi langsung dalam setiap box.</p> */}
        </div>
      {saveState === 'Saving...' && (
        <div className="status-toast">Saving...</div>
      )}

      <div className="fixed-grid">
        {lists.map(list => (
          <div key={list.id} className="cell box">
            <div className="box-top">
              <input
                className="box-title"
                type="text"
                value={list.title}
                onChange={(e) => updateListTitle(list.id, e.target.value)}
                placeholder="List title"
              />
              <button className="box-delete" onClick={() => deleteList(list.id)} title="Delete list">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="item-list">
              {list.items.length === 0 && (
                <p className="empty-box-text">Tambahkan item list di bawah.</p>
              )}
              {list.items.map(item => (
                <div key={item.id} className="list-item">
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => updateListItem(list.id, item.id, e.target.value)}
                    placeholder="Type list item..."
                    className="item-input"
                  />
                  <button className="item-delete" onClick={() => deleteListItem(list.id, item.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>

            <button className="box-action" onClick={() => addListItem(list.id)}>
              <i className="fas fa-plus"></i> Add item
            </button>
          </div>
        ))}
      </div>

      <button className="add-btn" onClick={addList} title="Add List Box">
        <i className="fas fa-plus"></i>
      </button>
    </div>
  );
}

export default ListPage;
