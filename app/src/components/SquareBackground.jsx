import React, { useEffect, useRef } from 'react';

const SquareBackground = (props) => {
	const canvasRef = useRef(null);

	let squareCount = { x: 0, y: 0 };
	const squareSize = { width: 15, height: 15 };
	let squares = [];
	let randomSquares = [];
	let lastRender = Date.now() + 1000;

	const render = (ctx, canvas) => {
		if (lastRender + 100 > Date.now())
			return requestAnimationFrame(() => render(ctx, canvas));
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		randomSquares = randomSquares.filter(s => s.removesIn > Date.now());
	
		const factor = Math.round(squareCount.x * squareCount.y / Math.pow(squareCount.x * squareCount.y, 0.25) / 100);
		for (let i = 0; i < factor * 2; i++) {
			const [x, y] = randomSquare(randomSquares, squareCount.x - 1, squareCount.y - 1);
			const removesIn = Date.now() + Random(200, 600);
			randomSquares.push(
			{ pos: [x, y], removesIn },
			{ pos: [x+1, y], removesIn },
			{ pos: [x, y+1], removesIn },
			{ pos: [x+1, y+1], removesIn }
			);
		}
		for (let i = 0; i < factor * 15; i++) {
			const [x, y] = randomSquare(randomSquares, squareCount.x, squareCount.y);
			const removesIn = Date.now() + Random(200, 600);
			randomSquares.push({ pos: [x, y], removesIn });
		}
	
		for (let i = 0; i < squareCount.x; i++) {
			for (let j = 0; j < squareCount.y; j++) {
			if (randomSquares.some(s => s.pos[0] === i && s.pos[1] === j))
				ctx.fillStyle = squares[i][j];
			else
				ctx.fillStyle = '#141F2C';
			ctx.fillRect(i*(squareSize.width + 1), j*(squareSize.height + 1), squareSize.width, squareSize.height);
			}
		}
		requestAnimationFrame(() => render(ctx, canvas));
	}

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			squareCount = {
				x: Math.ceil(window.innerWidth / (squareSize.width + 1)),
				y: Math.ceil(window.innerHeight / (squareSize.height + 1))
			};
			squares = genSquares(squareCount);
		};

		resize();
		render(ctx, canvas);

		window.addEventListener('resize', resize);
		return () => {
			window.removeEventListener('resize', resize);
		};
	}, []);
	return <div style={{ position: 'fixed', top: 0, left: 0, opacity: 0.5, zIndex: -1 }}>
		<canvas ref={canvasRef} />
	</div>;
};


function genSquares(squareCount) {
	const result = [];
	for (let i = 0; i < squareCount.x; i++) {
		const a = [];
		for (let j = 0; j < squareCount.y; j++) {
		const r = Random(0, 10);
		if (r === 0)
			a.push(`hsl(${Random(210, 220)}deg, ${RandomItem(51, 51, 51, 51, 51, 61)}%, ${Random(25, 30)}%)`);
		else
			a.push(`hsl(${Random(210, 220)}deg, ${RandomItem(51, 61)}%, ${Random(15, 20)}%)`);
		}
		result.push(a);
	}
	return result;
}

function randomSquare(randomSquares, maxX = squareCount.x, maxY = squareCount.y) {
	const x = Random(0, maxX);
	const y = Random(0, maxY);
	if (randomSquares.some(s => s[0] === x && s[1] === y))
		return randomSquare(randomSquares, maxX, maxY);
	else
		return [x, y];
}

function Random(min, max) {
	return Math.floor(min + Math.random() * Math.floor(max - min + 1));
}
function RandomItem(...items) {
	return items[Random(0, items.length - 1)];
}

export default SquareBackground;