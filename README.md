# falcor-shapes

falcor-shapes is a convenience function for [falcor paths](http://netflix.github.io/falcor/documentation/paths.html).

It converts a "Shape" into an array of falcor PathSets.

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

## Shape documentation

A shape is a recursive structure. Each shape is a JavaScript object with keys and values. 

`{ <key>:true }` is a leaf value, and becomes the path `[ '<key>' ]`
`$` is a special key that expects an array: `{ $: [ <range>, <subtree> ] }` and becomes `[ <range>, <subtree> ]`

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

// We can make a helper function to simplify this:
function getShape(model, shape) {
  return model.get.apply(model, shape)
}

getShape(model, {
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

Feel free to submit PRs!

## License

zlib