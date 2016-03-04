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

// TODO: continue refactor: remove color-related functions, remove dependency on underscore/lodash, use linear indexing, consider using buffers

const PEELS = 5,
      DEFAULTS = {
        divisions: 8
      };

import adjacentFields from '../field/adjacent-fields';
import positions from './positions';

import Field from '../field';

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

    this._geometry    = null;
    this._geometryMap = null;
    this._colorFn     = null;

    this._divisions = Math.max((data.divisions || opts.divisions || DEFAULTS.divisions), 1);

    this._North = new Field(this, 'NORTH', data.north);
    this._South = new Field(this, 'SOUTH', data.south);

    var rows = this._divisions * 2,
        columns = this._divisions;

    // Populate fields:
    this._Fields = [];

    for (let s = 0; s < PEELS; s += 1) {
      this._Fields[s] = [];

      for (let x = 0; x < rows; x += 1) {
        this._Fields[s][x] = [];

        for (let y = 0; y < columns; y += 1) {
          this._Fields[s][x][y] = new Field(
            this,
            [s, x, y],
            (data.fields ? data.fields[s][x][y] : undefined)
          );
        }
      }
    }

    // Link fields to their adjacent fields:
    adjacentFields.call(this._North, 'NORTH');
    adjacentFields.call(this._South, 'SOUTH');

    for (let s = 0; s < PEELS; s += 1) {
      for (let x = 0; x < rows; x += 1) {
        for (let y = 0; y < columns; y += 1) {
          adjacentFields.call(this._Fields[s][x][y], s, x, y);
        }
      }
    }

    // Populate spherical coordinates for all fields:
    positions.populate(this);

  }

}

Sphere.prototype.serialize = require('./serialize');
Sphere.prototype.validate = require('./validate');
Sphere.prototype.iterate = require('./iterate');
Sphere.prototype.toCG = require('./to-cg');

export default Sphere;
