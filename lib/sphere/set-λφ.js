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

(function (module) {

  /**
   * ONLY USES VALUES IN RADIANS.
   * LONGITUDE AND LATITUDE ARE LIKE EARTH'S.
   * YOU HAVE BEEN WARNED.
   */

  var _ = require('lodash');

  var π = Math.PI,
      acos = Math.acos,
      asin = Math.asin,
      atan2 = Math.atan2,
      cos = Math.cos,
      sin = Math.sin;

  // L is the spherical arclength of the edges of the icosahedron.
  var L = acos(Math.sqrt(5) / 5);

  /**
   * Returns destination point given distance and bearing from start point
   * @param {object} pos
   * @param {number} pos.λ - longitude in radians
   * @param {number} pos.φ - latitude in radians
   * @param {number} a - spherical heading in radians
   * @param {number} d - arclength distance to travel
   */
  var swim = function (pos, a, d) {
    var φ2 = asin(sin(pos.φ) * cos(d) + cos(pos.φ) * sin(d) * cos(a));
    return {
      φ: φ2,
      λ: pos.λ + atan2(sin(a) * sin(d) * cos(pos.φ), cos(d) - sin(pos.φ) * sin(φ2))
    }
  };

  var populatePositions = function (Sphere) {

    var self = Sphere,
        d = self._divisions,
        max = {
          x: 2 * d - 1,
          y: d - 1
        },
        u = L / d;

    self._South._setPosition(0, π);
    self._North._setPosition(0, 0);

    _.each(self._Fields, function (section, s) {

      // first, set the positions of the fields along polar edges.
      // we know the longitude based on which section they're in.
      var λNorth = s * 2 / 5 * π,
          λSouth = s * 2 / 5 * π + π / 5;

      for (var i = 0; i <= d; i += 1) {
        var φNorth = π - u * (i + 1),
            φSouth = u * (i + 1) - π;
        self._Fields[s][i][0]._setPosition(λNorth, φNorth);
        self._Fields[s][max.x][max.y - i]._setPosition(λSouth, φSouth);
      }

      // next, set the positions of fields along the other edges

    });

  };

  module.exports = {
    populate: populatePositions,
    swim: swim
  };

}(module));