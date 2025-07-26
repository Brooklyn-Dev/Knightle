const VERSION = "v1";

export async function fetchDailyPuzzle() {
	const res = await fetch(`/api/${VERSION}/puzzles/today`);

	if (res.status === 429) {
		throw new Error("Too many requests. Please slow down!");
	}

	if (!res.ok) {
		throw new Error("Failed to fetch today's puzzle.");
	}

	return await res.json();
}
