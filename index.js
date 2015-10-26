/**
 *
 * @param {object} shape
 * @param {function} resolver
 * @returns {Array} array of PathSets
 */
module.exports = function shapeToPathSets (shape, resolver) {
  var array = []

  if (typeof resolver !== 'function') {
    resolver = function (resolvable) {
      return resolvable()
    }
  }

  Object.keys(shape).forEach(function (key) {
    var value = shape[key]
    if (typeof value === 'function') {
      value = resolver(value, shape, key)
      if (value !== true && Object.prototype.toString.call(value) !== '[object Object]') {
        throw new Error('`resolver` must return `true` or an object')
      }
    }
    if (value === true) { // e.g. name:true
      array.push([key])
    } else if (key === '$') {
      // e.g. { $: [ { from:0, to:10 }, { ... } ]
      shapeToPathSets(value[1], resolver).forEach(function (path) {
        array.push([value[0]].concat(path))
      })
    } else {
      // e.g. { name:true, ... }
      shapeToPathSets(value, resolver).forEach(function (path) {
        array.push([key].concat(path))
      })
    }
  })
  return array
}
