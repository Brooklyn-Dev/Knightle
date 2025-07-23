const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

process.on("uncaughtException", (err) => {
	console.log("💥 UNCAUGHT EXCEPTION! Shutting down...");
	console.log(`${err.name}: ${err.message}`);
	process.exit(1);
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log(`Knightle running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
	console.log("💥 UNHANDLED REJECTION! Shutting down...");
	console.log(`${err.name}: ${err.message}`);
	server.close(() => {
		process.exit(1);
	});
});
