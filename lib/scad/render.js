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

const {cos, sin, acos, sqrt, max, atan2, atan} = Math;

const polyhedron                  = require('./language/polyhedron'),
      cylinder                    = require('./language/cylinder'),
      mat4FromNormal              = require('./mat4-from-normal'),
      {Plane}                     = require('pex-geom'),
      {Vec3}                      = require('pex-math'),
      fs                          = require('fs-promise');

const L       = acos(sqrt(5) / 5),
      origin  = [0, 0, 0];

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

const r_led = 12 / 2; // radius in mm of the LEDs

const R_min = Math.ceil(d0 + d1 + d2 + d3 + d4);

const s = 38; // maximum distance between LEDs from the top in mm

module.exports = async function (sphere, out) {

  const α           = L / sphere._divisions,
        n_fields    = sphere._Fields.length,
        n_centroids = sphere._interfieldCentroids.length,
        R_max       = s / ( 2 * sin(α / 2) );

  const R = max(R_min, R_max);

  console.log('[Model diameter]', R * .2, 'cm');

  let stream = fs.createWriteStream(out);

  // outer polyhedron arrays

  let points = [],
      faces  = [];

  // outer polyhedron indices

  let p = 0,
      f = 0;

  // hole orientation arrays

  let holeCenters = [],
      holeNorms   = [];

  // populate points with the cartesian coordinates for all inter-field centroids

  for (p; p < n_centroids / 2; p++) {

    let c_φ = sphere._interfieldCentroids[2 * p + 0],
        c_λ = sphere._interfieldCentroids[2 * p + 1];

    points[p] = [
      R * cos(c_φ) * cos(c_λ), // x
      R * cos(c_φ) * sin(c_λ), // y
      R * sin(c_φ), // z
    ];

  }

  // populate points with the additional coordinates for the sunken faces

  for (let g = 0; g < n_fields; g++) {

    let field = sphere._Fields[g],
        sides = field._adjacentFields.length;

    let p_φ = field.position[0],
        p_λ = field.position[1];

    // get the plane

    let ref    = sphere._interfieldIndices[6 * g],
        r_φ    = sphere._interfieldCentroids[2 * ref + 0],
        r_λ    = sphere._interfieldCentroids[2 * ref + 1],
        r_x    = R * cos(r_φ) * cos(r_λ),
        r_y    = R * cos(r_φ) * sin(r_λ),
        r_z    = R * sin(r_φ),
        norm_x = cos(p_φ) * cos(p_λ),
        norm_y = cos(p_φ) * sin(p_λ),
        norm_z = sin(p_φ),
        norm   = [norm_x, norm_y, norm_z], // normal vector
        invN   = Vec3.invert(Vec3.copy(norm));

    holeNorms[g] = norm;

    let plane = [
      [r_x, r_y, r_z], // reference vector on the plane
      norm
    ];

    let ray = [
      origin,
      norm
    ];

    let polyCentroid  = Plane.getRayIntersection(plane, ray),
        surfaceCenter = norm.map(w => w * R);

    // d_gap is the distance (in mm) between the top of the LED and the surface of the sphere
    let d_gap = Vec3.distance(polyCentroid, surfaceCenter);

    if (g === 31) {
      console.log('[Sample d_gap]', d_gap, 'mm');
    }

    // Starting from d_gap, determine:
    // 1) the centers of the upper and lower surfaces around the LED (the cylinder hole will use
    // these too)

    let center_top = Vec3.scale(Vec3.copy(polyCentroid), (R - d_gap - d0) / R),
        plane_top  = [center_top, norm];

    holeCenters[g] = center_top;

    let center_bot = Vec3.scale(Vec3.copy(polyCentroid), (R - d_gap - d0 - d1) / R),
        plane_bot  = [center_bot, norm];

    // 2) the per-vertex points around the upper surfaces of the LED by

    let p_0 = p;

    faces[f] = [];

    for (let sv = 0; sv < sides; sv++) {

      //    2.1) projecting each vertex to the upper surface plane

      points[p] = [0, 0, 0];

      Plane.getRayIntersection(
        plane_top,
        [
          points[sphere._interfieldIndices[6 * g + sv]],
          invN
        ],
        points[p]
      );

      //    2.2) finding the points d0 mm toward the center from the projected vertices
      //           find vector from center: subtract(p_v, center)
      //           scale vector from center by ((dist - d0) / dist)
      //           new vertex is result of add(center, scaled)

      let dist = Vec3.distance(points[p], center_top);

      Vec3.add(
        Vec3.scale(
          Vec3.sub(
            points[p],
            center_top
          ),
          (dist - (sides === 5 ? d0 * .67 : d0)) / dist
        ),
        center_top
      );

      faces[f].push(p);

      p++;

    }

    if (g !== 1) faces[f] = faces[f].reverse();

    // Expand polygon into triangles

    if(sides === 5){

      faces[f+2] = [faces[f][0], faces[f][1], faces[f][2]];
      faces[f+1] = [faces[f][0], faces[f][2], faces[f][4]];
      faces[f+0] = [faces[f][4], faces[f][2], faces[f][3]];

      f += 3;

    }else{

      faces[f+3] = [faces[f][0], faces[f][1], faces[f][2]];
      faces[f+2] = [faces[f][0], faces[f][2], faces[f][5]];
      faces[f+1] = [faces[f][5], faces[f][2], faces[f][3]];
      faces[f+0] = [faces[f][5], faces[f][3], faces[f][4]];

      f += 4;

    }

    // populate faces with the quadrilateral faces created here

    for (let sv = 0; sv < sides; sv += 1) {

      let sn = ((sv + sides + 1 ) % sides);

      let p_cur = p_0 + sv,
          p_nex = p_0 + sn;

      let o1 = sphere._interfieldIndices[6 * g + sv],
          o2 = sphere._interfieldIndices[6 * g + sn];

      faces[f] = [
        p_cur, p_nex, o2
      ];

      faces[f + 1] = [
        o1, p_cur, o2
      ];

      if (g === 1){
        faces[f] = faces[f].reverse();
        faces[f+1] = faces[f+1].reverse();
      }

      f += 2;

    }

    // TODO: 3) determine points Y using the same algorithm as interfield centroids, but instead
    //    find the intersection of the 3 lower surface planes
    // [http://geomalgorithms.com/a05-_intersect-1.html]

  }

  console.log('Writing polyhedron.');

  await stream.write(
    `module outerPoly () {\n
      ${polyhedron(points, faces, 8)}\n
    }\n`
  );

  // Done with the outer polyhedron, now for the cylinders

  // Define the standard hole cylinder centered on the origin, aligned with the z axis

  console.log('Writing holes.');

  await stream.write(
    `module hole () {
      ${cylinder(
      (d0 + d1 + d2),
      r_led,
      r_led
    )}\n
    }\n`
  );

  await stream.write(
    `difference(){
      outerPoly();\n`
  );

  for (let g = 0; g < n_fields; g += 1) {

    let mat = mat4FromNormal( holeNorms[g], holeCenters[g] );

    await stream.write(
      `multmatrix(m = ${ JSON.stringify(mat) }){
        hole();
      }\n`
    );

  }

  await stream.write(
    `}`
  );

  console.log('Closing stream.');

  stream.end();

};