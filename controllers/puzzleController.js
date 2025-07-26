const storeOrFetchPuzzle = require("../puzzle/storeOrFetchPuzzle");
const isValidDate = require("../utils/isValidDate");
const formatDateString = require("../utils/formatDateString");
const getDaysBetween = require("../utils/getDaysBetween");

const launch = new Date("2025-07-23");
launch.setHours(0, 0, 0, 0);

exports.getTodayPuzzle = async (req, res) => {
	try {
		const requested = new Date();
		requested.setHours(0, 0, 0, 0);

		const date = formatDateString(requested);
		const index = getDaysBetween(launch, requested) + 1;

		const puzzle = await storeOrFetchPuzzle(date, index);
		res.json(puzzle);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch puzzle." });
	}
};

exports.getPuzzleByIndex = async (req, res) => {
	const index = parseInt(req.params.index);
	if (isNaN(index) || index < 1) {
		return res.status(400).json({ error: "Invalid puzzle index" });
	}

	const requested = new Date(launch);
	requested.setDate(launch.getDate() + (index - 1));
	requested.setHours(0, 0, 0, 0);

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	if (requested > today) {
		return res.status(403).json({ error: "Puzzle not available for that date" });
	}

	const date = formatDateString(requested);

	try {
		const puzzle = await storeOrFetchPuzzle(date, index);
		res.json(puzzle);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch puzzle." });
	}
};

exports.getPuzzleByDate = async (req, res) => {
	const { year, month, day } = req.query;
	if (!year || !month || !day) {
		return res.status(400).json({ error: "Missing date parameters" });
	}

	const yyyy = parseInt(year);
	const mm = parseInt(month);
	const dd = parseInt(day);

	if (isNaN(yyyy) || isNaN(mm) || isNaN(dd) || !isValidDate(yyyy, mm, dd)) {
		return res.status(400).json({ error: "Invalid date values" });
	}

	const requested = new Date(yyyy, mm - 1, dd);
	requested.setHours(0, 0, 0, 0);

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	if (requested < launch || requested > today) {
		return res.status(403).json({ error: "Puzzle not available for that date" });
	}

	const date = formatDateString(requested);
	const index = getDaysBetween(launch, requested) + 1;

	try {
		const puzzle = await storeOrFetchPuzzle(date, index);
		res.json(puzzle);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch puzzle." });
	}
};
