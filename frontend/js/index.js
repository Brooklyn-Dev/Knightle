const BOARD_SIZE = 6;
const boardEl = document.getElementById("chessboard");

// Game state
let knightPosition = [0, 0];
let moveCount = 0;

// Drag state
let isDragging = true;
let draggedKnight = null;
let dragOffset = [0, 0];
const highlightedSquares = [];

// Setup
function createBoard() {
	boardEl.innerHTML = "";
	boardEl.style.setProperty("--board-size", BOARD_SIZE);

	for (let row = 0; row < BOARD_SIZE; row++) {
		for (let col = 0; col < BOARD_SIZE; col++) {
			const square = createSquareElement(row, col);
			boardEl.appendChild(square);
		}
	}
}

function placeKnightOnBoard() {
	const [row, col] = knightPosition;
	const square = getSquareAt(row, col);
	const knightEl = createKnightElement();
	square.appendChild(knightEl);
}

function setupDragAndDropListeners() {
	boardEl.addEventListener("mousedown", onMouseDown);
	boardEl.addEventListener("mousemove", onMouseMove);
	boardEl.addEventListener("mouseup", onMouseUp);
}

// DOM Helpers
function createSquareElement(row, col) {
	const square = document.createElement("div");
	const colour = (row + col) % 2 === 0 ? "light" : "dark";

	square.className = `square ${colour}`;
	square.dataset.row = row;
	square.dataset.col = col;

	return square;
}

function createKnightElement() {
	const knight = document.createElement("div");
	knight.className = "knight";
	knight.innerHTML = "♞";
	return knight;
}

function getSquareAt(row, col) {
	return document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

// Drag Handlers
function onMouseDown(e) {
	if (e.target.classList.contains("knight")) {
		isDragging = true;
		draggedKnight = e.target;

		const knightRect = e.target.getBoundingClientRect();
		dragOffset = [e.clientX - knightRect.left, e.clientY - knightRect.top];

		updateDraggedKnightPosition(e.clientX, e.clientY);
		e.target.classList.add("dragging");

		highlightValidMoves();

		e.preventDefault();
	}
}

function onMouseMove(e) {
	if (isDragging && draggedKnight) {
		updateDraggedKnightPosition(e.clientX, e.clientY);
	}
}

function onMouseUp(e) {
	if (isDragging && draggedKnight) {
		draggedKnight.style.left = "";
		draggedKnight.style.top = "";

		const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
		let targetSquare = elementBelow;

		if (!targetSquare?.classList.contains("square")) {
			targetSquare = elementBelow?.closest(".square");
		}

		if (targetSquare?.classList.contains("square")) {
			const newRow = parseInt(targetSquare.dataset.row);
			const newCol = parseInt(targetSquare.dataset.col);

			if (isValidKnightMove(newRow, newCol)) {
				moveKnightTo(newRow, newCol);
			}
		}
	}

	stopDraggingKnight();
	clearHighlightedSquares();
}

function updateDraggedKnightPosition(clientX, clientY) {
	draggedKnight.style.left = clientX - dragOffset[0] + "px";
	draggedKnight.style.top = clientY - dragOffset[1] + "px";
}

function stopDraggingKnight() {
	draggedKnight?.classList.remove("dragging");
	isDragging = false;
	draggedKnight = null;
}

function highlightValidMoves() {
	if (isDragging && draggedKnight) {
		// prettier-ignore
		const moves = [[2, -1], [2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2], [1, -2]];
		moves.forEach(([rowDiff, colDiff]) => {
			const targetRow = knightPosition[0] + rowDiff;
			const targetCol = knightPosition[1] + colDiff;
			if (targetRow >= 0 && targetRow < BOARD_SIZE && targetCol >= 0 && targetCol < BOARD_SIZE) {
				const targetSquare = getSquareAt(targetRow, targetCol);
				targetSquare.classList.add("valid");
				highlightedSquares.push(targetSquare);
			}
		});
	}
}

function clearHighlightedSquares() {
	highlightedSquares.forEach((square) => {
		square.classList.remove("valid");
	});
	highlightedSquares.length = 0;
}

// Game Logic
function isValidKnightMove(newRow, newCol) {
	const rowDiff = Math.abs(newRow - knightPosition[0]);
	const colDiff = Math.abs(newCol - knightPosition[1]);
	return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

function moveKnightTo(newRow, newCol) {
	const oldSquare = getSquareAt(...knightPosition);
	const newSquare = getSquareAt(newRow, newCol);
	const knight = oldSquare.querySelector(".knight");

	newSquare.appendChild(knight);
	knightPosition[0] = newRow;
	knightPosition[1] = newCol;
}

// Init
createBoard();
placeKnightOnBoard();
setupDragAndDropListeners();
