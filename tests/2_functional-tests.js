const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.' })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.equal(res.body.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378')
                done()
            })
    })

    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
        chai.request(server)
            .post('/api/solve')
            .send({})
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.equal(res.body.error, 'Required field missing')
                done()
            })
    })

    test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: '.5.9..d.dd.21..f.......8.4..dd..4....2....5.96...3.8..4.sss..16...7.6...7.6.8...5' })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.equal(res.body.error, 'Invalid characters in puzzle')
                done()
            })
    })

    test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: '.5.9..1....21..........8.4......4....2....5.96...3.8..4......16...7.6...7.6.8...5..' })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
                done()
            })
    })

    test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
        chai.request(server)
            .post('/api/solve')
            .send({ puzzle: '5..99972.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3' })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.equal(res.body.error, 'Puzzle cannot be solved')
                done()
            })
    })

    test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: '7'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.equal(res.body.valid, true)
                done()
            })
    })

    test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: '6'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.equal(res.body.valid, false)
                assert.equal(res.body.conflict[0], "column")
                done()
            })
    })

    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: '1'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.equal(res.body.valid, false)
                assert.equal(res.body.conflict[0], "row")
                assert.equal(res.body.conflict[1], "column")
                done()
            })
    })

    test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: '5'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.equal(res.body.valid, false)
                assert.equal(res.body.conflict[0], "row")
                assert.equal(res.body.conflict[1], "column")
                assert.equal(res.body.conflict[2], "region")
                done()
            })
    })

    test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                value: '5'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.equal(res.body.error, 'Required field(s) missing')
                done()
            })
    })

    test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4.q..2432QQQQQ.1...69.83.9.qq..6.62.71.qqq......1qqqq...4.37.4.3..6..',
                coordinate: 'A1',
                value: '5'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.equal(res.body.error, 'Invalid characters in puzzle')
                done()
            })
    })

    test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432................1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: '5'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
                done()
            })
    })

    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'Q1',
                value: '5'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.equal(res.body.error, 'Invalid coordinate')
                done()
            })
    })

    test('Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
        chai.request(server)
            .post('/api/check')
            .send({
                puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
                coordinate: 'A1',
                value: '15'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200)
                assert.equal(res.body.error, 'Invalid value')
                done()
            })
    })



});
