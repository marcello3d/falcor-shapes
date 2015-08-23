/**
 *
 * @param {object} shape
 * @returns {Array} array of PathSets
 */
module.exports = function shapeToPathSets (shape) {
  var array = []
  Object.keys(shape).forEach(function (key) {
    var value = shape[key]
    if (value === true) { // e.g. name:true
      array.push([key])
    } else if (key === '$') {
      // e.g. { $: [ { from:0, to:10 }, { ... } ]
      shapeToPathSets(value[1]).forEach(function (path) {
        array.push([value[0]].concat(path))
      })
    } else {
      // e.g. { name:true, ... }
      shapeToPathSets(value).forEach(function (path) {
        array.push([key].concat(path))
      })
    }
  })
  return array
}
