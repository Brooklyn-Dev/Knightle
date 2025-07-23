import { fetchDailyPuzzle } from "./api.js";

let boardSize = 6;
const boardEl = document.getElementById("chessboard");

let title = "Knightle";

// Game state
let knightPosition = [0, 0];
let targetPositions = [];
const visitedPositions = new Set();
let moveCount = 0;
let hasWon = false;

// Drag state
let isDragging = true;
let draggedKnight = null;
let dragOffset = [0, 0];
const highlightedSquares = [];

// Setup
function createBoard() {
	boardEl.innerHTML = "";
	boardEl.style.setProperty("--board-size", boardSize);

	for (let row = 0; row < boardSize; row++) {
		for (let col = 0; col < boardSize; col++) {
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
	if (hasWon) return;
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
			if (targetRow >= 0 && targetRow < boardSize && targetCol >= 0 && targetCol < boardSize) {
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
	const knight = oldSquare.querySelector(".knight");

	const newSquare = getSquareAt(newRow, newCol);
	newSquare.classList.add("visited");
	newSquare.appendChild(knight);

	knightPosition = [newRow, newCol];
	visitedPositions.add(`${newRow},${newCol}`);
	moveCount++;

	checkWinCondition();
}

function checkWinCondition() {
	const allVisited = targetPositions.every(([row, col]) => visitedPositions.has(`${row},${col}`));
	if (allVisited) {
		hasWon = true;
		setTimeout(() => alert(`You won in ${moveCount} moves! 🎉`), 200);
	}
}

// Init
async function init() {
	const puzzle = await fetchDailyPuzzle();

	const titleEl = document.getElementById("title");
	const headerEl = document.getElementById("header");
	titleEl.textContent = puzzle.title || "Knightle";
	headerEl.textContent = puzzle.title || "Knightle";

	knightPosition = puzzle.start;
	boardSize = puzzle.boardSize || 6;
	targetPositions = puzzle.targets;

	createBoard();
	placeKnightOnBoard();
	setupDragAndDropListeners();

	targetPositions.forEach(([row, col]) => {
		const targetSquare = getSquareAt(row, col);
		targetSquare.classList.add("target");
	});
}

init();
