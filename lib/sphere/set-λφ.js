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
      sin = Math.sin,
      sqrt = Math.sqrt;

  // L is the spherical arclength of the edges of the icosahedron.
  var L = acos(Math.sqrt(5) / 5);

  /**
   * Returns destination position given distance and bearing from start position
   * @param {object} pos
   * @param {number} pos.φ - latitude in radians
   * @param {number} pos.λ - longitude in radians
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

  /**
   * Returns the arc length between two positions.
   *
   * @param {object} pos1
   * @param {number} pos1.φ - first latitude in radians
   * @param {number} pos1.λ - first longitude in radians
   *
   * @param {object} pos2
   * @param {number} pos2.φ - second latitude in radians
   * @param {number} pos2.λ - second longitude in radians
   *
   * @return {number} arc length
   */
  var distance = function (pos1, pos2) {
    return 2 * asin(sqrt(Math.pow(sin((pos1.φ - pos2.φ) / 2), 2) + cos(pos1.φ) * cos(pos2.φ) * Math.pow(sin((pos1.λ - pos2.λ) / 2), 2)));
  };

  /**
   * Returns the position halfway between two positions.
   * Chiefly used to test `interpolate`.
   *
   * @param {object} pos1
   * @param {number} pos1.φ - first latitude in radians
   * @param {number} pos1.λ - first longitude in radians
   *
   * @param {object} pos2
   * @param {number} pos2.φ - second latitude in radians
   * @param {number} pos2.λ - second longitude in radians
   *
   * @return {object} pos3 - result
   * @return {number} pos3.φ - result latitude in radians
   * @return {number} pos3.λ - result longitude in radians
   */
  var midpoint = function (pos1, pos2) {
    var Bx = Math.cos(pos2.φ) * Math.cos(pos2.λ-pos1.λ);
    var By = Math.cos(pos2.φ) * Math.sin(pos2.λ-pos1.λ);

    return {
      φ: atan2(sin(pos1.φ) + sin(pos2.φ),
               sqrt((cos(pos1.φ)+Bx)*(cos(pos1.φ)+Bx) + By*By )),
      λ: pos1.λ + atan2(By, cos(pos1.φ) + Bx)
    };
  };

  /**
   * Given two positions and `d` number of times to divide the distance between the two,
   * returns `d - 1` evenly-spaced positions between the two points.
   *
   * @param {object} pos1
   * @param {number} pos1.φ - first latitude in radians
   * @param {number} pos1.λ - first longitude in radians
   *
   * @param {object} pos2
   * @param {number} pos2.φ - second latitude in radians
   * @param {number} pos2.λ - second longitude in radians
   *
   * @param {number} d - number of divisions of the chord between the positions;
   *                     this is the same metric as Sphere._divisions.
   *
   * @return {object[]} result
   * @return {number} pos3.φ - result latitude in radians
   * @return {number} pos3.λ - result longitude in radians
   */
  var interpolate = function (pos1, pos2, d) {

    var points = [];

    for (var i = 1; i < d; i += 1) {
      var f = i / d,
          Δ = distance(pos1, pos2);

      var A = sin((1 - f) * Δ) / sin(Δ),
          B = sin(f * Δ) / sin(Δ),
          x = A * cos(pos1.φ) * cos(pos1.λ) + B * cos(pos2.φ) * cos(pos2.λ),
          y = A * cos(pos1.φ) * sin(pos1.λ) + B * cos(pos2.φ) * sin(pos2.λ),
          z = A * sin(pos1.φ) + B * sin(pos2.φ);

      points.push({
        φ: atan2(z, sqrt(Math.pow(x, 2) + Math.pow(y,2))),
        λ: atan2(y, x)
      });
    }

    return points;
  };

  var populatePositions = function (Sphere) {

    var self = Sphere,
        d = self._divisions,
        max = {
          x: 2 * d - 1,
          y: d - 1
        },
        u = L / d;

    self._South._setPosition(0, π/-2);
    self._North._setPosition(0, π/2);

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
    swim    : swim,
    midpoint: midpoint,
    interpolate: interpolate,
    distance: distance
  };

}(module));