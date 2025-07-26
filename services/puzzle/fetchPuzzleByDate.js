const { launch } = require("../../constants/puzzleConstants");
const getDaysBetween = require("../../utils/getDaysBetween");
const isValidDate = require("../../utils/isValidDate");
const storeOrFetchPuzzle = require("./storeOrFetchPuzzle");

async function fetchPuzzleByDate(date) {
	if (!isValidDate(date)) {
		throw new Error("Invalid date.");
	}

	const requested = new Date(date);
	requested.setHours(0, 0, 0, 0);

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	if (requested < launch || requested > today) {
		throw new Error("Puzzle not available for that date");
	}

	const index = getDaysBetween(launch, requested) + 1;

	return await storeOrFetchPuzzle(index, date);
}

module.exports = fetchPuzzleByDate;
