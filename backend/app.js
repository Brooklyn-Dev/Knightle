const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const VERSION = "v1";

const app = express();

app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

app.use(express.json());

app.get(`/api/${VERSION}/puzzle`, (req, res) => {
	const date = req.query.date || new Date().toISOString().slice(0, 10);
	const puzzle = { title: "Test Puzzle", date };
	res.json(puzzle);
});

module.exports = app;
