const storeOrFetchPuzzle = require("../services/puzzle/storeOrFetchPuzzle");
const formatDateString = require("../utils/formatDateString");
const getDaysBetween = require("../utils/getDaysBetween");

const launch = new Date("2025-07-23");
launch.setHours(0, 0, 0, 0);

const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

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
		const puzzle = await storeOrFetchPuzzle(index, date);
		res.json(puzzle);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch puzzle." });
	}
};

exports.getPuzzleByDate = async (req, res) => {
	const { date } = req.params;
	if (!dateRegex.test(date)) {
		return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
	}

	const requested = new Date(date);
	if (isNaN(requested.getTime())) {
		return res.status(400).json({ error: "Invalid date." });
	}
	requested.setHours(0, 0, 0, 0);

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	if (requested < launch || requested > today) {
		return res.status(403).json({ error: "Puzzle not available for that date" });
	}

	const index = getDaysBetween(launch, requested) + 1;

	try {
		const puzzle = await storeOrFetchPuzzle(index, date);
		res.json(puzzle);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch puzzle." });
	}
};
