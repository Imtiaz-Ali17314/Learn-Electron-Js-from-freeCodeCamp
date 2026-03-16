import path from "path";
import { app, BrowserWindow, Tray } from "electron";
import { ipcMainHandle, isDev } from "./utils.js";
import { getStaticData, pullResources } from "./resourceManage.js";
import { getAssetPath, getPreloadPath, getUIPath } from "./pathResolver.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(getUIPath());
  }

  pullResources(mainWindow);

  ipcMainHandle("getStaticData", () => {
    return getStaticData();
  });

  new Tray(
    path.join(
      getAssetPath(),
      process.platform === "darwin" ? "trayIconTemplate.png" : "trayIcon.png",
    ),
  );
});
