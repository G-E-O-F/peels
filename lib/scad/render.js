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

/**
 *   ============
 *   Dependencies
 *   ============
 */

  // Bear in mind: OpenSCAD uses Z for up, rather than Y.

const {cos, sin, acos, sqrt, max, atan2, atan} = Math;

const polyhedron                  = require('./language/polyhedron'),
      mat4FromNormal              = require('./mat4-from-normal'),
      intersect3Planes            = require('./intersect-3-planes'),
      {Plane}                     = require('pex-geom'),
      {Vec3}                      = require('pex-math'),
      fs                          = require('fs-promise');

const L      = acos(sqrt(5) / 5),
      origin = [0, 0, 0];

/**
 *   ========
 *   Settings
 *   ========
 */

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

const steepness_pent = .7,
      steepness_hex  = 1;

const ventCircumSize = .2,
      ventRadialSize = .5;

/**
 *   ==
 *   Go
 *   ==
 */

module.exports = async function (sphere, out) {

  const α           = L / sphere._divisions,
        n_fields    = sphere._Fields.length,
        n_centroids = sphere._interfieldCentroids.length,
        R_max       = s / ( 2 * sin(α / 2) );

  const R = max(R_min, R_max);

  console.log('[Model diameter]', R * .2, 'cm');

  let stream = fs.createWriteStream(out);

  // polyhedron arrays

  let outer_points = [],
      outer_faces  = [],
      inner_points = [],
      inner_faces  = [],
      vent_points  = [[0, 0, 0]],
      vent_faces   = [];

  // polyhedron indices

  let p_o = 0,
      f_o = 0,
      p_i = 0,
      f_i = 0,
      p_v = 1,
      f_v = 0;

  // hole orientation arrays

  let holeCenters = [];

  // inner surface planes

  let innerSurfacePlanes = [];

  // populate points with the cartesian coordinates for all inter-field centroids

  for (p_o; p_o < n_centroids / 2; p_o++) {

    let c_φ = sphere._interfieldCentroids[2 * p_o + 0],
        c_λ = sphere._interfieldCentroids[2 * p_o + 1];

    outer_points[p_o] = [
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

    // Starting from d_gap, determine:
    // 1) the centers of the upper and lower surfaces around the LED (the cylinder hole will use
    // these too)

    let center_top = Vec3.scale(Vec3.copy(polyCentroid), (R - d_gap - d0) / R),
        plane_top  = [center_top, norm];

    holeCenters[g] = center_top;

    let center_bot = Vec3.scale(Vec3.copy(polyCentroid), (R - d_gap - d0 - d1) / R);

    innerSurfacePlanes[g] = [center_bot, norm];

    // 2) the per-vertex points around the upper surfaces of the LED by

    let p_0 = p_o;

    outer_faces[f_o] = [];

    for (let sv = 0; sv < sides; sv++) {

      //    2.1) projecting each vertex to the upper surface plane

      outer_points[p_o] = [0, 0, 0];

      Plane.getRayIntersection(
        plane_top,
        [
          outer_points[sphere._interfieldIndices[6 * g + sv]],
          invN
        ],
        outer_points[p_o]
      );

      //    2.2) finding the points d0 mm toward the center from the projected vertices
      //           find vector from center: subtract(p_v, center)
      //           scale vector from center by ((dist - d0) / dist)
      //           new vertex is result of add(center, scaled)

      let dist = Vec3.distance(outer_points[p_o], center_top);

      Vec3.lerp(
        outer_points[p_o],
        center_top,
        (dist - d0 * (sides === 5 ? steepness_pent : steepness_hex)) / dist
      );

      outer_faces[f_o].push(p_o);

      p_o++;

    }

    if (g !== 1) outer_faces[f_o] = outer_faces[f_o].reverse();

    // Expand polygon into triangles

    if (sides === 5) {

      outer_faces[f_o + 2] = [outer_faces[f_o][0], outer_faces[f_o][1], outer_faces[f_o][2]];
      outer_faces[f_o + 1] = [outer_faces[f_o][0], outer_faces[f_o][2], outer_faces[f_o][4]];
      outer_faces[f_o + 0] = [outer_faces[f_o][4], outer_faces[f_o][2], outer_faces[f_o][3]];

      f_o += 3;

    } else {

      outer_faces[f_o + 3] = [outer_faces[f_o][0], outer_faces[f_o][1], outer_faces[f_o][2]];
      outer_faces[f_o + 2] = [outer_faces[f_o][0], outer_faces[f_o][2], outer_faces[f_o][5]];
      outer_faces[f_o + 1] = [outer_faces[f_o][5], outer_faces[f_o][2], outer_faces[f_o][3]];
      outer_faces[f_o + 0] = [outer_faces[f_o][5], outer_faces[f_o][3], outer_faces[f_o][4]];

      f_o += 4;

    }

    // populate faces with the quadrilateral faces created here

    for (let sv = 0; sv < sides; sv += 1) {

      let sn = ((sv + sides + 1 ) % sides),
          sp = ((sv + sides - 1 ) % sides);

      let p1 = p_0 + sv,
          p2 = p_0 + sn,
          p0 = p_0 + sp;

      let o1 = sphere._interfieldIndices[6 * g + sv],
          o2 = sphere._interfieldIndices[6 * g + sn];

      outer_faces[f_o] = [
        p1, p2, o2
      ];

      outer_faces[f_o + 1] = [
        o1, p1, o2
      ];

      if (g === 1) {
        outer_faces[f_o] = outer_faces[f_o].reverse();
        outer_faces[f_o + 1] = outer_faces[f_o + 1].reverse();
      }

      f_o += 2;

      // also generate a vent for this quadrilateral

      vent_points[p_v + 0] = Vec3.lerp(
        Vec3.copy(outer_points[p1]),
        outer_points[o1],
        ventRadialSize
      );


      vent_points[p_v + 1] = Vec3.lerp(
        Vec3.copy(outer_points[p1]),
        outer_points[p2],
        ventCircumSize
      );

      vent_points[p_v + 2] = Vec3.lerp(
        Vec3.copy(outer_points[p1]),
        outer_points[p0],
        ventCircumSize
      );

      Vec3.scale(vent_points[p_v + 0], 1.1);
      Vec3.scale(vent_points[p_v + 1], 1.1);
      Vec3.scale(vent_points[p_v + 2], 1.1);

      vent_faces[f_v + 0] = [p_v + 2, p_v + 1, p_v + 0];
      vent_faces[f_v + 1] = [0, p_v + 0, p_v + 1];
      vent_faces[f_v + 2] = [0, p_v + 1, p_v + 2];
      vent_faces[f_v + 3] = [0, p_v + 2, p_v + 0];

      if(g === 1){
        vent_faces[f_v + 0] = vent_faces[f_v + 0].reverse();
        vent_faces[f_v + 1] = vent_faces[f_v + 1].reverse();
        vent_faces[f_v + 2] = vent_faces[f_v + 2].reverse();
        vent_faces[f_v + 3] = vent_faces[f_v + 3].reverse();
      }

      p_v += 3;
      f_v += 4;

    }

  }

  console.log('[Render]', 'Writing outer polyhedron.');

  await stream.write(
    `module outerPoly () {\n
      ${polyhedron(outer_points, outer_faces, 8)}\n
    }\n`
  );

  console.log('[Render]', 'Writing vent polyhedron.');

  await stream.write(
    `module ventPoly () {\n
      ${polyhedron(vent_points, vent_faces, 4)}\n
    }\n`
  );

  // 3) determine points Y using the same algorithm as interfield centroids, but instead
  //   find the intersection of the 3 lower surface planes
  //   [http://geomalgorithms.com/a05-_intersect-1.html]

  var n_c = sphere._interfieldTriangles.length / 3;

  for (let v = 0; v < n_c; v += 1) {

    inner_points[p_i] = intersect3Planes(
      innerSurfacePlanes[sphere._interfieldTriangles[3 * v + 0]],
      innerSurfacePlanes[sphere._interfieldTriangles[3 * v + 1]],
      innerSurfacePlanes[sphere._interfieldTriangles[3 * v + 2]]
    );

    p_i++;

  }

  for (let g = 0; g < n_fields; g++) {

    let field = sphere._Fields[g],
        sides = field._adjacentFields.length;

    inner_faces[f_i] = [];

    for (let s = 0; s < sides; s += 1) {

      inner_faces[f_i].push(
        sphere._interfieldIndices[6 * g + s]
      );

    }

    if (g !== 1) inner_faces[f_i] = inner_faces[f_i].reverse();

    if (sides === 5) {

      inner_faces[f_i + 2] = [inner_faces[f_i][0], inner_faces[f_i][1], inner_faces[f_i][2]];
      inner_faces[f_i + 1] = [inner_faces[f_i][0], inner_faces[f_i][2], inner_faces[f_i][4]];
      inner_faces[f_i + 0] = [inner_faces[f_i][4], inner_faces[f_i][2], inner_faces[f_i][3]];

      f_i += 3;

    } else {

      inner_faces[f_i + 3] = [inner_faces[f_i][0], inner_faces[f_i][1], inner_faces[f_i][2]];
      inner_faces[f_i + 2] = [inner_faces[f_i][0], inner_faces[f_i][2], inner_faces[f_i][5]];
      inner_faces[f_i + 1] = [inner_faces[f_i][5], inner_faces[f_i][2], inner_faces[f_i][3]];
      inner_faces[f_i + 0] = [inner_faces[f_i][5], inner_faces[f_i][3], inner_faces[f_i][4]];

      f_i += 4;

    }

  }

  console.log('[Render]', 'Writing inner polyhedron.');

  await stream.write(
    `module innerPoly () {\n
      ${polyhedron(inner_points, inner_faces, 2)}\n
    }\n`
  );

  // Done with the outer polyhedron, now for the cylinders

  // Define the standard hole cylinder centered on the origin, aligned with the z axis

  console.log('[Render]', 'Writing holes.');

  await stream.write(
    `module cylinder_outer(height,radius,fn){
       fudge = 1/cos(180/fn);
       cylinder( h=height, r=radius*fudge, $fn=fn, center=true );
     }
     module hole () {
      cylinder_outer(
        ${(d0 + d1 + d2)},
        ${r_led},
        30
      );
    }\n`
  );

  await stream.write(
    `difference(){
      outerPoly();
      innerPoly();
      ventPoly();
    `
  );

  for (let g = 0; g < n_fields; g += 1) {

    let mat = mat4FromNormal(holeCenters[g]);

    await stream.write(
      `multmatrix(m = ${ JSON.stringify(mat) }){
        hole();
      }\n`
    );

  }

  await stream.write(
    `}`
  );

  console.log('[Render]', 'Closing stream.');

  stream.end();

};