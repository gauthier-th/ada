import React from 'react';
const { BrowserWindow } = window.require('electron').remote;

const Frame = ({ children }) => {
	return <div className="d-flex flex-column">
		<div className="frame-title-bar d-flex justifuy-content-between">
			<div className="title">
				Ada Assistant
			</div>
			<div className="controls">
				<div onClick={() => BrowserWindow.getFocusedWindow().minimize()}>&#xE921;</div>
				<div onClick={() => BrowserWindow.getFocusedWindow().isMaximized() ? BrowserWindow.getFocusedWindow().restore() : BrowserWindow.getFocusedWindow().maximize()}>&#xE922;</div>
				<div onClick={() => BrowserWindow.getFocusedWindow().close()}>&#xE8BB;</div>
			</div>
		</div>
		<div>
			{children}
		</div>
	</div>
};

export default Frame;