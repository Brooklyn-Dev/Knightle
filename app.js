const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");

const storeOrFetchPuzzle = require("./puzzle/storeOrFetchPuzzle");
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

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 min
	max: 100,
	message: "Too many requests from this IP, please try again later.",
	standardHeaders: true,
	legacyHeaders: false,
});
app.use("/api", limiter);

app.use(express.json());

const launch = new Date("2025-07-23");
launch.setHours(0, 0, 0, 0);

app.get(`/api/${VERSION}/puzzle/today`, async (req, res) => {
	const requested = new Date();
	requested.setHours(0, 0, 0, 0);

	const date = formatDateString(requested);
	const index = getDaysBetween(launch, requested) + 1;

	try {
		const puzzle = await storeOrFetchPuzzle(date, index);
		res.json(puzzle);
	} catch (err) {
		console.error("Error in /puzzle/today:", err); // ✅ Logs helpful debug info

		res.status(500).json({ error: "Failed to fetch puzzle." });
	}
});

app.get(`/api/${VERSION}/puzzle/:index`, async (req, res) => {
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
});

app.get(`/api/${VERSION}/puzzle`, async (req, res) => {
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
});

module.exports = app;
