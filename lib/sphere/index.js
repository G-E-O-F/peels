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

var PEELS = 5;

(function (module) {

  var _ = require('underscore');

  var Field = require('../field/index');
  var adjacentFields = require('../field/adjacent-fields');
  var positions = require('./positions');
  var toCG = require('./to-cg');

  var serialize = require('./serialize');
  var validate = require('./validate');
  var iterate = require('./iterate');
  var assignColor = require('./assign-color');

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
  function Sphere(options) {

    var opts = options || {},
        data = {};

    if (opts.data) {
      if (validate(opts.data)) {
        data = opts.data;
      } else {
        throw new Error('Invalid data provided.');
      }
    }

    this._geometry = null;
    this._geometryMap = null;
    this._colorFn = null;

    this._divisions = Math.max((data.divisions || opts.divisions || 8), 1);

    this._North = new Field(this, 'NORTH', data.north);
    this._South = new Field(this, 'SOUTH', data.south);

    var x = this._divisions * 2, y = this._divisions, i, j, k;

    // Populate fields:
    this._Fields = [];

    for (k = 0; k < PEELS; k += 1) {
      this._Fields[k] = [];

      for (i = 0; i < x; i += 1) {
        this._Fields[k][i] = [];

        for (j = 0; j < y; j += 1) {
          this._Fields[k][i][j] = new Field(
            this,
            [k, i, j],
            (data.fields ? data.fields[k][i][j] : undefined)
          );
        }
      }
    }

    // Link fields to their adjacent fields:
    adjacentFields.call(this._North, 'NORTH');
    adjacentFields.call(this._South, 'SOUTH');

    for (k = 0; k < PEELS; k += 1) {
      for (i = 0; i < x; i += 1) {
        for (j = 0; j < y; j += 1) {
          adjacentFields.call(this._Fields[k][i][j], k, i, j);
        }
      }
    }

    // Populate spherical coordinates for all fields:
    positions.populate(this);

  }

  /**
   * Maps Peels indexes to a flat array without gaps.
   * Indexes 0 and 1 are reserved for North and South respectively.
   *
   * @param {array|string} sxy - field coordinates in [s, x, y] or 'NORTH' or 'SOUTH'
   * @returns {number} index
   */
  Sphere.prototype.linearIndex = function(sxy){
    var d = this._divisions;
    if(sxy === 'NORTH'){
      return 0;
    }else
    if(sxy === 'SOUTH'){
      return 1;
    }else{
      return (sxy[0] * d * d * 2) + (sxy[1] * d) + sxy[2] + 2;
    }
  };

  Sphere.prototype.serialize = function () {
    return serialize.call(this);
  };

  Sphere.prototype.iterate = iterate;
  Sphere.prototype.assignColor = assignColor;

  Sphere.prototype.toCG = function(options, done){
    return toCG.getVerticesAndFaces(this, options, done);
  };

  Sphere.prototype.bindGeometry = function(geometry, colorFn){
    this._geometry = geometry;
    this._colorFn = colorFn;
  };

  module.exports = Sphere;

}(module));
