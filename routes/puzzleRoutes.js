const express = require("express");
const router = express.Router();
const puzzleController = require("./../controllers/puzzleController");

router.get("/today", puzzleController.getTodayPuzzle);
router.get("/:index", puzzleController.getPuzzleByIndex);
router.get("/", puzzleController.getPuzzleByDate);

module.exports = router;
