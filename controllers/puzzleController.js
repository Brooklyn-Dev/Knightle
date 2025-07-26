const fetchAllPuzzles = require("../services/puzzle/fetchAllPuzzles");
const fetchTodayPuzzle = require("../services/puzzle/fetchTodayPuzzle");
const fetchPuzzleByIndex = require("../services/puzzle/fetchPuzzleByIndex");
const fetchPuzzleByDate = require("../services/puzzle/fetchPuzzleByDate");

exports.getAllPuzzles = async (req, res) => {
	if (req.query.page !== undefined) {
		const page = parseInt(req.query.page);
		if (isNaN(page) || page < 1) {
			return res.status(400).json({ error: "Invalid 'page' parameter. Must be a positive integer." });
		}
	}

	if (req.query.limit !== undefined) {
		const limit = parseInt(req.query.limit);
		if (isNaN(limit) || limit < 1 || limit > 100) {
			return res
				.status(400)
				.json({ error: "Invalid 'limit' parameter. Must be a positive integer and at most 100." });
		}
	}

	if (req.query.sort !== undefined) {
		const sort = req.query.sort?.toLowerCase();
		if (!["asc", "desc"].includes(sort)) {
			return res.status(400).json({ error: "Invalid 'sort' parameter. Must be 'asc' or 'desc'." });
		}
	}

	const page = req.query.page ? parseInt(req.query.page) : 1;
	const limit = req.query.limit ? parseInt(req.query.limit) : 20;
	const sort = req.query.sort ? req.query.sort.toLowerCase() : "asc";

	try {
		const puzzles = await fetchAllPuzzles({ page, limit, sort });
		res.json(puzzles);
	} catch (err) {
		res.status(500).json({ error: "Failed to fetch puzzle." });
	}
};

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
