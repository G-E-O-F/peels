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

'use strict';

const PEELS = 5;

/**
 * ONLY USES VALUES IN RADIANS.
 * LONGITUDE AND LATITUDE ARE LIKE EARTH'S.
 * YOU HAVE BEEN WARNED.
 */

const π     = Math.PI,
      acos  = Math.acos,
      asin  = Math.asin,
      atan2 = Math.atan2,
      cos   = Math.cos,
      sin   = Math.sin,
      sqrt  = Math.sqrt;

// L is the spherical arclength of the edges of the icosahedron.
const L = acos(Math.sqrt(5) / 5);

/**
 * Returns a set of cartesian coordinates for a set of spherical coordinates and a radius.
 *
 * @param {object} sphericalPos
 * @param {number} sphericalPos.φ - latitude in radians
 * @param {number} sphericalPos.λ - longitude in radians
 *
 * @param {number} [radius] - radius of the sphere (unit sphere, i.e. 1, is default)
 *
 * @returns {object} cartesianPos
 * @returns {number} cartesianPos.x - position's distance from origin along x axis in radius's units
 * @returns {number} cartesianPos.y - position's distance from origin along y axis in radius's units
 * @returns {number} cartesianPos.z - position's distance from origin along z axis in radius's units
 */
function toCartesian(sphericalPos, radius) {

  var r = radius || 1;

  return {
    x: r * cos(sphericalPos.φ) * cos(sphericalPos.λ),
    z: r * cos(sphericalPos.φ) * sin(sphericalPos.λ),
    y: r * sin(sphericalPos.φ)
  };

}

/**
 * Returns a set of spherical coordinates from a set of cartesian coordinates.
 *
 * @param {object} cartesianPos
 * @param {number} cartesianPos.x - position's distance from origin along x axis in radius's units
 * @param {number} cartesianPos.y - position's distance from origin along y axis in radius's units
 * @param {number} cartesianPos.z - position's distance from origin along z axis in radius's units
 *
 * @returns {object} sphericalPos
 * @returns {number} sphericalPos.φ - latitude in radians
 * @returns {number} sphericalPos.λ - longitude in radians
 * @returns {number} sphericalPos.r - distance from the origin
 */
function toSpherical(cartesianPos) {

  var x = cartesianPos.x,
      y = cartesianPos.y,
      z = cartesianPos.z;

  var r = sqrt(
    x * x + y * y + z * z
  );

  return {
    r: r,
    φ: asin(y / r),
    λ: atan2(z, x)
  };

}

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
function distance(pos1, pos2) {
  return 2 * asin(sqrt(Math.pow(sin((pos1.φ - pos2.φ) / 2), 2) + cos(pos1.φ) * cos(pos2.φ) * Math.pow(sin((pos1.λ - pos2.λ) / 2), 2)));
}

/**
 * Returns the course between two positions.
 *
 * @param {object} pos1
 * @param {number} pos1.φ - first latitude in radians
 * @param {number} pos1.λ - first longitude in radians
 *
 * @param {object} pos2
 * @param {number} pos2.φ - second latitude in radians
 * @param {number} pos2.λ - second longitude in radians
 *
 * @returns {object} course
 * @returns {number} course.a - the heading at pos1 in radians clockwise from the local meridian
 * @returns {number} course.d - the distance traveled
 */
function course(pos1, pos2) {
  var d = distance(pos1, pos2), a, course = {};

  if (sin(pos2.λ - pos1.λ) < 0) {
    a = acos((sin(pos2.φ) - sin(pos1.φ) * cos(d)) / (sin(d) * cos(pos1.φ)));
  } else {
    a = 2 * π - acos((sin(pos2.φ) - sin(pos1.φ) * cos(d)) / (sin(d) * cos(pos1.φ)));
  }

  course.d = d;
  course.a = a;

  return course;
}

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
function midpoint(pos1, pos2) {
  var Bx = Math.cos(pos2.φ) * Math.cos(pos2.λ - pos1.λ);
  var By = Math.cos(pos2.φ) * Math.sin(pos2.λ - pos1.λ);

  return {
    φ: atan2(sin(pos1.φ) + sin(pos2.φ),
      sqrt((cos(pos1.φ) + Bx) * (cos(pos1.φ) + Bx) + By * By)),
    λ: pos1.λ + atan2(By, cos(pos1.φ) + Bx)
  };
}

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
function interpolate(pos1, pos2, d) {

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
      φ: atan2(z, sqrt(Math.pow(x, 2) + Math.pow(y, 2))),
      λ: atan2(y, x)
    });
  }

  return points;
}

/**
 * Given three positions as points of a triangle, returns the center point of that triangle.
 *
 * @params pos…
 * @returns {{φ: Number, λ: Number}}
 */

// TODO: determine how to test this

const XYZ = ['x', 'y', 'z'];

function centroid() {

  var sum    = {
        x: 0,
        y: 0,
        z: 0
      },
      center = {};

  for (let i = 0; i < arguments.length; i += 1) {
    let xyz = toCartesian(arguments[i]);
    XYZ.forEach((ax)=> {
      sum[ax] += xyz[ax]
    });
  }

  XYZ.forEach((ax)=> {
    center[ax] = sum[ax] / arguments.length;
  });

  var boundingSphereCenter = toSpherical(center);

  return {
    φ: boundingSphereCenter.φ,
    λ: boundingSphereCenter.λ
  };

}

/**
 * Sets the barycenter position of every field on a Sphere.
 * @param sphere
 */
function populatePositions(sphere) {

  var d   = sphere._divisions,
      max = {
        x: 2 * d - 1,
        y: d - 1
      },
      u   = L / d;

  // determine position for polar and tropical vertices using only arithmetic.

  sphere.get('SOUTH').position = {λ: 0, φ: π / -2};
  sphere.get('NORTH').position = {λ: 0, φ: π / 2};

  for (let s = 0; s < PEELS; s += 1) {

    var λNorth = s * 2 / 5 * π,
        λSouth = s * 2 / 5 * π + π / 5;

    sphere.get(s, d - 1, 0).position = {λ: λNorth, φ: π / 2 - L};
    sphere.get(s, max.x, 0).position = {λ: λSouth, φ: π / -2 + L};

  }

  // determine positions for the fields along the edges using arc interpolation.

  if ((d - 1) > 0) {
    // d must be at least 2 for there to be fields between vertices.

    for (let s = 0; s < PEELS; s += 1) {
      var p = (s + 4) % 5;

      var snP = sphere.get('NORTH'),
          ssP = sphere.get('SOUTH'),
          cnT = sphere.get(s, d - 1, 0),
          pnT = sphere.get(p, d - 1, 0),
          csT = sphere.get(s, max.x, 0),
          psT = sphere.get(p, max.x, 0);

      var snP2cnT = interpolate(snP.position, cnT.position, d), //npcn: north pole to current north tropical pentagon
          cnT2pnT = interpolate(cnT.position, pnT.position, d), //ntpn: current north tropical pentagon to previous north tropical pentagon
          cnT2psT = interpolate(cnT.position, psT.position, d), //ntps: current north tropical pentagon to previous south tropical pentagon
          cnT2csT = interpolate(cnT.position, csT.position, d), //ntst: current north tropical pentagon to current south tropical pentagon
          csT2psT = interpolate(csT.position, psT.position, d), //stps: current south tropical pentagon to previous south tropical pentagon
          csT2ssP = interpolate(csT.position, ssP.position, d); //stsp: current south tropical pentagon to south pole

      for (var i = 1; i < d; i += 1) {
        var npcn = sphere.get(s, i - 1, 0),
            ntpn = sphere.get(s, d - 1 - i, i),
            ntps = sphere.get(s, d - 1, i),
            ntst = sphere.get(s, d - 1 + i, 0),
            stps = sphere.get(s, max.x - i, i),
            stsp = sphere.get(s, max.x, i);

        npcn.position = snP2cnT[i - 1];
        ntpn.position = cnT2pnT[i - 1];
        ntps.position = cnT2psT[i - 1];
        ntst.position = cnT2csT[i - 1];
        stps.position = csT2psT[i - 1];
        stsp.position = csT2ssP[i - 1];
      }
    }

  }

  // determine positions for fields between edges using interpolation.

  if ((d - 2) > 0) {
    // d must be at least 3 for there to be fields not along edges.

    for (let s = 0; s < PEELS; s += 1) {

      for (let x = 0; x < d * 2; x += 1) {

        // for each column, fill in values for fields between edge fields,
        // whose positions were defined in the previous block.

        if ((x + 1) % d > 0) {
          // ignore the columns that are edges.

          var j  = d - ((x + 1) % d), // the y index of the field in this column that is along a diagonal edge
              n1 = j - 1, // the number of unpositioned fields before j
              n2 = d - 1 - j, // the number of unpositioned fields after j
              f1 = sphere.get(s, x, 0), // the field along the early edge
              f2 = sphere.get(s, x, j), // the field along the diagonal edge
              f3 = sphere.get(s, x, d - 1)._adjacentFields[2]; // the field along the later edge, which will
          // necessarily belong to another section.

          // get interpolated positions for the two possible unpositioned segments.
          var series1 = interpolate(f1.position, f2.position, n1 + 1),
              series2 = interpolate(f2.position, f3.position, n2 + 1);

          // walk down the column, placing interpolation results as we go.
          for (var y = 1; y < d; y += 1) {
            if (y < j) {
              sphere.get(s, x, y).position = series1[y - 1];
            }
            if (y > j) {
              sphere.get(s, x, y).position = series2[y - j - 1];
            }
          }

        }

      }

    }

  }

}

module.exports = {
  populate: populatePositions,
            toCartesian,
            centroid,
            midpoint,
            interpolate,
            course,
            distance
};