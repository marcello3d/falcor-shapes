var describe = require('mocha').describe
var it = require('mocha').it
var assert = require('assert')

var shapeToPathSets = require('../index')

describe('flat structures', function () {
  it('handles empty shape', function () {
    assert.deepEqual(
      [],
      shapeToPathSets({})
    )
  })
  it('handles one key shape', function () {
    assert.deepEqual(
      [
        [ 'name' ]
      ],
      shapeToPathSets({
        name: true
      })
    )
  })
  it('handles multiple keys shape', function () {
    assert.deepEqual(
      [
        [ 'name' ],
        [ 'age' ],
        [ 'provider' ]
      ],
      shapeToPathSets({
        name: true,
        age: true,
        provider: true
      })
    )
  })
})

describe('nested structures', function () {
  it('handles one key nested', function () {
    assert.deepEqual(
      [
        [ 'name', 'first' ],
        [ 'name', 'last' ]
      ],
      shapeToPathSets({
        name: {
          first: true,
          last: true
        }
      })
    )
  })
  it('handles multiple keys nested', function () {
    assert.deepEqual(
      [
        [ 'name', 'first' ],
        [ 'name', 'last' ],
        [ 'location', 'city' ],
        [ 'location', 'region' ],
        [ 'location', 'country' ]
      ],
      shapeToPathSets({
        name: {
          first: true,
          last: true
        },
        location: {
          city: true,
          region: true,
          country: true
        }
      })
    )
  })
  it('handles three levels nested', function () {
    assert.deepEqual(
      [
        [ 'name', 'first' ],
        [ 'name', 'last' ],
        [ 'mother', 'name', 'first' ],
        [ 'mother', 'name', 'last' ],
        [ 'mother', 'age' ],
        [ 'mother', 'location', 'city' ],
        [ 'mother', 'location', 'region' ],
        [ 'mother', 'location', 'country' ],
        [ 'location', 'city' ],
        [ 'location', 'region' ],
        [ 'location', 'country' ]
      ],
      shapeToPathSets({
        name: {
          first: true,
          last: true
        },
        mother: {
          name: {
            first: true,
            last: true
          },
          age: true,
          location: {
            city: true,
            region: true,
            country: true
          }
        },
        location: {
          city: true,
          region: true,
          country: true
        }
      })
    )
  })
})

describe('range structures', function () {
  it('handles simple range shape', function () {
    assert.deepEqual(
      [
        [ { from: 0, to: 100 }, 'name' ]
      ],
      shapeToPathSets({
        $: [
          { from: 0, to: 100 },
          {
            name: true
          }
        ]
      })
    )
  })
  it('handles simple number list shape', function () {
    assert.deepEqual(
      [
        [ [0, 1, 2, 3], 'name' ]
      ],
      shapeToPathSets({
        $: [
          [0, 1, 2, 3],
          {
            name: true
          }
        ]
      })
    )
  })
  it('handles mixed range shape', function () {
    assert.deepEqual(
      [
        [ 'people', 'length' ],
        [ 'people', { from: 0, to: 100 }, 'name' ]
      ],
      shapeToPathSets({
        people: {
          length: true,
          $: [
            {from: 0, to: 100},
            {
              name: true
            }
          ]
        }
      })
    )
  })
  it('handles complex range shape', function () {
    assert.deepEqual(
      [
        [ 'people', 'length' ],
        [ 'people', { from: 0, to: 100 }, 'name', 'first' ],
        [ 'people', { from: 0, to: 100 }, 'name', 'last' ],
        [ 'people', { from: 0, to: 100 }, 'age' ]
      ],
      shapeToPathSets({
        people: {
          length: true,
          $: [
            {from: 0, to: 100},
            {
              name: {
                first: true,
                last: true
              },
              age: true
            }
          ]
        }
      })
    )
  })
  it('handles nested range shape', function () {
    assert.deepEqual(
      [
        [ 'people', 'length' ],
        [ 'people', { from: 0, to: 100 }, 'name', 'first' ],
        [ 'people', { from: 0, to: 100 }, 'name', 'last' ],
        [ 'people', { from: 0, to: 100 }, 'friends', { from: 0, to: 50 }, 'name' ]
      ],
      shapeToPathSets({
        people: {
          length: true,
          $: [
            {from: 0, to: 100},
            {
              name: {
                first: true,
                last: true
              },
              friends: {
                $: [
                  { from: 0, to: 50 },
                  {
                    name: true
                  }
                ]
              }
            }
          ]
        }
      })
    )
  })
})
