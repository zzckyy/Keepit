/* ===============================
   PARAMS
================================ */
const params = new URLSearchParams(window.location.search);
let noteId = params.get("id");


/* ===============================
   DOM CACHE
================================ */
const DOM = {
  title: document.getElementById("titleInput"),
  text: document.getElementById("textInput"),
  wordCount: document.getElementById("wordCount"),
  charCount: document.getElementById("charCount"),
};


/* ===============================
   STATE
================================ */
let notes = getNotes();
let note = null;
let saveTimer = null;


/* ===============================
   LOAD NOTE
================================ */
function loadNote() {
  if (!noteId || !DOM.title || !DOM.text) return;

  note = notes.find(n => n.id === noteId);
  if (!note) return;

  DOM.title.value = note.title || "";
  DOM.text.innerHTML = note.text || "";
}

loadNote();


/* ===============================
   AUTOSAVE (DEBOUNCE)
================================ */
function autoSave() {
  if (!DOM.title || !DOM.text) return;

  clearTimeout(saveTimer);

  saveTimer = setTimeout(() => {
    const title = DOM.title.value.trim();
    const text = DOM.text.innerHTML.trim();

    // kalau kosong semua, ga usah simpan
    if (!title && !text) return;

    // note baru
    if (!note) {
      noteId = crypto.randomUUID();
      note = {
        id: noteId,
        title: "",
        text: "",
        pinned: false,
        trashed: false,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      notes.unshift(note);
    }

    note.title = title;
    note.text = text;
    note.updatedAt = Date.now();

    saveNotes(notes);
  }, 300);
}


/* ===============================
   FORMAT TOOLBAR
================================ */
function format(command, value = null) {
  if (!DOM.text) return;

  DOM.text.focus();

  if (value !== null) {
    document.execCommand(command, false, value);
  } else {
    document.execCommand(command);
  }

  autoSave();
}


/* ===============================
   COUNTER
================================ */
function updateCounts() {
  if (!DOM.text) return;

  const text =
    DOM.text.innerText ||
    DOM.text.textContent ||
    "";

  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const chars = text.length;

  if (DOM.wordCount) DOM.wordCount.textContent = words;
  if (DOM.charCount) DOM.charCount.textContent = chars;
}


/* ===============================
   EVENTS
================================ */
DOM.title?.addEventListener("input", () => {
  autoSave();
  updateCounts();
});

DOM.text?.addEventListener("input", () => {
  autoSave();
  updateCounts();
});


/* ===============================
   INIT
================================ */
updateCounts();
