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

// Bear in mind: OpenSCAD uses Z for up, rather than Y.

const {cos, sin, acos, sqrt, max} = Math;

const polyhedron                  = require('./language/polyhedron'),
      {Plane}                     = require('pex-geom'),
      {Vec3}                      = require('pex-math'),
      fs                          = require('fs-promise');

const L      = acos(sqrt(5) / 5),
      origin = [0, 0, 0];

// radius-related measurements * in mm *
const d0 = 13.5, // height of LED from the surface
      d1 = 1.7, // thickness of the surface material
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

  const α           = L / sphere._divisions,
        n_fields    = sphere._Fields.length,
        n_centroids = sphere._interfieldCentroids.length,
        R_max       = s / ( 2 * sin(α / 2) );

  const R = max(R_min, R_max);

  console.log('[Model diameter]', R * .2, 'cm');

  let stream = fs.createWriteStream(out);

  let points = [],
      faces  = [];

  // populate points with the cartesian coordinates for all inter-field centroids

  for (let v = 0; v < n_centroids / 2; v++) {

    let c_φ = sphere._interfieldCentroids[2 * v + 0],
        c_λ = sphere._interfieldCentroids[2 * v + 1];

    points[v] = [
      R * cos(c_φ) * cos(c_λ), // x
      R * cos(c_φ) * sin(c_λ), // y
      R * sin(c_φ), // z
    ];

  }

  // populate points with the additional coordinates for the sunken faces

  for (let f = 0; f < n_fields; f++) {

    let field = sphere._Fields[f],
        sides = field._adjacentFields.length;

    let p_φ = field.position[0],
        p_λ = field.position[1];

    // get the plane

    let ref    = sphere._interfieldIndices[6 * f],
        r_φ    = sphere._interfieldCentroids[2 * ref + 0],
        r_λ    = sphere._interfieldCentroids[2 * ref + 1],
        r_x    = R * cos(r_φ) * cos(r_λ),
        r_y    = R * cos(r_φ) * sin(r_λ),
        r_z    = R * sin(r_φ),
        norm_x = cos(p_φ) * cos(p_λ),
        norm_y = cos(p_φ) * sin(p_λ),
        norm_z = sin(p_φ),
        norm   = [norm_x, norm_y, norm_z]; // normal vector

    let plane = [
      [r_x, r_y, r_z], // reference vector on the plane
      norm
    ];

    let ray = [
      origin,
      norm
    ];

    let polyCentroid = Plane.getRayIntersection(plane, ray),
        surfaceCenter = norm.map(w => w * R);

    // d_gap is the distance (in mm) between the top of the LED and the surface of the sphere
    let d_gap = Vec3.distance(polyCentroid, surfaceCenter);

    if(f === 31) { console.log('[Sample d_gap]', d_gap, 'mm'); }

    // TODO: starting from d_gap, determine:
    // 1) the centers of the upper and lower surfaces around the LED (the cylinder hole will use
    // these too)
    // 2) the per-vertex points around the upper surfaces of the LED by
    //    2.1) projecting the vertices to the upper surface plane
    //    2.2) finding the points d0 mm toward the center from the projected vertices
    // 3) determine points Y using the same algorithm as interfield centroids, but instead
    //    find the intersection of the 3 lower surface planes [http://geomalgorithms.com/a05-_intersect-1.html]

  }

  // populate faces with the indexes of the relevant centroids

  for (let f = 0; f < n_fields; f++) {

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