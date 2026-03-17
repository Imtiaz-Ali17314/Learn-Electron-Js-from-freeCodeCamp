import { app, BrowserWindow, Menu } from "electron";
import { ipcWebCintentsSend, isDev } from "./utils.js";

export function createMenu(mainWindow: BrowserWindow) {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: "App",
        type: "submenu",
        submenu: [
          {
            label: "Quit",
            click: () => app.quit(),
          },
          {
            label: "DevTools",
            click: () => mainWindow.webContents.openDevTools(),
            visible: isDev(),
          },
        ],
      },
      {
        label: "View",
        type: "submenu",
        submenu: [
          {
            label: "CPU",
            click: () =>
              ipcWebCintentsSend("changeView", mainWindow.webContents, "CPU"),
          },
          {
            label: "RAM",
            click: () =>
              ipcWebCintentsSend("changeView", mainWindow.webContents, "RAM"),
          },
          {
            label: "STORAGE",
            click: () =>
              ipcWebCintentsSend(
                "changeView",
                mainWindow.webContents,
                "STORAGE",
              ),
          },
        ],
      },
    ]),
  );
}
