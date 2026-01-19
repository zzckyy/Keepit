const isNative = !!window.Capacitor?.isNativePlatform;


const notesContainer = document.getElementById("notes");
const pinnedContainer = document.getElementById("pinnedNotes");
const pinnedTitle = document.getElementById("pinnedTitle");
const othersTitle = document.getElementById("othersTitle");

function renderNotes(keyword = "") {
    let notes = getNotes()
        .filter(n => !n.trashed)
        .map(n => ({
            ...n,
            pinned: n.pinned || false,
            updatedAt: n.updatedAt || 0
        }));

    const filtered = notes.filter(note =>
        (note.title || "")
            .toLowerCase()
            .includes(keyword.toLowerCase())
    );

    const pinned = filtered
        .filter(n => n.pinned)
        .sort((a, b) => b.updatedAt - a.updatedAt);

    const others = filtered
        .filter(n => !n.pinned)
        .sort((a, b) => b.updatedAt - a.updatedAt);

    pinnedContainer.innerHTML = "";
    notesContainer.innerHTML = "";

    const emptyState = document.getElementById("emptyState");

    if (filtered.length === 0) {
        emptyState.classList.remove("is-hidden");
        pinnedTitle.classList.add("is-hidden");
        othersTitle.classList.add("is-hidden");
        return;
    } else {
        emptyState.classList.add("is-hidden");
    }

    pinnedTitle.classList.toggle("is-hidden", pinned.length === 0);
    othersTitle.classList.toggle("is-hidden", others.length === 0);

    pinned.forEach(note =>
        pinnedContainer.innerHTML += noteCard(note)
    );

    others.forEach(note =>
        notesContainer.innerHTML += noteCard(note)
    );
}


function noteCard(note) {
    return `
    <div class="p-3 m-2 listNotes pinned-card note-card"
         onclick="openEditor('${note.id}')">
        <p class="is-size-7 mb-2">
            ${new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
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

          <div class="card-footer is-flex is-justify-content-space-between mt-5">
            <a onclick="event.stopPropagation(); askDelete('${note.id}')">
              <i class='bx  bx-trash-alt'></i> 
            </a>

            <a class="mx-2"
                onclick="event.stopPropagation(); shareNote('${note.id}')">
                <i class='bx bx-share'></i>
            </a>

            <a onclick="event.stopPropagation(); togglePin('${note.id}')">
              <i class='bx ${note.pinned ? "bxs-pin" : "bx-pin"}'></i>
            </a>
            
            
          </div>
            
        </div>
      </article>
    </div>
  `;
}


const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {
    renderNotes(this.value);
});

function togglePin(id) {
    const notes = getNotes();

    const updatedNotes = notes.map(note => {
        if (note.id === id) {
            return { ...note, pinned: !note.pinned, updatedAt: Date.now() };
        }
        return note;
    });

    saveNotes(updatedNotes);
    renderNotes(document.getElementById("searchInput").value);
}


function openEditor(id) {
    location.href = `editor.html?id=${id}`;
}

async function shareNote(noteId) {
    const note = getNotes().find(n => n.id === noteId);
    if (!note) return;

    const title = note.title?.trim() || "Catatan dari Keepit";
    const text = note.text?.trim() || "";

    // 🌐 WEB
    if (!isNative) {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text
                });
            } catch (err) {
                console.error(err);
            }
        } else {
            // fallback: copy ke clipboard
            await navigator.clipboard.writeText(`${title}\n\n${text}`);
            alert("Catatan disalin");
        }
        return;
    }

    // 📱 ANDROID (Capacitor)
    const { Share } = Capacitor.Plugins;

    try {
        await Share.share({
            title,
            text
        });
    } catch (err) {
        console.error(err);
        alert("Gagal berbagi catatan");
    }
}


async function exportNotes() {
    const notes = getNotes();
    const dataStr = JSON.stringify(notes, null, 2);

    // 🌐 WEB (browser biasa)
    if (!isNative) {
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "keepit-notes-backup.json";
        a.click();

        URL.revokeObjectURL(url);
        return;
    }

    // 📱 ANDROID (Capacitor)
    const { Filesystem, Directory, Encoding } = Capacitor.Plugins;

    try {
        const fileName = `keepit-backup-${Date.now()}.json`;

        await Filesystem.writeFile({
            path: fileName,
            data: dataStr,
            directory: Directory.Documents,
            encoding: Encoding.UTF8
        });

        alert("Backup tersimpan di Documents");
    } catch (err) {
        console.error(err);
        alert("Gagal export");
    }
}


document.getElementById("importFile").addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        try {
            const importedNotes = JSON.parse(event.target.result);
            if (!Array.isArray(importedNotes)) throw "Format salah";

            saveNotes(importedNotes);
            renderNotes();
            alert("Import berhasil 🎉");
        } catch (err) {
            alert("File invalid ❌");
        }
    };

    reader.readAsText(file);
});

function moveToTrash(id) {
    const notes = getNotes().map(note => {
        if (note.id === id) {
            return {
                ...note,
                trashed: true,
                trashedAt: Date.now()
            };
        }
        return note;
    });

    saveNotes(notes);
}


let pendingDeleteId = null;

function askDelete(noteId) {
    pendingDeleteId = noteId;
    document.getElementById("deleteModal").classList.add("is-active");
}

function closeDeleteModal() {
    pendingDeleteId = null;
    document.getElementById("deleteModal").classList.remove("is-active");
}

document.getElementById("confirmDelete").addEventListener("click", () => {
    if (pendingDeleteId !== null) {
        moveToTrash(pendingDeleteId); // ✅ SOFT DELETE
        renderNotes(document.getElementById("searchInput").value);              // ⬅️ INI YANG TADI HILANG
    }
    closeDeleteModal();
});

document.getElementById("cancelDelete").addEventListener("click", closeDeleteModal);

document.querySelectorAll(
    "#deleteModal .delete, #deleteModal .modal-background"
).forEach(el => el.addEventListener("click", closeDeleteModal));


function formatDate(timestamp) {
    if (!timestamp) return "—";

    const d = new Date(timestamp);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()).slice(-2);

    return `${day}/${month}/${year}`;
}

const fabBtn = document.getElementById("fabBtn");
const fabMenu = document.getElementById("fabMenu");



function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("sidebarBackdrop").classList.toggle("active");
}

function closeSidebar() {
    document.getElementById("sidebar").classList.remove("active");
    document.getElementById("sidebarBackdrop").classList.remove("active");
}


renderNotes();
