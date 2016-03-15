/*
 * Copyright (c) 2014 Will Shown. All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const PEELS    = 5,
      DEFAULTS = {
        divisions: 8
      };

var link      = require('./link'),
    positions = require('./positions');

var Field = require('../field');

/**
 * Represents a sphere of fields arranged in an interpolated icosahedral geodesic pattern.
 *
 * @param {object} options
 * @param {number} [options.divisions = 8] - Integer greater than 0:
 *   the number of fields per edge of the icosahedron including
 *   the origin of the edge (but not the endpoint). Determines the
 *   angular resolution of the sphere. Directly & exponentially related
 *   to the memory consumption of a Sphere.
 * @param {object} [options.data] - JSON representation of a sphere.
 *   Should follow the same schema as output by Sphere.serialize. Constructor
 *   will throw an error if it doesn't.
 * @constructor
 */
class Sphere {

  constructor(options) {

    var opts = options || {},
        data = {};

    if (opts.data) {
      if (this.validate(opts.data)) {
        data = opts.data;
      } else {
        throw new Error('Invalid data provided.');
      }
    }

    var d = this._divisions = Math.max((
          data.divisions || opts.divisions || DEFAULTS.divisions
        ), 1),
        n = PEELS * 2 * d * d + 2;

    // Populate fields:
    this._Fields    = [];
    this._positions = new Float64Array(n * 2);

    for (let i = 0; i < n; i += 1) {
      this._Fields[i] = new Field(
        this, i,
        (data.fields ? data.fields[i] : undefined)
      );
    }

    this._Fields.forEach(link);

    // Populate spherical coordinates for all fields:
    positions.populate(this);

  }

  get(s, x, y) {

    var d = this._divisions;

    if (s === 'NORTH') return this._Fields[0];

    if (s === 'SOUTH') return this._Fields[1];

    return this._Fields[
        s * d * d * 2 +
        x * d +
        y + 2
      ];

  }

  get interfieldTriangles() {
    if (!this._interfieldTriangles) this._interfieldTriangles = this._getInterfieldTriangles();
    return this._interfieldTriangles;
  }

  _getInterfieldTriangles() {

    var n         = this._Fields.length,
        triangles = new Uint32Array((2 * n - 4) * 3);

    for (let f = 0; f < n; f += 1) {

      let field = this._Fields[f];

      if (f > 1) { // not North or South

        var n1i = field._adjacentFields[0]._i,
            n2i = field._adjacentFields[1]._i,
            n3i = field._adjacentFields[2]._i,
            f1  = f * 2 - 4,
            f2  = f * 2 - 3;

        triangles[f1 * 3 + 0] = n2i;
        triangles[f1 * 3 + 1] = n1i;
        triangles[f1 * 3 + 2] = f;

        triangles[f2 * 3 + 0] = n3i;
        triangles[f2 * 3 + 1] = n2i;
        triangles[f2 * 3 + 2] = f;

      }

    }

    return triangles;

  }

}

Sphere.prototype.serialize = require('./serialize');
Sphere.prototype.validate  = require('./validate');
Sphere.prototype.iterate   = require('./iterate');
Sphere.prototype.toCG      = require('./to-cg');

module.exports = Sphere;
