const camelcaseKeys = require("camelcase-keys").default;

const { findPuzzleByIndexOrDate, insertPuzzle } = require("../../models/puzzleModel");
const formatDateString = require("../../utils/formatDateString");
const generatePuzzle = require("./generatePuzzle");

async function storeOrFetchPuzzle(index, date) {
	const puzzle = await findPuzzleByIndexOrDate(index, date);
	if (puzzle) {
		puzzle.date = formatDateString(puzzle.date);
		return camelcaseKeys(puzzle, { deep: true });
	}

	const generated = generatePuzzle(date);
	const title = `Knightle #${index}`;

	await insertPuzzle({ index, title, date, ...generated });

	return camelcaseKeys({ index, title, date, ...generated }, { deep: true });
}

module.exports = storeOrFetchPuzzle;
