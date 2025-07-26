const { launch } = require("../../constants/puzzleConstants");
const formatDateString = require("../../utils/formatDateString");
const getDaysBetween = require("../../utils/getDaysBetween");
const storeOrFetchPuzzle = require("./storeOrFetchPuzzle");

async function fetchTodayPuzzle() {
	const requested = new Date();
	requested.setHours(0, 0, 0, 0);

	const index = getDaysBetween(launch, requested) + 1;
	const date = formatDateString(requested);

	return await storeOrFetchPuzzle(index, date);
}

module.exports = fetchTodayPuzzle;
