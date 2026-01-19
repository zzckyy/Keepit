
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
       <div class="p-3 m-2 listNotes pinned-card note-card">
        <p class="is-size-7 mb-2">
            Deleted: ${formatDate(note.trashedAt)}
        </p>
      <article class="media">
        <div class="media-content card-content">
    
          <div class="hiddenScroll">
            <p class="judulCatatanIndex p3 title is-5">
            ${note.title?.trim() || "Tanpa Judul"}
            
            </p>

            <p class="is-size-6">
                ${note.text?.substring(0, 15) || "(Tidak ada isi)"}
                ${note.text && note.text.length > 15 ? "..." : ""}
            </p>

          <div class="is-flex mt-5">
            <a href="javascript:void(0);" 
             class="card-footer-item button is-size-5 p-1 m-2"
             onclick="restoreNote('${note.id}')">
            <i class='bx  bx-folder-down-arrow'></i> 
          </a>

            <a href="javascript:void(0);" 
             class="card-footer-item button is-size-5 is-small p-1 m-2"
             onclick="openDeleteModal('${note.id}')">
            <i class='bx  bx-trash'></i> 
          </a>
            
            
          </div>
            
        </div>
      </article>
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
  document.getElementById("deleteModal").classList.add("is-active");
}

function closeDeleteModal() {
  deleteTargetId = null;
  document.getElementById("deleteModal").classList.remove("is-active");
}

document.getElementById("confirmDeleteBtn").addEventListener("click", () => {
  if (!deleteTargetId) return;

  deletePermanent(deleteTargetId);
  closeDeleteModal();
});


renderTrash();


