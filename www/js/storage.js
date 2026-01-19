function getNotes() {
  return JSON.parse(localStorage.getItem("keepit_notes")) || [];
}

function saveNotes(notes) {
  localStorage.setItem("keepit_notes", JSON.stringify(notes));
}

function getNoteById(id) {
  return getNotes().find(n => n.id === id);
}

function deleteNoteById(id) {
  const notes = getNotes().filter(n => n.id !== id);
  saveNotes(notes);
  
}