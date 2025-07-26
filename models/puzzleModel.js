const { pool } = require("../db");

async function getPuzzlesCount() {
	const client = await pool.connect();
	try {
		const { rows } = await client.query("SELECT COUNT(*) FROM puzzles");
		return parseInt(rows[0].count);
	} finally {
		client.release();
	}
}

async function findAllPuzzles({ limit, offset, sort }) {
	const client = await pool.connect();
	try {
		const direction = sort.toUpperCase() === "ASC" ? "ASC" : "DESC";
		const { rows } = await client.query(
			`SELECT index, title, date, board_size, start, targets, least_moves FROM puzzles ORDER BY index ${direction} LIMIT $1 OFFSET $2`,
			[limit, offset]
		);
		return rows || null;
	} finally {
		client.release();
	}
}

async function findPuzzleByIndexOrDate(index, date) {
	const client = await pool.connect();
	try {
		const { rows } = await client.query(
			"SELECT index, title, date, board_size, start, targets, least_moves FROM puzzles WHERE index = $1 OR date = $2",
			[index, date]
		);
		return rows[0] || null;
	} finally {
		client.release();
	}
}

async function insertPuzzle(puzzle) {
	const { index, title, date, boardSize, start, targets, leastMoves } = puzzle;
	const client = await pool.connect();
	try {
		await client.query(
			`INSERT INTO puzzles (index, title, date, board_size, start, targets, least_moves)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
			[index, title, date, boardSize, start, targets, leastMoves]
		);
	} finally {
		client.release();
	}
}

module.exports = { getPuzzlesCount, findAllPuzzles, findPuzzleByIndexOrDate, insertPuzzle };
