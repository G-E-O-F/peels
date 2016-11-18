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

const up     = [0, 0, 1];

module.exports = function mat4FromNormal(normal, trans) {

  // z.subVectors( eye, target ).normalize();

  var y = Vec3.normalize(
    Vec3.sub(
      [0, 0, 0],
      normal
    )
  );

  // if ( z.lengthSq() === 0 ) {
  //
  //   z.z = 1;
  //
  // }

  if (Vec3.lengthSq(y) === 0) y[2] = 1;

  // x.crossVectors( up, z ).normalize();

  var x = Vec3.normalize(
    Vec3.cross(
      Vec3.copy(up),
      y
    )
  );

  // if ( x.lengthSq() === 0 ) {
  //
  //   z.z += 0.0001;
  //   x.crossVectors( up, z ).normalize();
  //
  // }

  if( Vec3.lengthSq(x) === 0 ) {
    y[2] += 0.0001;
    x = Vec3.normalize(
      Vec3.cross(
        Vec3.copy(up),
        y
      )
    );
  }

  // y.crossVectors( z, x );

  var z = Vec3.cross(
    Vec3.copy(y),
    x
  );

  return [
    [x[0], x[1], x[2], trans[0]],
    [y[0], y[1], y[2], trans[1]],
    [z[0], z[1], z[2], trans[2]],
    [0, 0, 0, 1]
  ];

};