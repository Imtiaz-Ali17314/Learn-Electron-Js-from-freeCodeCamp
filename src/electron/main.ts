import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { isDev } from "./utils.js";
import { getStaticData, pullResources } from "./resourceManage.js";
import { getPreloadPath } from "./pathResolver.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"));
  }

  pullResources(mainWindow);

  ipcMain.handle("getStaticData", () => {
    return getStaticData();
  });
});
