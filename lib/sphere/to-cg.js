'use strict';

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

var toCartesian = require('./positions').toCartesian,
    intArr = require('./int-arr');

/**
 * Creates edges **between field barycenters** and returns an array of vertices
 * and a corresponding array of faces to use in three.js. Bear in mind, this is
 * not necessarily the most accurate representation of the model.
 *
 * @param sphere
 * @param [options]
 * @param done
 */
function barycenterVerticesAndFaces(sphere, options, done) {

  var n         = sphere._Fields.length,
      positions = new Float32Array(n * 3),
      indices   = sphere.interfieldTriangles,
      colors    = new Float32Array(indices.length * 3);

  for (let f = 0; f < sphere._Fields.length; f += 1) {

    let field = sphere._Fields[f],
        fxyz  = toCartesian(field.position, 1),
        color = options.colorFn.call(field);

    positions[f * 3 + 0] = fxyz.x;
    positions[f * 3 + 1] = fxyz.y;
    positions[f * 3 + 2] = fxyz.z;

    colors[f * 3 + 0] = color.r;
    colors[f * 3 + 1] = color.g;
    colors[f * 3 + 2] = color.b;

  }

  // normals are exactly positions, as long as radius is 1
  var normals = positions.slice(0);

  if (done) done.call(null, null, {
    positions,
    normals,
    indices,
    colors
  });

}

/**
 * Creates edges between actual fields and returns an array of vertices and a
 * corresponding array of faces to use in three.js. This representation of the
 * model is popularly depicted in the reference materials.
 *
 * @param sphere
 * @param options
 * @param done
 */
function fieldVerticesAndFaces(sphere, options, done) {

  // counter-clockwise face-vertex orders

  const PENT_FACES = [0, 2, 1, /**/ 0, 4, 2, /**/ 4, 3, 2],
        HEX_FACES  = [0, 2, 1, /**/ 0, 3, 2, /**/ 0, 5, 3, /**/ 5, 4, 3];

  var interfieldTriangles = sphere.interfieldTriangles,
      nPolyEdgeVerts      = interfieldTriangles.length / 3,
      nPolys              = sphere._Fields.length;

  var nDistinctVertices = nPolys * 6 - 12, // 6 vertices for each poly (-12 vertices for the 12 pentagons)
      nTriangles        = nPolys * 4 - 12; // 4 triangles to each hexagon, 3 to each pentagon of which there are 12.

  // support maps
  var fieldPosMap      = intArr(nDistinctVertices, nPolys),
      indexedPositions = new Float32Array(nPolyEdgeVerts * 3);

  // maps for the GPU
  var indices   = intArr(nDistinctVertices, nTriangles * 3),
      positions = new Float32Array(nDistinctVertices * 3),
      normals   = new Float32Array(nDistinctVertices * 3),
      colors    = new Float32Array(nDistinctVertices * 3);

  // populate the cartesian coordinates of positions

  for (let v = 0; v < nPolyEdgeVerts; v += 1) {

    let xyz = toCartesian({
      φ: sphere.interfieldCentroids[2 * v + 0],
      λ: sphere.interfieldCentroids[2 * v + 1]
    });

    indexedPositions[3 * v + 0] = xyz.x;
    indexedPositions[3 * v + 1] = xyz.y;
    indexedPositions[3 * v + 2] = xyz.z;

  }

  var c = 0, t = 0;

  for (let f = 0; f < nPolys; f += 1) {

    let field          = sphere._Fields[f],
        sides          = field._adjacentFields.length,
        color          = options.colorFn.call(field),
        normal         = toCartesian(field.position, 1),
        polyPosIndices = [];

    fieldPosMap[f] = c;

    for (let s = 0; s < sides; s += 1) {

      let cc = (c + s),
          fi = sphere.interfieldIndices[ 6 * f + s ];

      polyPosIndices.push(fi);

      positions[cc * 3 + 0] = indexedPositions[fi * 3 + 0];
      positions[cc * 3 + 1] = indexedPositions[fi * 3 + 1];
      positions[cc * 3 + 2] = indexedPositions[fi * 3 + 2];

      colors[cc * 3 + 0] = color.r;
      colors[cc * 3 + 1] = color.g;
      colors[cc * 3 + 2] = color.b;

      normals[cc * 3 + 0] = normal.x;
      normals[cc * 3 + 1] = normal.y;
      normals[cc * 3 + 2] = normal.z;

    }

    let faces = sides === 5 ? PENT_FACES : HEX_FACES;

    for (let v = 0; v < faces.length; v += 1) {

      let tt = (t + v);

      indices[tt] = c + faces[v];

    }

    c += sides;
    t += faces.length;

  }

  done.call(null, null, {
    positions,
    indices,
    normals,
    colors
  });

}

function getVerticesAndFaces(options, done) {
  // will route to different algorithms depending on options, but only does barycenter technique for now.
  switch (options.type) {
    case 'poly-per-field':
      return fieldVerticesAndFaces(this, options, done);
      break;
    case 'vertex-per-field':
    default:
      return barycenterVerticesAndFaces(this, options, done);
      break;
  }
}

module.exports = getVerticesAndFaces;