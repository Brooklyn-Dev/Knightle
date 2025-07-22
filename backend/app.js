const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const generatePuzzle = require("./puzzle/generatePuzzle");
const isValidDate = require("./utils/isValidDate");
const formatDateString = require("./utils/formatDateString");

const VERSION = "v1";

const app = express();

app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(express.json());

app.get(`/api/${VERSION}/puzzle/today`, (req, res) => {
	const date = new Date().toISOString().slice(0, 10);
	const puzzle = { title: `Knightle for ${date}`, date, ...generatePuzzle(date) };
	res.json(puzzle);
});

app.get(`/api/${VERSION}/puzzle`, (req, res) => {
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

	const launch = new Date("2025-07-23");
	launch.setHours(0, 0, 0, 0);

	if (requested < launch || requested > today) {
		return res.status(403).json({ error: "Puzzle not available for that date" });
	}

	const dateString = formatDateString(requested);
	const puzzle = { title: `Knightle for ${dateString}`, dateString, ...generatePuzzle(dateString) };
	res.json(puzzle);
});

module.exports = app;
