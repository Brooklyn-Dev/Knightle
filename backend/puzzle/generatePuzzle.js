const seedrandom = require("seedrandom");

function getRNG(dateString) {
	return seedrandom(dateString);
}

function generatePuzzle(dateString) {
	const rng = getRNG(dateString);

	const boardSize = 6;
	const numTargets = 3 + Math.floor(rng() * 3); // 3-5 targets

	const startX = Math.floor(rng() * boardSize);
	const startY = Math.floor(rng() * boardSize);
	const start = [startX, startY];

	const targets = [];

	while (targets.length < numTargets) {
		const x = Math.floor(rng() * boardSize);
		const y = Math.floor(rng() * boardSize);

		if (x === startX && y === startY) continue;
		if (targets.some(([tx, ty]) => tx === x && ty === y)) continue;

		targets.push([x, y]);
	}

	return {
		boardSize,
		start,
		targets,
	};
}

module.exports = generatePuzzle;
