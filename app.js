const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");

const puzzleRoutes = require("./routes/puzzleRoutes.js");

const VERSION = "v1";

const app = express();
app.set("trust proxy", 1);

// MIDDLEWARES
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

// ROUTES
app.use(`/api/${VERSION}/puzzles`, puzzleRoutes);

module.exports = app;
