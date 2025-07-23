const VERSION = "v1";

export async function fetchDailyPuzzle() {
	const res = await fetch(`/api/${VERSION}/puzzle/today`);
	if (!res.ok) {
		throw new Error("Failed to fetch today's puzzle.");
	}
	return await res.json();
}
