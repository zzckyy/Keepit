/* ===============================
   ENV
================================ */
const isNative = !!window.Capacitor?.isNativePlatform;


/* ===============================
   DOM CACHE
================================ */
const DOM = {
    notes: document.getElementById("notes"),
    pinnedNotes: document.getElementById("pinnedNotes"),
    pinnedTitle: document.getElementById("pinnedTitle"),
    othersTitle: document.getElementById("othersTitle"),
    emptyState: document.getElementById("emptyState"),
    searchInput: document.getElementById("searchInput"),

    sidebar: document.getElementById("sidebar"),
    sidebarBackdrop: document.getElementById("sidebarBackdrop"),

    deleteModal: document.getElementById("deleteModal"),
    confirmDelete: document.getElementById("confirmDelete"),
    cancelDelete: document.getElementById("cancelDelete"),
};


/* ===============================
   RENDER
================================ */
function renderNotes(keyword = "") {
    if (!DOM.notes || !DOM.pinnedNotes) return;

    const notes = getNotes()
        .filter(n => !n.trashed)
        .map(n => ({
            ...n,
            pinned: !!n.pinned,
            updatedAt: n.updatedAt || n.createdAt || 0
        }));

    const filtered = notes.filter(n =>
        (n.title || "").toLowerCase().includes(keyword.toLowerCase())
    );

    const pinned = filtered
        .filter(n => n.pinned)
        .sort((a, b) => b.updatedAt - a.updatedAt);

    const others = filtered
        .filter(n => !n.pinned)
        .sort((a, b) => b.updatedAt - a.updatedAt);

    DOM.pinnedNotes.innerHTML = "";
    DOM.notes.innerHTML = "";

    if (filtered.length === 0) {
        DOM.emptyState?.classList.remove("is-hidden");
        DOM.pinnedTitle?.classList.add("is-hidden");
        DOM.othersTitle?.classList.add("is-hidden");
        return;
    }

    DOM.emptyState?.classList.add("is-hidden");
    DOM.pinnedTitle?.classList.toggle("is-hidden", pinned.length === 0);
    DOM.othersTitle?.classList.toggle("is-hidden", others.length === 0);

    pinned.forEach(n => DOM.pinnedNotes.innerHTML += noteCard(n));
    others.forEach(n => DOM.notes.innerHTML += noteCard(n));
}

//memunculkan kembali text notesList
// <p class="is-size-6"> ${note.text?.substring(0, 13) || "(Tidak ada isi)"} ${note.text && note.text.length > 15 ? "...<hr>" : "<hr>"}  </p> 

/* ===============================
   CARD
================================ */
function noteCard(note) {
    return `
    <div class="p-4 m-2 listNotes pinned-card note-card" onclick="openEditor('${note.id}')">
            <p class="judulCatatanIndex py-2 title is-5"> ${note.title?.trim() || "Tanpa Judul"} ${note.title.length > 18 ? "...": ""}</p>
            <div class="is-flex is-justify-content-space-between">
                <p class="is-size-7"> ${new Date(note.updatedAt || note.createdAt).toLocaleDateString()} </p>
                <div class="is-flex"> 
                    <a class="button is-small mr-2" onclick="event.stopPropagation(); askDelete('${note.id}')"> <i class='bx bx-trash-alt'></i> </a> 
                    <a class="button is-small " onclick="event.stopPropagation(); togglePin('${note.id}')"> <i class='bx ${note.pinned ? "bxs-pin" : "bx-pin"}'></i></a> 
                </div> 
            </div>
    </div>
    `;
}


/* ===============================
   ACTIONS
================================ */
function togglePin(id) {
    const notes = getNotes().map(n =>
        n.id === id
            ? { ...n, pinned: !n.pinned, updatedAt: Date.now() }
            : n
    );

    saveNotes(notes);
    renderNotes(DOM.searchInput?.value || "");
}

function openEditor(id) {
    location.href = `editor.html?id=${id}`;
}

/* ===============================
   DELETE (SOFT)
================================ */
let pendingDeleteId = null;

function askDelete(id) {
    pendingDeleteId = id;
    DOM.deleteModal?.classList.add("is-active");
}

function closeDeleteModal() {
    pendingDeleteId = null;
    DOM.deleteModal?.classList.remove("is-active");
}

function moveToTrash(id) {
    const notes = getNotes().map(n =>
        n.id === id
            ? { ...n, trashed: true, trashedAt: Date.now() }
            : n
    );

    saveNotes(notes);
}


/* ===============================
   EVENTS
================================ */
DOM.searchInput?.addEventListener("input", e => {
    renderNotes(e.target.value);
});

DOM.confirmDelete?.addEventListener("click", () => {
    if (pendingDeleteId) {
        moveToTrash(pendingDeleteId);
        renderNotes(DOM.searchInput?.value || "");
    }
    closeDeleteModal();
});

DOM.cancelDelete?.addEventListener("click", closeDeleteModal);

document.querySelectorAll(
    "#deleteModal .delete, #deleteModal .modal-background"
).forEach(el =>
    el?.addEventListener("click", closeDeleteModal)
);


/* ===============================
   INIT
================================ */
renderNotes();
