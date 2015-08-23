# falcor-shapes

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
objects with keys and values. If a value is a nested JavaScript object, it will be expanded into multiple PathSets. 

* `{ <key>: true }` is a leaf value, and becomes the path `[ '<key>' ]`
* `{ <key>: <Shape> }` recurses 
* `$` is a special key that expects an array: `{ $: [ <range>, <Shape> ] }` and becomes `[ <range>, <Shape> ]`

Examples:

```js
{
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
}
```

becomes:

```js
[ 'people', 'length' ],
[ 'people', { from: 0, to: 100 }, 'name', 'first' ],
[ 'people', { from: 0, to: 100 }, 'name', 'last' ],
[ 'people', { from: 0, to: 100 }, 'age' ]
```

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
function getShape(shape) {
  return model.get.apply(shape)
}

getShape({
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