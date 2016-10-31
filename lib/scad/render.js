/*
 * Copyright (c) 2016 Will Shown. All Rights Reserved.
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

'use strict';

const {cos, sin, acos, sqrt, max} = Math;

const polyhedron = require('./language/polyhedron'),
      fs         = require('fs-promise');

const L = acos(sqrt(5) / 5);

// radius-related measurements * in mm *
const d0 = 13.5, // height of LED from the surface
      d1 = 2, // thickness of the surface material
      d2 = 25, // depth of the remaining LED hardware
      d3 = 10, // extra space for wiring
      d4 = Math.sqrt(
        Math.pow(220 / 2, 2) + // half length of the PSU
        Math.pow(117 / 2, 2) + // half width of the PSU
        Math.pow(30 / 2, 2) // half depth of the PSU
      ); // maximum extent of the hardware centered in the sphere

const R_min = Math.ceil(d0 + d1 + d2 + d3 + d4);

const s = 35; // maximum distance between LEDs from the top in mm

module.exports = async function (sphere, out) {

  const α     = L / sphere._divisions,
        R_max = s / ( 2 * sin(α / 2) );

  const R = max(R_min, R_max);

  console.log('[Model radius]', R, 'mm');

  let stream = fs.createWriteStream(out);

  let points = [],
      faces  = [];

  // populate points with the cartesian coordinates for all inter-field centroids

  for (let v = 0; v < sphere._interfieldCentroids.length / 2; v++) {

    let c_φ = sphere._interfieldCentroids[2 * v + 0],
        c_λ = sphere._interfieldCentroids[2 * v + 1];

    points[v] = [
      R * cos(c_φ) * cos(c_λ), // x
      R * cos(c_φ) * sin(c_λ), // y
      R * sin(c_φ), // z
    ];

  }

  // populate faces with the indexes of the relevant centroids

  for (let f = 0; f < sphere._Fields.length; f++) {

    let field = sphere._Fields[f],
        south = field === sphere._SOUTH,
        sides = field._adjacentFields.length;

    faces[f] = [];

    for (let s = 0; s < sides; s += 1) {

      let z = south ? s : (sides - 1 - s); // reverse through vertices if not south

      let fi = sphere._interfieldIndices[6 * f + z];

      faces[f].push(fi);

    }

  }

  console.log('Writing polyhedron.');

  await stream.write(
    polyhedron(points, faces)
  );

  console.log('Closing stream.');

  stream.end();

};