import React, { useEffect, useState } from "react";
import Frame from './Frame';
import SquareBackground from './SquareBackground';
import HolographicProjection from './HolographicProjection';
import { registerHotword } from '../speechCommands';
import { triggerHotword } from '../ipc';

const Main = (props) => {
	const [ready, setReady] = useState(false);
	useEffect(() => {
		registerHotword(() => {
			triggerHotword();
		}, () => setReady(true));
	}, []);
	return <Frame>
		<h1>Ada Assistant</h1>
		{ready && <h2>Ready!</h2>}
		{/* <SquareBackground /> */}
		<HolographicProjection />
	</Frame>;
}

export default Main;