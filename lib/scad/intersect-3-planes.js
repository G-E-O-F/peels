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

const {Vec3} = require('pex-math');

function intersect2Planes(p1, p2){

  // Vector   u = Pn1.n * Pn2.n;          // cross product
  // float    ax = (u.x >= 0 ? u.x : -u.x);
  // float    ay = (u.y >= 0 ? u.y : -u.y);
  // float    az = (u.z >= 0 ? u.z : -u.z);

  var u = Vec3.cross(Vec3.copy(p1[1]), p2[1]);

  var ax = (u[0] >= 0 ? u[0] : -u[0]),
      ay = (u[1] >= 0 ? u[1] : -u[1]),
      az = (u[2] >= 0 ? u[2] : -u[2]);

  // Pn1 and Pn2 intersect in a line
  // first determine max abs coordinate of cross product

  var maxc;                       // max coordinate
  if (ax > ay) {
    if (ax > az)
      maxc = 1;
    else maxc = 3;
  }
  else {
    if (ay > az)
      maxc = 2;
    else maxc = 3;
  }

  // // next, to get a point on the intersect line
  // // zero the max coord, and solve for the other two
  // Point    iP;                // intersect point
  // float    d1, d2;            // the constants in the 2 plane equations

  var iP = Vec3.create(),
      d1, d2;

  // d1 = -dot(Pn1.n, Pn1.V0);  // note: could be pre-stored  with plane
  // d2 = -dot(Pn2.n, Pn2.V0);  // ditto

  d1 = -Vec3.dot(p1[1], p1[0]);
  d2 = -Vec3.dot(p2[1], p2[0]);

  switch (maxc) {             // select max coordinate
    case 1:                     // intersect with x=0
      iP[0] = 0;
      iP[1] = (d2*p1[1][2] - d1*p2[1][2]) /  u[0];
      iP[2] = (d1*p2[1][1] - d2*p1[1][1]) /  u[0];
      break;
    case 2:                     // intersect with y=0
      iP[0] = (d1*p2[1][2] - d2*p1[1][2]) /  u[1];
      iP[1] = 0;
      iP[2] = (d2*p1[1][0] - d1*p2[1][0]) /  u[1];
      break;
    case 3:                     // intersect with z=0
      iP[0] = (d2*p1[1][1] - d1*p2[1][1]) /  u[2];
      iP[1] = (d1*p2[1][0] - d2*p1[1][0]) /  u[2];
      iP[2] = 0;
  }

  // L->P0 = iP;
  // L->P1 = iP + u;
  // return 2;

  return [
    iP,
    Vec3.add(u, iP)
  ];

}

function intersectSegmentPlane(s1, p1){

//   Vector    u = S.P1 - S.P0;
//   Vector    w = S.P0 - Pn.V0;
//
//   float     D = dot(Pn.n, u);
//   float     N = -dot(Pn.n, w);

  var u = Vec3.sub( Vec3.copy(s1[1]), s1[0] ),
      w = Vec3.sub( Vec3.copy(s1[0]), p1[0] );

  var D = Vec3.dot( Vec3.copy(p1[1]), u ),
      N = -Vec3.dot( Vec3.copy(p1[1]), w );

//   // they are not parallel
//   // compute intersect param
//   float sI = N / D;

  var sI = N / D;

//   if (sI < 0 || sI > 1)
//     return 0;                        // no intersection
//
//   *I = S.P0 + sI * u;                  // compute segment intersect point
//   return 1;

  return Vec3.add(s1[0], Vec3.scale(u, sI));

}

module.exports = function intersect3Planes(p1, p2, p3) {

  return intersectSegmentPlane(
    intersect2Planes(p1, p2),
    p3
  );

};