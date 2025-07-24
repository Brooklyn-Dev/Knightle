const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const generatePuzzle = require("./puzzle/generatePuzzle");
const isValidDate = require("./utils/isValidDate");
const formatDateString = require("./utils/formatDateString");
const getDaysBetween = require("./utils/getDaysBetween");

const VERSION = "v1";

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(helmet());

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(express.json());

const launch = new Date("2025-07-23");
launch.setHours(0, 0, 0, 0);

app.get(`/api/${VERSION}/puzzle/today`, (req, res) => {
	const requested = new Date();
	requested.setHours(0, 0, 0, 0);

	const date = new Date().toISOString().slice(0, 10);
	const index = getDaysBetween(launch, requested) + 1;
	const puzzle = { id: index, title: `Knightle #${index}`, date, ...generatePuzzle(date) };
	res.json(puzzle);
});

app.get(`/api/${VERSION}/puzzle/:id`, (req, res) => {
	const id = parseInt(req.params.id);
	if (isNaN(id) || id < 1) {
		return res.status(400).json({ error: "Invalid puzzle id" });
	}

	const requested = new Date(launch);
	requested.setDate(launch.getDate() + (id - 1));
	requested.setHours(0, 0, 0, 0);

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	if (requested > today) {
		return res.status(403).json({ error: "Puzzle not available for that date" });
	}

	const date = requested.toISOString().slice(0, 10);
	const puzzle = { title: `Knightle #${id}`, date, ...generatePuzzle(date) };
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

	if (requested < launch || requested > today) {
		return res.status(403).json({ error: "Puzzle not available for that date" });
	}

	const date = formatDateString(requested);
	const index = getDaysBetween(launch, requested) + 1;
	const puzzle = { id: index, title: `Knightle #${index}`, date, ...generatePuzzle(date) };
	res.json(puzzle);
});

module.exports = app;
