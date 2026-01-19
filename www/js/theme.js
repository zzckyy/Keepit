const THEME_KEY = "keepit-theme"; // light | dark | auto

function applyTheme(theme) {
  if (theme === "auto") {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
  } else {
    document.documentElement.dataset.theme = theme;
  }
}

function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || "auto";
  applyTheme(saved);
}

/* auto update kalau system berubah */
window.matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "auto") applyTheme("auto");
  });

initTheme();
