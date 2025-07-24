function getDaysBetween(start, end) {
	const diffTime = end.getTime() - start.getTime();
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	return diffDays;
}

module.exports = getDaysBetween;
