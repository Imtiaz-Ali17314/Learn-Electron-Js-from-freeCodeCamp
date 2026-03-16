import { ipcMain, WebContents } from "electron";

export function isDev() {
  return process.env.NODE_ENV === "development";
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: () => EventPayloadMapping[Key],
) {
  ipcMain.handle(key, () => handler());
}

export function ipcWebCintentsSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  wbContents: WebContents,
  payload: EventPayloadMapping[Key],
) {
  wbContents.send(key, payload);
}
