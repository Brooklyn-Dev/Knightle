const seedrandom = require("seedrandom");

function getRNG(dateString) {
	return seedrandom(dateString);
}

function generatePuzzle(dateString) {
	const rng = getRNG(dateString);

	const boardSize = 6;
	const numTargets = 4 + Math.floor(rng() * 3); // 4-6 targets

	const startRow = Math.floor(rng() * boardSize);
	const startCol = Math.floor(rng() * boardSize);
	const start = [startRow, startCol];

	const targets = [];

	while (targets.length < numTargets) {
		const row = Math.floor(rng() * boardSize);
		const col = Math.floor(rng() * boardSize);

		if (row === startRow && col === startCol) continue;
		if (targets.some(([tRow, tCol]) => tRow === row && tCol === col)) continue;

		targets.push([row, col]);
	}

	return {
		boardSize,
		start,
		targets,
	};
}

module.exports = generatePuzzle;
