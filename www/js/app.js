// =====================
// HELPER
// =====================
function isNative() {
  return !!(window.Capacitor && window.Capacitor.isNativePlatform());
}

// =====================
// ANDROID BACK BUTTON
// =====================
if (isNative()) {
  const { App } = window.Capacitor.Plugins;

  App.addListener('backButton', () => {
    const page = location.pathname.split('/').pop();

    if (page && page !== 'index.html') {
      window.location.href = 'index.html';
    } else {
      App.exitApp();
    }
  });
}

// =====================
// EXPORT NOTES (GLOBAL)
// =====================
window.exportNotes = async function () {
  const notes = getNotes();
  const dataStr = JSON.stringify(notes, null, 2);

  // 🌐 WEB MODE
  if (!isNative()) {
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "keepit-notes-backup.json";
    a.click();

    URL.revokeObjectURL(url);
    return;
  }

  // 📱 ANDROID MODE
  try {
    const { Filesystem, Directory, Encoding, Share } =
      window.Capacitor.Plugins;

    const result = await Filesystem.writeFile({
      path: `keepit-backup-${Date.now()}.json`,
      data: dataStr,
      directory: Directory.documents,
      encoding: Encoding.UTF8
    });

  } catch (err) {
    console.error(err);
    alert("Gagal export ❌");
  }
};

// =====================
// IMPORT NOTES (GLOBAL)
// =====================
window.importNotes = function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedNotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedNotes)) {
        throw new Error("Format salah");
      }

      saveNotes(importedNotes);
      alert("Import berhasil 🎉");

      if (typeof renderNotes === "function") {
        renderNotes();
      }
    } catch (err) {
      alert("File invalid ❌");
    }
  };

  reader.readAsText(file);
};

// =====================
// CLEAR ALL DATA (GLOBAL)
// =====================
window.clearAllData = function () {
  if (
    confirm(
      "Apakah Anda yakin ingin menghapus semua catatan?\nTindakan ini tidak dapat dibatalkan!"
    )
  ) {
    localStorage.removeItem("keepit_notes");
    alert("Semua data telah dihapus");

    if (typeof renderNotes === "function") {
      renderNotes();
    }
  }
};
