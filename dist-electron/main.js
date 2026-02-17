"use strict";
const electron = require("electron");
const path = require("path");
const isDev = process.env.VITE_DEV_SERVER_URL !== void 0;
function createWindow() {
  const win = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true
    }
  });
  win.setMenuBarVisibility(false);
  electron.session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    const allowedPermissions = ["media", "microphone", "audioCapture"];
    if (allowedPermissions.includes(permission)) {
      callback(true);
    } else {
      callback(false);
    }
  });
  electron.session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
    const allowedPermissions = ["media", "microphone", "audioCapture"];
    return allowedPermissions.includes(permission);
  });
  if (isDev) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}
electron.ipcMain.on("window:minimize", (event) => {
  electron.BrowserWindow.fromWebContents(event.sender)?.minimize();
});
electron.ipcMain.on("window:toggle-maximize", (event) => {
  const win = electron.BrowserWindow.fromWebContents(event.sender);
  if (!win) return;
  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
});
electron.ipcMain.on("window:close", (event) => {
  electron.BrowserWindow.fromWebContents(event.sender)?.close();
});
electron.app.whenReady().then(createWindow);
electron.Menu.setApplicationMenu(null);
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") electron.app.quit();
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
});
