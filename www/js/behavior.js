import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";

SplashScreen.hide();
StatusBar.setOverlaysWebView({ overlay: true });
StatusBar.setStyle({ style: Style.Dark });