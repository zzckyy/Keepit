const params = new URLSearchParams(window.location.search);
let noteId = params.get("id");

const titleInput = document.getElementById("titleInput");
const textInput = document.getElementById("textInput");

let notes = getNotes();
let note = null;
let saveTimer = null;

/* =====================
   LOAD NOTE
===================== */
if (noteId) {
  note = notes.find(n => n.id === noteId);
  if (note) {
    titleInput.value = note.title || "";
    textInput.innerHTML = note.text || "";
  }
}

/* =====================
   AUTOSAVE (DEBOUNCE)
===================== */
function autoSave() {
  clearTimeout(saveTimer);

  saveTimer = setTimeout(() => {
    const title = titleInput.value.trim();
    const text = textInput.innerHTML.trim();

    if (!title && !text) return;

    if (!note) {
      noteId = crypto.randomUUID();
      note = {
        id: noteId,
        title: "",
        text: "",
        pinned: false,
        updatedAt: Date.now()
      };
      notes.unshift(note);
    }


    note.title = title;
    note.text = text;
    note.updatedAt = Date.now();
    saveNotes(notes);
  }, 300); // debounce 300ms
}

/* =====================
   FORMAT TOOLBAR
===================== */
function format(command, value = null) {
  textInput.focus();               // 🔥 WAJIB
  
  if (command === 'fontSize' && value) {
    document.execCommand(command, false, value);
  } else {
    document.execCommand(command);
  }
  
  autoSave();
}

/* =====================
   WORD/COUNT FUNCTION
===================== */
function updateCounts() {
  const text = textInput.innerText || textInput.textContent || '';
  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
  const chars = text.length;
  
  document.getElementById('wordCount').textContent = words.length;
  document.getElementById('charCount').textContent = chars;
}

/* =====================
   EVENTS
===================== */
titleInput.addEventListener("input", () => {
  autoSave();
  updateCounts();
});

textInput.addEventListener("input", () => {
  autoSave();
  updateCounts();
});

// Initial count update
updateCounts();

