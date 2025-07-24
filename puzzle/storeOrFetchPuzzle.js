const camelcaseKeys = require("camelcase-keys").default;

const { client } = require("../db");
const generatePuzzle = require("./generatePuzzle");
const formatDateString = require("./../utils/formatDateString");

async function storeOrFetchPuzzle(date, index) {
	const existing = await client.query("SELECT * FROM puzzles WHERE index = $1 OR date = $2", [index, date]);
	if (existing.rows.length > 0) {
		const puzzle = existing.rows[0];
		puzzle.date = formatDateString(puzzle.date);
		return camelcaseKeys(puzzle, { deep: true });
	}

	const puzzle = generatePuzzle(date);
	const title = `Knightle #${index}`;

	await client.query(
		`INSERT INTO puzzles (index, title, date, board_size, start, targets, least_moves)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		[index, title, date, puzzle.boardSize, puzzle.start, puzzle.targets, puzzle.leastMoves]
	);

	return camelcaseKeys({ title, date, ...puzzle }, { deep: true });
}

module.exports = storeOrFetchPuzzle;
