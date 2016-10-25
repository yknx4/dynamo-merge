const test = require('tape')
const merge = require('./index')

test('SET', t => {
    t.plan(2)

    t.deepEqual(
        merge({x: 42}), 
        {UpdateExpression: 'SET x = 42'}
    )
    t.deepEqual(
        merge({x: {y: "foo", z: {w: 42}}, q: 0}),
        {UpdateExpression: 'SET x.y = "foo", x.z.w = 42, q = 0'}
    )
})

test.skip('Combination', t => {
    t.plan(1)

    t.deepEqual(
        merge({x: {y: [1, 2], z: 'x'}, q: 10}), 
        {UpdateExpression: 'SET x.z = "x", q = 10 ADD x.y 1, x.y 2'}
    )
})