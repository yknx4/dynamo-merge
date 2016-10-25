const test = require('tape')
const merge = require('./index')

test('SET', t => {
    t.plan(1)

    t.equal(merge({x: 42}), 'SET x = 42')
})

test.skip('ADD', t => {
})

test('Combination', t => {
    t.plan(1)

    t.equal(
        merge({x: {y: [1, 2], z: 'x'}, q: 10}), 
        'SET x.z = "x", q = 10 ADD x.y 1, x.y 2'
    )
})