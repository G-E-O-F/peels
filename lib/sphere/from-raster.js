'use strict';

var inside = require('point-in-polygon');

var populateInterfieldData = require('./inter-field');

const π = Math.PI,
      τ = 2 * Math.PI;

function _fieldGeometry() {

  var max_φ    = -Infinity,
      min_φ    = Infinity,
      max_λ    = -Infinity,
      min_λ    = Infinity,
      mid_λ    = this.position.λ,
      vertices = [];

  const ifi = this._parent._interfieldIndices,
        ifc = this._parent._interfieldCentroids,
        i   = this._i;

  for (let v = 0; v < this._adjacentFields.length; v += 1) {

    let φ = ifc[2 * ifi[6 * i + v] + 0],
        λ = ifc[2 * ifi[6 * i + v] + 1];

    max_φ = Math.max(max_φ, φ);
    min_φ = Math.min(min_φ, φ);

    max_λ = Math.max(max_λ, λ);
    min_λ = Math.min(min_λ, λ);

    vertices.push([λ, φ]);

  }

  if (i === 0) {
    max_φ = π / 2;
  }

  if (i === 1) {
    min_φ = π / -2;
  }

  if (i < 2) {
    min_λ = -π;
    max_λ = π;
    vertices = [
      [min_λ, max_φ],
      [max_λ, max_φ],
      [max_λ, min_φ],
      [min_λ, min_φ]
    ];
  } else if (max_λ > 0 && min_λ < 0 && (mid_λ < π / -2 || mid_λ > π / 2)) {
    // this spans the meridian, so shift negative λ values past π and recalculate latitudinal bounds

    max_λ = -Infinity;
    min_λ = Infinity;

    for (let v = 0; v < vertices.length; v += 1) {

      if (vertices[v][0] < 0) vertices[v][0] += τ;

      max_λ = Math.max(max_λ, vertices[v][0]);
      min_λ = Math.min(min_λ, vertices[v][0]);

    }

  }

  return {
    min_φ,
    max_φ,
    min_λ,
    max_λ,
    vertices
  };

}

function _populateSelectionGrid(geo, w, h) {

  var w_rect = τ / w,
      h_rect = π / h;

  var grid = [];

  var min_x = Math.floor(geo.min_λ / w_rect + w / 2),
      max_x = Math.ceil(geo.max_λ / w_rect + w / 2),
      min_y = Math.floor(geo.min_φ / h_rect + h / 2),
      max_y = Math.ceil(geo.max_φ / h_rect + h / 2);

  for (let x = min_x; x <= max_x; x += 1) {

    grid[x % w] = [];

    for (let y = min_y; y <= max_y; y += 1) {

      grid[x % w][y] = inside(
        [x * w_rect - π, y * h_rect - π / 2],
        geo.vertices
      );

    }

  }

  return {
    min_x,
    max_x,
    min_y,
    max_y,
    grid
  };

}

function _testPoints(grid, x, y) {

  var result = 0,
      w      = grid.length;

  if (grid[(x + 0) % w][y + 0]) result++;
  if (grid[(x + 0) % w][y + 1]) result++;
  if (grid[(x + 1) % w][y + 0]) result++;
  if (grid[(x + 1) % w][y + 1]) result++;

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

  populateInterfieldData.call(sphere);

  sphere.iterate(function (doneField) {

    var geo       = _fieldGeometry.call(this),
        selection = _populateSelectionGrid(geo, width, height);

    var valSums   = [],
        weightSum = 0;

    for (let z = 0; z < depth; z += 1) {
      valSums[z] = 0;
    }

    for (let x = selection.min_x; x < selection.max_x; x += 1) {

      for (let y = selection.min_y; y < selection.max_y; y += 1) {

        let w = _testPoints(selection.grid, x, y) / 4;

        for (let z = 0; z < depth; z += 1) {
          valSums[z] += data[(height - y - 1) * width * depth + (width - x - 1) * depth + z] * w;
        }

        weightSum += w;

      }

    }

    if (weightSum <= 0) debugger; // weight sum should never be non-positive

    map.apply(this, valSums.map((val)=> {
      return val / weightSum
    }));

    doneField();

  }, done);

}

module.exports = fromRaster;