const ipcRenderer = window.ipcRenderer;

export const triggerHotword = () => {
	ipcRenderer.send('trigger-hotword');
};