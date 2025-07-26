const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

function isValidDate(dateStr) {
	if (!dateRegex.test(dateStr)) {
		return false;
	}

	const [year, month, day] = dateStr.split("-").map(Number);
	const date = new Date(dateStr);

	return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

module.exports = isValidDate;
