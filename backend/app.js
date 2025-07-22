const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const generatePuzzle = require("./puzzle/generatePuzzle");

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

module.exports = app;
