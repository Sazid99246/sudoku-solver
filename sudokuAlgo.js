var globalSudokuRay
var solution //global variable for the solution of hard sudoku

//visually represent puzzle string//
function consoleLogSudoku(sudokuArray){
    for(let i=0; i<sudokuArray.length; i+=9){
        //print spacer row after 3rd and 6th rows//
        if(i===27 || i===54){
            process.stdout.write("\n")
        }
        //print each row//
        for(let j=0; j<9; j++){
            process.stdout.write(sudokuArray[i+j] + "  ");
            //print spacer column whenever 3rd or 6th position reached (0index)
            if(j===2 || j===5){
                process.stdout.write("  ")
            }
        }
        //newline after each row//
        process.stdout.write("\n")
    }
    //double newline at the end to space out any following output later
    process.stdout.write("\n\n\n")
}
// consoleLogSudoku(sudokuArray)


//return all the values in this box, given any sudoku Array and index//
function getBoxValues(sudokuArray, index){
    //define the indexes of all 9 sudoku 'boxes'
    let boxTopLeft = [0,1,2,9,10,11,18,19,20]
    let boxTopMid = boxTopLeft.map(num => num+3)
    let boxTopRight = boxTopLeft.map(num => num+6)
    let boxMidLeft = boxTopLeft.map(num => num+27)
    let boxMidMid = boxTopLeft.map(num => num+30)
    let boxMidRight = boxTopLeft.map(num => num+33)
    let boxBottLeft = boxTopLeft.map(num => num+54)
    let boxBottMid = boxTopLeft.map(num => num+57)
    let boxBottRight = boxTopLeft.map(num => num+60)
    let boxRay = [boxTopLeft, boxTopMid, boxTopRight, boxMidLeft, boxMidMid, boxMidRight, boxBottLeft, boxBottMid, boxBottRight]

    //see to which box the index belongs
    let chosenBox
    //check each index of the box array.
    for(let i = 0; i < boxRay.length; i++) {
        //if the index (passed into the function) has a location inside this iteration's box array (not -1)
        if(boxRay[i].indexOf(index) !== -1) { 
            //then this is the box we were looking for.
            chosenBox = boxRay[i]
            break
        }
    }

    //push the numerical values in the box to result array
    let result = []
    for(let i=0; i<chosenBox.length; i++){
        result.push(sudokuArray[chosenBox[i]])
    }
    //console.log(result)
    return result
}
//getBoxValues(sudokuArray, 74)


//return all the values in this row, given any sudoku Array and index//
function getRowValues(sudokuArray, index){
    //define the indexes of all 9 sudoku 'rows'
    let rowOne = [0,1,2,3,4,5,6,7,8]
    let rowTwo = rowOne.map(num => num+9)
    let rowThree = rowOne.map(num => num+18)
    let rowFour = rowOne.map(num => num+27)
    let rowFive = rowOne.map(num => num+36)
    let rowSix = rowOne.map(num => num+45)
    let rowSeven = rowOne.map(num => num+54)
    let rowEight = rowOne.map(num => num+63)
    let rowNine = rowOne.map(num => num+72)
    let rowRay = [rowOne, rowTwo, rowThree, rowFour, rowFive, rowSix, rowSeven, rowEight, rowNine]

    //see to which row the index belongs
    let chosenRow
    //check each index of the box array.
    for(let i = 0; i < rowRay.length; i++) {
        //if the index (passed into the function) has a location inside this iteration's row array (not -1)
        if(rowRay[i].indexOf(index) !== -1) { 
            //then this is the row we were looking for.
            chosenRow = rowRay[i]
            break
        }
    }

    //push the numerical values in the row to result array
    let result = []
    for(let i=0; i<chosenRow.length; i++){
        result.push(sudokuArray[chosenRow[i]])
    }
    //console.log(result)
    return result
}
//getRowValues(sudokuArray, 74)


//return all the values in this column, given any sudoku Array and index//
function getColumnValues(sudokuArray, index){
    //define the indexes of all 9 sudoku 'columns'
    let columnOne = [0,9,18,27,36,45,54,63,72]
    let columnTwo = columnOne.map(num => num+1)
    let columnThree = columnOne.map(num => num+2)
    let columnFour = columnOne.map(num => num+3)
    let columnFive = columnOne.map(num => num+4)
    let columnSix = columnOne.map(num => num+5)
    let columnSeven = columnOne.map(num => num+6)
    let columnEight = columnOne.map(num => num+7)
    let columnNine = columnOne.map(num => num+8)
    let columnRay = [columnOne, columnTwo, columnThree, columnFour, columnFive, columnSix, columnSeven, columnEight, columnNine]

    //see to which column the index belongs
    let chosenColumn
    //check each index of the box array.
    for(let i = 0; i < columnRay.length; i++) {
        //if the index (passed into the function) has a location inside this iteration's column array (not -1)
        if(columnRay[i].indexOf(index) !== -1) { 
            //then this is the column we were looking for.
            chosenColumn = columnRay[i]
            break
        }
    }

    //push the numerical values in the column to result array
    let result = []
    for(let i=0; i<chosenColumn.length; i++){
        result.push(sudokuArray[chosenColumn[i]])
    }
    //console.log(result)
    return result
}
//getColumnValues(sudokuArray, 74)


//return array of possible values for any given index and sudokuArray//
function getPossibleValues(sudokuArray, index){
    //all these numbers are initially possible
    let possibleValues = ['1','2','3','4','5','6','7','8','9']
    //get all values in the box, row and column for this index
    let box = getBoxValues(sudokuArray, index)
    let row = getRowValues(sudokuArray, index)
    let column = getColumnValues(sudokuArray, index)

    //remove all values present in the box from possibilities
    for(let i = 0; i < possibleValues.length; i++) {
        //if this possible value exists in the box array (not index -1)
        if(box.indexOf(possibleValues[i]) !== -1){
            //splice this one entry from the possible values array
            possibleValues.splice(i, 1)
            //lower i by 1 because the possible array is now 1 shorter
            i--
        }
    }

    //remove all values present in the row from possibilities
    for(let i = 0; i < possibleValues.length; i++) {
        //if this possible value exists in the box array (not index -1)
        if(row.indexOf(possibleValues[i]) !== -1){
            //splice this one entry from the possible values array
            possibleValues.splice(i, 1)
            //lower i by 1 because the possible array is now 1 shorter
            i--
        }
    }

    //remove all values present in the column from possibilities
    for(let i = 0; i < possibleValues.length; i++) {
        //if this possible value exists in the box array (not index -1)
        if(column.indexOf(possibleValues[i]) !== -1){
            //splice this one entry from the possible values array
            possibleValues.splice(i, 1)
            //lower i by 1 because the possible array is now 1 shorter
            i--
        }
    }

    return possibleValues
}
//console.log(getPossibleValues(sudokuArray, 30))


//run one calculation cycle over the whole sudoku
function runOneCycle(sudokuArray){
    for(let i=0; i<sudokuArray.length; i++){
        //for each entry which is a dot (value yet to be determined)
        if(sudokuArray[i] === '.'){
            //get the possible values for current index
            let possibilities = getPossibleValues(sudokuArray, i)
            //if there is only one possible value
            if(possibilities.length === 1){
                //store it in the sudoku array.
                sudokuArray[i] = possibilities[0]
            }            
        }
    }
}


//run 10 cycles to see if this sudoku is solvable using our simple algorithm
function solveSimpleSudoku(sudokuString){
    //convert string to array
    let sudokuArray = sudokuString.split('')
    //run max 10 cycles
    for(let i = 0; i < 10; i++){
        if(sudokuArray.indexOf('.') !== -1){
            runOneCycle(sudokuArray)
        }
    }
    //on success (was only a simple sudoku to solve)
    if(sudokuArray.indexOf('.') === -1){
        consoleLogSudoku(sudokuArray)
        console.log('Done!')
        return sudokuArray
    } else {
        console.log('There is work left to do! --> continue to next step')
        globalSudokuRay = [...sudokuArray]
        solveSudokuV2()
        return solution
    }
}


function solveSudokuV2(){
    //loop over every index of the puzzle string
    for(var i = 0; i < globalSudokuRay.length; i++){
        //if we find a dot
        if(globalSudokuRay[i] === '.'){
            //open a new loop for each number 1-9 once per index
            //first define what is possible for this index
            let possibilities = getPossibleValues(globalSudokuRay, i)
            for(var j = 1; j < 10; j++) {
                //if it is possible to put in this particular number
                if(possibilities.indexOf(j.toString()) !== -1){
                    //try putting it in!
                    globalSudokuRay[i] = j.toString()
                    //consoleLogSudoku(globalSudokuRay) (if you log it will take too long, but you can see how it works)
                    //call solveSudokuV2() to find the next dot index to fill
                    solveSudokuV2()
                    //if we come back here and this code continues to run that means this j was not the solution
                    //turn it back into a dot and allow the loop to continue for j+1 j+2 j+3 etc, trying all.
                    globalSudokuRay[i] = '.'
                }
            }
            //if none of the options 1-9 worked, there must be a wrong choice in an instance lower down the call stack
            return //return to allow the lower instances to try their next possibilities for j
        }
    }
    //if this code is reached it means no more dots were found and we broke out the outer loop. We did it!
    console.log(globalSudokuRay)
    solution = [...globalSudokuRay] //unpack the solution into global variable (return won't work for some reason)

}


//solveSimpleSudoku('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..')
//solveSimpleSudoku('.7.5..3.1...3.1.7.36.2785.472.8.9.1.84.61...5613..58..9..4...36.57..6.8.136.8..57')
//solveSimpleSudoku('428.9.1..6..1.34..17.4286...468..73.859..1.4.73.2.6..998.5623175.23.7.843..984562')
//solveSimpleSudoku('8.735..2.35.....17.2..1...9....9526.7.5.6......4...7..5...3..4....64...8642..89..')

//this is the slightly hard one
// solveSimpleSudoku('.6.8.5..4..271.6......9358217.93.8....51...363..25.14...84..3.9..9.82.7..17.....8')

//this one WAS too hard for my algorithm
//solveSimpleSudoku('.....5.1.8..9..2..914....7..2.3....9..7.4.6.8...6........58...1..6....3.4........')
//try another hard puzzle to verify
//solveSimpleSudoku('.5.9..1....21..........8.4......4....2....5.96...3.8..4......16...7.6...7.6.8...5')
//yep works fine!


//fcc required sudoku (they are all simple ones)
// solveSimpleSudoku('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.')
// solveSimpleSudoku('5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3')
// solveSimpleSudoku('..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1')
// solveSimpleSudoku('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6')
// solveSimpleSudoku('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51')


module.exports = {solveSimpleSudoku, getBoxValues, getRowValues, getColumnValues}