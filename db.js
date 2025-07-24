const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function connectDB() {
	const client = await pool.connect();
	try {
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
	} finally {
		client.release();
	}
}

module.exports = { pool, connectDB };
