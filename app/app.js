require('dotenv').config();
const { app, BrowserWindow, ipcMain } = require('electron');

const core = require('../core');

function createWindow () {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: __dirname + '/preload.js'
		}
	});

	win.loadFile('app/build/index.html');

	// win.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin')
		app.quit();
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0)
		createWindow();
});

ipcMain.on('trigger-hotword', (event, arg) => {
	core();
});