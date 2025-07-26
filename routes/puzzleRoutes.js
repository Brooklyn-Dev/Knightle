const express = require("express");
const router = express.Router();
const puzzleController = require("./../controllers/puzzleController");

router.get("/today", puzzleController.getTodayPuzzle);
router.get("/:index", puzzleController.getPuzzleByIndex);
router.get("/date/:date", puzzleController.getPuzzleByDate);

module.exports = router;
