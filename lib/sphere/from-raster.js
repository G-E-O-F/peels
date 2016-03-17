var intersection = require('greiner-hormann').intersection,
    inside       = require('point-in-polygon');

const π = Math.PI;

function _fieldBounds() {

  var result = {
    max_φ: -Infinity,
    min_φ: Infinity,
    max_λ: -Infinity,
    min_λ: Infinity
  };

  var ifi = this._parent._interfieldIndices,
      ifc = this._parent._interfieldCentroids,
      i   = this._i;

  for (let v = 0; v < this._adjacentFields.length; v += 1) {

    let φ = ifc[ 2 * ifi[6 * i + v] + 0],
        λ = ifc[ 2 * ifi[6 * i + v] + 1];

    result.max_φ = Math.max(result.max_φ, φ );
    result.min_φ = Math.min(result.min_φ, φ );

    result.max_λ = Math.max(result.max_λ, λ );
    result.min_λ = Math.min(result.min_λ, λ );

  }

  if (i < 2) {
    result.min_λ = -π;
    result.max_λ = π;
  }

  if (i === 0) {
    result.max_φ = π/2;
  }

  if (i === 1) {
    result.min_φ = π/-2;
  }

  return result;

}

/**
 * A function that sets field data based on raster data. A flat array of numbers, `data`, is supplied
 * representing `height` rows of `width` identical rectangles, each rectangle comprising `depth`
 * points of data. A plate carrée projection is assumed.
 *
 * `map` is a function that receives `depth` arguments, each the weighted mean value of the data in
 * that channel, and called with each field's context. It can't be asynchronous.
 *
 * `done` is a Node-style completion callback called when setting field data is complete.
 *
 * @this {Sphere}
 *
 * @param {ArrayBuffer} data
 * @param {number} width
 * @param {number} height
 * @param {number} depth
 * @param {function} map
 * @param {function} done
 */
function fromRaster(data, width, height, depth, map, done) {

  var sphere = this;

  sphere.iterate(function () {

    var bBox = _fieldBounds.call(this);

    // TODO: select the rectangles within the bounding box for this field's vertices

    // TODO: continue implementing

  }, done);

}

module.exports = fromRaster;