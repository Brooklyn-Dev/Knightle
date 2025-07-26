const fetchTodayPuzzle = require("../services/puzzle/fetchTodayPuzzle");
const fetchPuzzleByIndex = require("../services/puzzle/fetchPuzzleByIndex");
const fetchPuzzleByDate = require("../services/puzzle/fetchPuzzleByDate");





exports.getTodayPuzzle = async (req, res) => {
	try {
		const puzzle = await fetchTodayPuzzle();
		res.json(puzzle);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch puzzle." });
	}
};

exports.getPuzzleByIndex = async (req, res) => {
	const index = parseInt(req.params.index);

	try {
		const puzzle = await fetchPuzzleByIndex(index);
		res.json(puzzle);
	} catch (err) {
		const statusCode = err.message.includes("available") ? 403 : 400;
		res.status(statusCode).json({ error: err.message });
	}
};

exports.getPuzzleByDate = async (req, res) => {
	try {
		const puzzle = await fetchPuzzleByDate(req.params.date);
		res.json(puzzle);
	} catch (err) {
		const statusCode = err.message.includes("available") ? 403 : 400;
		res.status(statusCode).json({ error: err.message });
	}
};
