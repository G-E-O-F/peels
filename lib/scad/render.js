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

const {cos, sin} = Math,
      polyhedron = require('./language/polyhedron'),
      fs = require('fs-promise');

const R = 1;

module.exports = async function(sphere, method, out){

  let stream = fs.createWriteStream(out);

  switch(method){
    case 'BASIC':
    default:

      // BASIC method

      let points = [],
          faces = [];

      // populate points with the cartesian coordinates for all inter-field centroids

      for(let v = 0; v < sphere._interfieldCentroids.length / 2; v ++){

        let c_φ = sphere._interfieldCentroids[2 * v + 0],
            c_λ = sphere._interfieldCentroids[2 * v + 1];

        points[v] = [
          R * cos(c_φ) * cos(c_λ),
          R * sin(c_φ),
          R * cos(c_φ) * sin(c_λ)
        ];

      }

      // populate faces with the indexes of the relevant centroids

      for(let f = 0; f < sphere._Fields.length; f++){

        let field          = sphere._Fields[f],
            sides          = field._adjacentFields.length;

        faces[f] = [];

        for (let s = 0; s < sides; s += 1) {

          let fi = sphere._interfieldIndices[6 * f + s];

          faces[f].push(fi);

        }

      }

      console.log('Writing polyhedron.');

      await stream.write(
        polyhedron(points, faces)
      );

      console.log('Closing stream.');

      stream.end();

      break;
  }

};