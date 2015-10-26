# falcor-shapes [![Build Status](https://travis-ci.org/marcello3d/falcor-shapes.svg)](https://travis-ci.org/marcello3d/falcor-shapes)

falcor-shapes is a convenience function for generating [Falcor](http://netflix.github.io/falcor/) 
[PathSets](http://netflix.github.io/falcor/documentation/paths.html).

It converts a "Shape" into an array of Falcor PathSets.

For example: 
```js
{
  name: {
    first: true,
    last: true
  },
  location: {
    city: true,
    region: true,
    country: true
  }
}
```

becomes

```js
[
  [ 'name', 'first' ],
  [ 'name', 'last' ],
  [ 'location', 'city' ],
  [ 'location', 'region' ],
  [ 'location', 'country' ]
]
```

## Install

```
npm install falcor-shapes
```

## Background

I built this function while playing around with falcor for the first time a few days ago. I found it easier to think of
data in terms of a hierarchical structure rather than a list of string paths.

It also allows you to split up the list of what fields you need across multiple files (similar to GraphQL/Relay in React).

## What is a "Shape"?

A shape is a recursive structure that resembles the JavaScript structure you're expecting. Shapes are simply JavaScript 
objects with keys and values. If a value is a nested JavaScript object, it will be expanded into multiple PathSets. If value is a function, its result is used as the value.

* `{ <key>: true }` is a leaf value, and becomes the path `[ '<key>' ]`
* `{ <key>: <Shape> }` recurses 
* `{ <key>: <Function> }` recurses on the result of `<Function>`
* `$` is a special key that expects an array: `{ $: [ <range>, <Shape> ] }` and becomes `[ <range>, <Shape> ]`

Example:

```js
{
  people: {
    length: true,
    $: [
      {from: 0, to: 100},
      {
        name: {
          first: true,
          last: function () {
            return true
          }
        },
        age: true
      }
    ]
  }
}
```

becomes:

```js
[ 'people', 'length' ],
[ 'people', { from: 0, to: 100 }, 'name', 'first' ],
[ 'people', { from: 0, to: 100 }, 'name', 'last' ],
[ 'people', { from: 0, to: 100 }, 'age' ]
```

See more examples in [test/test.js](test/test.js).

## Usage

```js
var shapeToSet = require('falcor-shapes')

var sets = shapeToSet({
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

// falcor's model.get expects each path as separate arguments, so we need to call 'apply'
model.get.apply(model, sets).then( ... )
```

We can make a helper function to simplify this:

```js
function getWithShape(shape) {
  return model.get.apply(model, shape)
}

getWithShape({
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
}).then( ... )
```

### Resolving functions

When the value is a function, its result will be used to resolve the shape.
`falcor-shapes` accepts an optional second parameter; a resolution function called with `(<resolvable>, <shape>, <key>)`, where;

* `resolvable` is the function specified in the shape
* `shape` is the shape it is part of
* `key` the function's key in the shape

```js
var shapeToSet = require('falcor-shapes')

var sets = shapeToSet(
  {
    name: function () {
      return {
        first: true,
        last: true
      }
    }
  },
  function(resolvable, shape, key) {
    return resolvable()
  }
)

model.get.apply(model, sets).then( ... )
```

A more complex example:

```js
var shapeToSet = require('falcor-shapes')

var includeFirstName = true

var sets = shapeToSet(
  {
    name: function (withFirstName) {
      if (withFirstName) {
        return {
          first: true,
          last: true
        }
      } else {
        return {
          last: true
        }
      }
    }
  },
  function(resolvable, shape, key) {
    if (key === 'name') {
      return resolvable(includeFirstName)
    } else {
      return resolvable()
    }
  }
)

model.get.apply(model, sets).then( ... )
```

## Development and Test

```
# Clone the repo
git clone git@github.com:marcello3d/falcor-shapes.git

# Install dependencies
npm install

# Run tests
npm test
```

## Contributing

Feel free to submit pull requests!

## License

zlib