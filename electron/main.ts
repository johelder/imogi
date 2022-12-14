import { app, BrowserWindow, ipcMain, globalShortcut } from 'electron';

import * as path from 'path';

let mainWindow: BrowserWindow | null;

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

function createWindow() {
  mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'assets/imogicon.icns'),
    width: 350,
    height: 400,
    backgroundColor: '#1B1D24',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      defaultFontFamily: {
        standard: 'Ubuntu',
      },
    },
    frame: false,
  });

  mainWindow.setAlwaysOnTop(true);

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  globalShortcut.register('Super+.', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
      return;
    }

    mainWindow?.show();
  });
}

async function registerListeners() {
  /**
   * This comes from bridge integration, check bridge.ts
   */
  ipcMain.on('message', (_, message) => {
    console.log(message);
  });
}

app
  .on('ready', () => {
    createWindow();
    mainWindow?.setSkipTaskbar(true);
  })
  .whenReady()
  .then(registerListeners)
  .catch(e => console.error(e));

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
