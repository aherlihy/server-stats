'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const runner = require('mongodb-runner');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 1200, height: 800 });
  mainWindow.loadURL(`file://${__dirname}/../renderer/index.html`);
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  runner.start({ port: 27025 }, () => {
    createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    runner.stop({ port: 27025 }, () => {
      app.quit();
    });
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
