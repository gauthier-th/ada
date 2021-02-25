import React from 'react';
// import SquareBackground from '../SquareBackground';
import HolographicProjection from '../HolographicProjection';

const Home = ({ ready }) => {
	return <>
		{/* <SquareBackground /> */}
		<HolographicProjection />
		<div className="d-flex flex-column justify-content-end align-items-center" style={{ height: 'calc(100vh - 22px)' }}>
			<div className="text-center">
				<h1>Ada Assistant</h1>
			</div>
		</div>
	</>
};

export default Home;