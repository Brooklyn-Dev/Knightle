const camelcaseKeys = require("camelcase-keys").default;

const generatePuzzle = require("./generatePuzzle");
const { findPuzzleByIndexOrDate, insertPuzzle } = require("../../models/puzzleModel");
const formatDateString = require("../../utils/formatDateString");

async function storeOrFetchPuzzle(index, date) {
	let puzzle = await findPuzzleByIndexOrDate(index, date);

	if (puzzle) {
		puzzle.date = formatDateString(puzzle.date);
		const { id, ...rest } = puzzle;
		return camelcaseKeys(rest, { deep: true });
	}

	const generated = generatePuzzle(date);
	const title = `Knightle #${index}`;

	await insertPuzzle({ index, title, date, ...generated });

	return camelcaseKeys({ index, title, date, ...generated }, { deep: true });
}

module.exports = storeOrFetchPuzzle;
