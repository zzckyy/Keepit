window.addEventListener("load", async () => {
  if (window.Capacitor?.Plugins) {
    const { StatusBar, SplashScreen } = window.Capacitor.Plugins;

    await SplashScreen.hide();
    await StatusBar.setOverlaysWebView({ overlay: true });
    await StatusBar.setStyle({ style: "DARK" });
  }
});