'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let { puzzle, coordinate, value } = req.body
      //check for missing fields in the post request
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' })
      }
      //first check if the puzzle string is even a valid one
      let validation = solver.validate(puzzle)
      if (validation === 'invalid character') {
        return res.json({ error: 'Invalid characters in puzzle' })
      } else if (validation === 'invalid length') {
        return res.json({ error: 'Expected puzzle to be 81 characters long' })
      }
      //check if the coordinates are valid//
      let coordinateRegex = new RegExp(/^[A-I][1-9]$/)
      if (!coordinateRegex.test(coordinate)) { return res.json({ error: 'Invalid coordinate' }) }
      //split the A1 style coordinate into row and column
      coordinate.split('')
      //check if the value is valid//
      let valueRegex = new RegExp(/^[1-9]$/)
      if (!valueRegex.test(value)) { return res.json({ error: 'Invalid value' }) }
      //check if the value input is the same value already present in the puzzle at the same index
      if (solver.checkIdentical(puzzle, coordinate[0], coordinate[1], value) === true) {
        return res.json({ valid: true })
      }
      //checks if there are row, column or region conflicts
      let rowValid = solver.checkRowPlacement(puzzle, coordinate[0], coordinate[1], value)
      let colValid = solver.checkColPlacement(puzzle, coordinate[0], coordinate[1], value)
      let regionValid = solver.checkRegionPlacement(puzzle, coordinate[0], coordinate[1], value)
      if (rowValid === 'valid row placement' && colValid === 'valid column placement' && regionValid === 'valid region placement') {
        return res.json({ valid: true })
      } else {
        let conflictRay = []
        if (rowValid === 'row conflict') { conflictRay.push('row') }
        if (colValid === 'column conflict') { conflictRay.push('column') }
        if (regionValid === 'region conflict') { conflictRay.push('region') }
        return res.json({
          valid: false,
          conflict: conflictRay
        })
      }

    });

  app.route('/api/solve')
    .post((req, res) => {
      //if there is no puzzle provided
      if (!req.body.puzzle) {
        return res.json({ error: 'Required field missing' })
      } //get the puzzlestring from request
      let puzzleString = req.body.puzzle
      console.log(puzzleString)
      //validate the puzzlestring
      let validation = solver.validate(puzzleString)
      if (validation === 'valid') {
        //solve the puzzle and get return
        let response = solver.solve(puzzleString)
        if (response === 'Puzzle cannot be solved') {
          return res.json({ error: 'Puzzle cannot be solved' })
        } else {
          return res.json({ solution: response })
        }
      } else if (validation === 'invalid character') {
        res.json({ error: 'Invalid characters in puzzle' })
      } else if (validation === 'invalid length') {
        res.json({ error: 'Expected puzzle to be 81 characters long' })
      }
    });
};