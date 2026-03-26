function isAndroid() {
  return (
    window.Capacitor &&
    typeof window.Capacitor.getPlatform === "function" &&
    window.Capacitor.getPlatform() === "android"
  );
}