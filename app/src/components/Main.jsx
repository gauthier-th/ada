import React, { useEffect, useState } from "react";
import { registerHotword } from '../speechCommands';
import { triggerHotword } from '../ipc';

const Main = (props) => {
	const [ready, setReady] = useState(false);
	useEffect(() => {
		console.log('register')
		registerHotword(() => {
			triggerHotword();
		}, () => setReady(true));
	}, []);
	return <>
		<h1>Ada Assistant</h1>
		{ready && <h2>Ready!</h2>}
	</>;
}

export default Main;