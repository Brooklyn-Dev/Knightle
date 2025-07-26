const camelcaseKeys = require("camelcase-keys").default;

const formatDateString = require("../../utils/formatDateString");
const { findAllPuzzles, getPuzzlesCount } = require("../../models/puzzleModel");

async function fetchAllPuzzles({ page = 1, limit = 20, sort = "asc" }) {
	const offset = (page - 1) * limit;

	const puzzles = await findAllPuzzles({ limit, offset, sort });
	for (const puzzle of puzzles) {
		puzzle.date = formatDateString(puzzle.date);
	}

	const totalCount = await getPuzzlesCount();
	const totalPages = Math.ceil(totalCount / limit);

	return {
		pagination: {
			page,
			limit,
			totalCount,
			totalPages,
			hasNextPage: page < totalPages,
			hasPrevPage: page > 1,
		},
		data: camelcaseKeys(puzzles, { deep: true }),
	};
}

module.exports = fetchAllPuzzles;
