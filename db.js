const pg = require("pg");

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

async function connectDB() {
	await client.connect();
	await client.query(`
        CREATE TABLE IF NOT EXISTS puzzles (
            id SERIAL PRIMARY KEY,
            index INTEGER UNIQUE NOT NULL,
            title TEXT,
            date DATE UNIQUE,
            board_size INTEGER NOT NULL,
            start INTEGER[] NOT NULL,
            targets INTEGER[][] NOT NULL,
            least_moves INTEGER NOT NULL
        );
    `);

	console.log("Knightle DB setup successful.");
}

module.exports = { client, connectDB };
