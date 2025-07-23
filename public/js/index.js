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
	// Image source: https://commons.wikimedia.org/wiki/File:Chess_nlt45.svg
	knight.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 45 45" preserveAspectRatio="xMidYMid meet">
  <g style="opacity:1; fill:none; fill-opacity:1; fill-rule:evenodd; stroke:#000000; stroke-width:1.5; stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4; stroke-dasharray:none; stroke-opacity:1;" transform="translate(0,0.3)">
    <path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" style="fill:#ffffff; stroke:#000000;"/>
    <path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" style="fill:#ffffff; stroke:#000000;"/>
    <path d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z" style="fill:#000000; stroke:#000000;"/>
    <path d="M 15 15.5 A 0.5 1.5 0 1 1  14,15.5 A 0.5 1.5 0 1 1  15 15.5 z" transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)" style="fill:#000000; stroke:#000000;"/>
  </g>
</svg>`;
	return knight;
}

function getSquareAt(row, col) {
	return document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

function getKnightEl() {
	return getSquareAt(...knightPosition).querySelector(".knight");
}

// Drag Handlers
function onMouseDown(e) {
	if (hasWon) return;

	const knightEl = e.target.closest(".knight");
	if (knightEl) {
		isDragging = true;
		draggedKnight = knightEl;

		const knightRect = knightEl.getBoundingClientRect();
		dragOffset = [e.clientX - knightRect.left, e.clientY - knightRect.top];

		updateDraggedKnightPosition(e.clientX, e.clientY);
		knightEl.classList.add("dragging");

		knightEl.style.width = knightRect.width + "px";
		knightEl.style.height = knightRect.height + "px";

		highlightValidMoves();

		e.preventDefault();
	}
}

function onMouseMove(e) {
	if (!isDragging || !draggedKnight || hasWon) return;

	updateDraggedKnightPosition(e.clientX, e.clientY);
}

function onMouseUp(e) {
	if (!isDragging || !draggedKnight || hasWon) return;

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

	stopDraggingKnight();
	clearHighlightedSquares();
}

function updateDraggedKnightPosition(clientX, clientY) {
	draggedKnight.style.left = clientX - dragOffset[0] + "px";
	draggedKnight.style.top = clientY - dragOffset[1] + "px";
}

function stopDraggingKnight() {
	if (draggedKnight) {
		draggedKnight.style.width = "";
		draggedKnight.style.height = "";
		draggedKnight.classList.remove("dragging");
	}
	draggedKnight = null;
	isDragging = false;
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
	const knightEl = getKnightEl();

	const newSquare = getSquareAt(newRow, newCol);
	newSquare.classList.add("visited");
	newSquare.appendChild(knightEl);

	knightPosition = [newRow, newCol];
	visitedPositions.add(`${newRow},${newCol}`);
	moveCount++;

	checkWinCondition();
}

function checkWinCondition() {
	const allVisited = targetPositions.every(([row, col]) => visitedPositions.has(`${row},${col}`));
	if (allVisited) {
		hasWon = true;
		const knightEl = getKnightEl();
		knightEl.classList.add("game-over");
		setTimeout(() => alert(`You won in ${moveCount} moves! 🎉`), 100);
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
