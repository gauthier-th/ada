import React, { useEffect, useState } from "react";
import { BrowserRouter, Route } from 'react-router-dom';
import Frame from './Frame';
import Home from './pages/Home';

import { registerHotword } from '../speechCommands';
import { triggerHotword } from '../ipc';

const Main = (props) => {
	const [ready, setReady] = useState(false);
	useEffect(() => {
		registerHotword(() => {
			triggerHotword();
		}, () => setReady(true));
	}, []);
	if (ready) {
		return <Frame>
			<BrowserRouter>
				<Route render={Home} />
			</BrowserRouter>
		</Frame>;
	}
	else {
		return <Frame>
			<h1 className="text-center">Chargement...</h1>
		</Frame>;
	}
}

export default Main;