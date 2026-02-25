
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
    div.className = "listNotes note-card p-4 m-2";

    div.innerHTML = `
      <div class="">
        <p class="judulCatatanIndex py-2 title is-5"> ${note.title?.trim() || "Tanpa Judul"} ${note.title.length > 18 ? "...": ""}</p>
        <div class="is-flex is-justify-content-space-between">
          <p class="is-size-7"> Deleted: ${formatDate(note.trashedAt)}</p>
          <div class="is-flex">
            <a href="javascript:void(0);" class="button is-size-5 is-small p-1 m-2" onclick="openDeleteModal('${note.id}')">
              <i class='bx  bx-trash'></i>
            </a>

            <a href="javascript:void(0);" class="button is-size-5 p-1 m-2" onclick="restoreNote('${note.id}')">
              <i class='bx  bx-folder-down-arrow'></i>
            </a>
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


