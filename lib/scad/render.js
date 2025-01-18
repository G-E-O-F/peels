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

const {cos, sin, acos, sqrt, max} = Math;

const polyhedron      = require('./language/polyhedron'),
      globalPolyhedra = require('./elements/global-polyhedra'),
      mat4FromNormal  = require('./mat4-from-normal'),
      fs              = require('fs-promise');

const L = acos(sqrt(5) / 5);

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

  const α        = L / sphere._divisions,
        n_fields = sphere._Fields.length,
        R_max    = s / ( 2 * sin(α / 2) );

  const R = max(R_min, R_max);

  console.log('[Model diameter]', R * .2, 'cm');

  let stream    = fs.createWriteStream(out),
      polyhedra = globalPolyhedra(
        sphere,
        {
          R, d0, d1,
          steepness_pent,
          steepness_hex,
          ventCircumSize,
          ventRadialSize,
        }
      );

  console.log('[Render]', 'Writing outer polyhedron.');

  await stream.write(
    `module outerPoly () {\n
      ${polyhedron(polyhedra.outer.points, polyhedra.outer.faces, 8)}\n
    }\n`
  );

  console.log('[Render]', 'Writing vents polyhedron.');

  await stream.write(
    `module ventsPoly () {\n
      ${polyhedron(polyhedra.vents.points, polyhedra.vents.faces, 4)}\n
    }\n`
  );

  console.log('[Render]', 'Writing inner polyhedron.');

  await stream.write(
    `module innerPoly () {\n
      ${polyhedron(polyhedra.inner.points, polyhedra.inner.faces, 2)}\n
    }\n`
  );

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

  // Declare defined objects

  await stream.write(
    `difference(){
      outerPoly();
      innerPoly();
      ventsPoly();
    `
  );

  for (let g = 0; g < n_fields; g += 1) {

    await stream.write(
      `multmatrix(m = ${ JSON.stringify(
        mat4FromNormal(polyhedra.holeCenters[g])
      )}){
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