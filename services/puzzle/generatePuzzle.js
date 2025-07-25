const seedrandom = require("seedrandom");

function getRNG(dateString) {
	return seedrandom(dateString);
}

const BOARD_SIZE = 6;
const NUM_TARGETS = 6;

function generatePuzzle(dateString) {
	const rng = getRNG(dateString);

	const startRow = Math.floor(rng() * BOARD_SIZE);
	const startCol = Math.floor(rng() * BOARD_SIZE);
	const start = [startRow, startCol];

	const targets = [];

	while (targets.length < NUM_TARGETS) {
		const row = Math.floor(rng() * BOARD_SIZE);
		const col = Math.floor(rng() * BOARD_SIZE);

		if (row === startRow && col === startCol) continue;
		if (targets.some(([tRow, tCol]) => tRow === row && tCol === col)) continue;

		targets.push([row, col]);
	}

	return {
		boardSize: BOARD_SIZE,
		start,
		targets,
		leastMoves: findLeastMoves(BOARD_SIZE, start, targets),
	};
}

function findLeastMoves(boardSize, start, targets) {
	let minMoves = Infinity;

	// Brute-force all permutations
	const orderPermutations = getAllPermutations(targets);
	orderPermutations.forEach((perm) => {
		let position = start.slice();
		let totalMoves = 0;

		perm.forEach((target) => {
			const moves = findShortestPath(boardSize, position, target);
			totalMoves += moves;
			position = target;
		});

		minMoves = Math.min(minMoves, totalMoves);
	});

	return minMoves;
}

function getAllPermutations(arr) {
	if (arr.length === 1) return [arr];

	const perms = [];
	arr.forEach((el) => {
		const index = arr.indexOf(el);
		if (index !== -1) {
			const remaining = arr.filter((_, i) => i !== index);
			const subPerms = getAllPermutations(remaining);
			subPerms.forEach((subPerm) => {
				perms.push([el, ...subPerm]);
			});
		}
	});

	return perms;
}

function findShortestPath(boardSize, start, target) {
	const queue = [{ position: start, moves: 0 }];
	const visited = new Set();
	visited.add(`${start[0]},${start[1]}`);

	// prettier-ignore
	const knightMoves = [[2, -1], [2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2], [1, -2]];

	while (queue.length > 0) {
		const { position, moves } = queue.shift();

		if (position[0] === target[0] && position[1] === target[1]) {
			return moves;
		}

		for (const [rowDiff, colDiff] of knightMoves) {
			const newRow = position[0] + rowDiff;
			const newCol = position[1] + colDiff;
			const newPos = [newRow, newCol];
			const posKey = `${newRow},${newCol}`;

			if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize && !visited.has(posKey)) {
				visited.add(posKey);
				queue.push({ position: newPos, moves: moves + 1 });
			}
		}
	}

	return -1;
}

module.exports = generatePuzzle;
