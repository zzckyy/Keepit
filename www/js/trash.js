
function renderTrash() {
  const trashList = document.getElementById("trashList");
  const emptyTrash = document.getElementById("emptyTrash");

  let notes = getNotes().filter(n => n.trashed === true);

  // sort terbaru dibuang
  notes.sort((a, b) => b.trashedAt - a.trashedAt);

  trashList.innerHTML = "";

  if (notes.length === 0) {
    emptyTrash.classList.remove("is-hidden");
    return;
  }

  emptyTrash.classList.add("is-hidden");

  notes.forEach(note => {
    const div = document.createElement("div");
    div.className = "";

    div.innerHTML = `
       <div class="p-4 m-2 listNotes pinned-card note-card" onclick="openEditor('${note.id}')"> 
        
        <div class=""> 
            <div class=""> 
            <p class="judulCatatanIndex py-2 title is-5"> ${note.title?.trim() || "Tanpa Judul"} ${note.title.length > 18 ? "...": ""}</p>
            <div class="is-flex is-justify-content-space-between">
                    <p class="is-size-7"> ${new Date(note.updatedAt || note.createdAt).toLocaleDateString()} </p> 
                    <div>
                    <div class="is-flex"> 
                        <a class="button is-small mr-2" onclick="event.stopPropagation(); askDelete('${note.id}')"> <i class='bx bx-trash-alt'></i> </a> 
                        <a class="button is-small " onclick="event.stopPropagation(); togglePin('${note.id}')"> <i class='bx ${note.pinned ? "bxs-pin" : "bx-pin"}'></i></a> 
                    </div> 
            </div>
        </div> 
    </div>
    `;

    trashList.appendChild(div);
  });
}

function restoreNote(id) {
  const notes = getNotes().map(note => {
    if (note.id === id) {
      return {
        ...note,
        trashed: false,
        trashedAt: null,
        updatedAt: Date.now()
      };
    }
    return note;
  });

  saveNotes(notes);
  renderTrash();
}

function deletePermanent(id) {
  const notes = getNotes().filter(note => note.id !== id);
  saveNotes(notes);
  renderTrash();
}



function formatDate(timestamp) {
  if (!timestamp) return "—";
  const d = new Date(timestamp);
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getFullYear()).slice(-2)}`;
}

let deleteTargetId = null;

function openDeleteModal(id) {
  deleteTargetId = id;
  document.getElementById("trashDeleteModal").classList.add("is-active");
}

function closeDeleteModal() {
  deleteTargetId = null;
  document.getElementById("trashDeleteModal").classList.remove("is-active");
}

const confirmBtn = document.getElementById("confirmDeleteBtn");
if (confirmBtn) {
  confirmBtn.addEventListener("click", () => {
    if (!deleteTargetId) return;
    deletePermanent(deleteTargetId);
    closeDeleteModal();
  });
}


renderTrash();


