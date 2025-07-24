const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const app = require("./app");
const { connectDB } = require("./db");

process.on("uncaughtException", (err) => {
	console.log("💥 UNCAUGHT EXCEPTION! Shutting down...");
	console.log(`${err.name}: ${err.message}`);
	process.exit(1);
});

async function startServer() {
	try {
		await connectDB();

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
	} catch (err) {
		console.error("Failed to start server:", err);
		process.exit(1);
	}
}

startServer();
