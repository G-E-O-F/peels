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

var link = require('./link'),
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
    this._Fields = [];

    for (let i = 0; i < n; i += 1){
      this._Fields[i] = new Field(
        this, i,
        (data.fields ? data.fields[i] : undefined)
      );
    }

    this._Fields.forEach(link);

    // Populate spherical coordinates for all fields:
    positions.populate(this);

  }

  get(sxy){
    var d = this._divisions;

    if(sxy === 'NORTH') return this._Fields[0];

    if(sxy === 'SOUTH') return this._Fields[1];

    return this._Fields[
      sxy[0] * d * d * 2 +
      sxy[1] * d +
      sxy[2] + 2
    ];

  }

}

Sphere.prototype.serialize = require('./serialize');
Sphere.prototype.validate = require('./validate');
Sphere.prototype.iterate = require('./iterate');
Sphere.prototype.toCG = require('./to-cg');

module.exports = Sphere;