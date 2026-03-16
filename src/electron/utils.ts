import { ipcMain, WebContents, WebFrameMain } from "electron";
import { getUIPath } from "./pathResolver.js";
import { pathToFileURL } from "url";

export function isDev() {
  return process.env.NODE_ENV === "development";
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: () => EventPayloadMapping[Key],
) {
  ipcMain.handle(key, (event) => {
    const frame = event.senderFrame;

    if (!frame) {
      throw new Error("Sender frame destroyed or unavailable");
    }

    validateEventFrame(event.senderFrame);
    return handler();
  });
}

export function ipcWebCintentsSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  wbContents: WebContents,
  payload: EventPayloadMapping[Key],
) {
  wbContents.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain) {
  if (isDev() && new URL(frame.url).host === "localhost:5123") {
    return;
  }

  if (frame.url !== pathToFileURL(getUIPath()).toString()) {
    throw new Error("Invalid frame url");
  }
}
