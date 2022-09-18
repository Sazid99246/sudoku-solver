const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    test('Logic handles a valid puzzle string of 81 characters', function () {
        assert.equal(solver.solve('.5.9..1....21..........8.4......4....2....5.96...3.8..4......16...7.6...7.6.8...5'),
            '358942167942167358167358942539824671824671539671539824483295716295716483716483295')
    })
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function () {
        assert.equal(solver.validate('.5.9..d.dd.21..f.......8.4..dd..4....2....5.96...3.8..4.sss..16...7.6...7.6.8...5'),
            `invalid character`)
    })
    test('Logic handles a puzzle string that is not 81 characters in length', function () {
        assert.equal(solver.validate('.5.9..1....21..........8.4......4....2....5.96...3.8..4......16...7.6...7.6.8...5..'),
            `invalid length`)
    })
    test('Logic handles a valid row placement', function () {
        assert.equal(solver.checkRowPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A', '1', '7'), 'valid row placement')
    })
    test('Logic handles an invalid row placement', function () {
        assert.equal(solver.checkRowPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A', '1', '9'), 'row conflict')
    })
    test('Logic handles a valid column placement', function () {
        assert.equal(solver.checkColPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A', '1', '7'), 'valid column placement')
    })
    test('Logic handles an invalid column placement', function () {
        assert.equal(solver.checkColPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A', '1', '6'), 'column conflict')
    })
    test('Logic handles a valid region (3x3 grid) placement', function () {
        assert.equal(solver.checkRegionPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A', '1', '7'), 'valid region placement')
    })
    test('Logic handles an invalid region (3x3 grid) placement', function () {
        assert.equal(solver.checkRegionPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A', '1', '5'), 'region conflict')
    })
    test('Valid puzzle strings pass the solver', function () {
        assert.equal(solver.solve('5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'),
            '568913724342687519197254386685479231219538467734162895926345178473891652851726943')
    })
    test('Invalid puzzle strings fail the solver', function () {
        assert.equal(solver.solve('5..99972.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'),
            'Puzzle cannot be solved')
    })
    test('Solver returns the expected solution for an incomplete puzzle', function () {
        assert.equal(solver.solve('82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'),
            '827549163531672894649831527496157382218396475753284916962415738185763249374928651')
    })
});
