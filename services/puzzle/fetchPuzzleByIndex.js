const { launch } = require("../../constants/puzzleConstants");
const formatDateString = require("../../utils/formatDateString");
const storeOrFetchPuzzle = require("./storeOrFetchPuzzle");

async function fetchPuzzleByIndex(index) {
	if (!Number.isInteger(index) || index < 1) {
		return new Error("Invalid puzzle index");
	}

	const requested = new Date(launch);
	requested.setDate(launch.getDate() + (index - 1));
	requested.setHours(0, 0, 0, 0);

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	if (requested > today) {
		throw new Error("Puzzle not available for that date");
	}

	const date = formatDateString(requested);
	return await storeOrFetchPuzzle(index, date);
}

module.exports = fetchPuzzleByIndex;
