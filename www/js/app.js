if (
  typeof window !== 'undefined' &&
  window.Capacitor &&
  window.Capacitor.isNativePlatform()
) {
  import('@capacitor/app').then(({ App }) => {
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        history.back();
      } else {
        App.exitApp();
      }
    });
  });
}
