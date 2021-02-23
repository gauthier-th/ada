const { ipcRenderer } = window.require('electron');

export const triggerHotword = () => {
	ipcRenderer.send('trigger-hotword');
};