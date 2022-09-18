const { solveSimpleSudoku, getBoxValues, getRowValues, getColumnValues } = require('../sudokuAlgo')

class SudokuSolver {

  validate(puzzleString) {
    //check for invalid characters
    let regex = new RegExp(/[^1-9.]/) //match all except 1 through 9 and dots
    if (regex.test(puzzleString)) {
      return 'invalid character'
    }
    //check for invalid length
    if (puzzleString.length !== 81) {
      return 'invalid length'
    }
    return 'valid'
  }

  checkIdentical(puzzleString, row, column, value) {
    let sudokuArray = puzzleString.split('') //get a Ray form
    //the base indexes for the rows
    const rowIndexes = { 'A': 0, 'B': 9, 'C': 18, 'D': 27, 'E': 36, 'F': 45, 'G': 54, 'H': 63, 'I': 72 }
    row = row.toUpperCase() //make sure we have caps to match above object
    //console.log(puzzleString, row, column, value)
    //get the index by adding base index of the row + the column number
    let index = rowIndexes[row] + Number(column) - 1 //-1 for zero indexing
    //get possibilities for this row
    if (sudokuArray[index] == value) {
      return true
    } else {
      return false
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let sudokuArray = puzzleString.split('') //get a Ray form
    //the base indexes for the rows
    const rowIndexes = { 'A': 0, 'B': 9, 'C': 18, 'D': 27, 'E': 36, 'F': 45, 'G': 54, 'H': 63, 'I': 72 }
    row = row.toUpperCase() //make sure we have caps to match above object
    //console.log(puzzleString, row, column, value)
    //get the index by adding base index of the row + the column number
    let index = rowIndexes[row] + Number(column) - 1 //-1 for zero indexing
    //get possibilities for this row
    let rowValues = getRowValues(sudokuArray, index)
    if (rowValues.indexOf(value) !== -1) {
      console.log('row conflict')
      return 'row conflict'
    } else {
      console.log('valid row placement')
      return 'valid row placement'
    }

  }

  checkColPlacement(puzzleString, row, column, value) {
    let sudokuArray = puzzleString.split('') //get a Ray form
    //the base indexes for the rows
    const rowIndexes = { 'A': 0, 'B': 9, 'C': 18, 'D': 27, 'E': 36, 'F': 45, 'G': 54, 'H': 63, 'I': 72 }
    row = row.toUpperCase() //make sure we have caps to match above object
    //console.log(puzzleString, row, column, value)
    //get the index by adding base index of the row + the column number
    let index = rowIndexes[row] + Number(column) - 1 //-1 for zero indexing
    //get possibilities for this row
    let columnValues = getColumnValues(sudokuArray, index)
    if (columnValues.indexOf(value) !== -1) {
      console.log('column conflict')
      return 'column conflict'
    } else {
      console.log('valid column placement')
      return 'valid column placement'
    }
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let sudokuArray = puzzleString.split('') //get a Ray form
    //the base indexes for the rows
    const rowIndexes = { 'A': 0, 'B': 9, 'C': 18, 'D': 27, 'E': 36, 'F': 45, 'G': 54, 'H': 63, 'I': 72 }
    row = row.toUpperCase() //make sure we have caps to match above object
    //console.log(puzzleString, row, column, value)
    //get the index by adding base index of the row + the column number
    let index = rowIndexes[row] + Number(column) - 1 //-1 for zero indexing
    //get possibilities for this row
    let boxValues = getBoxValues(sudokuArray, index)
    if (boxValues.indexOf(value) !== -1) {
      console.log('region conflict')
      return 'region conflict'
    } else {
      console.log('valid region placement')
      return 'valid region placement'
    }
  }

  solve(puzzleString) {
    let resultString = ''
    let result = solveSimpleSudoku(puzzleString)
    if (result === undefined) {
      return 'Puzzle cannot be solved'
    }
    for (let i = 0; i < result.length; i++) {
      resultString += result[i]
    }
    return this.validateSolution(puzzleString, resultString)
  }

  validateSolution(puzzleString, resultString) {
    //check if the initial puzzle string was valid by checking it against the solution.
    let puzzleRay = puzzleString.split('')
    let resultRay = resultString.split('')
    //loop over the original puzzle array
    for (let i = 0; i < puzzleRay.length; i++) {
      //if any index is neither identical to the solution nor a dot in the puzzlestring
      if (puzzleRay[i] !== resultRay[i] && puzzleRay[i] !== '.') {
        //puzzle has needed mutation to solve and therefor had an invalid structure
        return 'Puzzle cannot be solved'
      }
    }
    //if loop finished without a single conflict the solution is valid and can be returned
    return resultString
  }

}

module.exports = SudokuSolver;
