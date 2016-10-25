const test = require('tape')
const merge = require('./index')

test('first', t => {
    t.plan(1)

    t.equal(merge({x: 42}), 'SET x = 42')
})