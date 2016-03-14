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

var centroid    = require('./positions').centroid,
    toCartesian = require('./positions').toCartesian;

function _interfieldTriangles(sphere) {

  var n         = sphere._Fields.length,
      triangles = new Uint32Array((2 * n - 4) * 3);

  for (let f = 0; f < n; f += 1) {

    let field = sphere._Fields[f];

    if (f > 1) { // not North or South

      var n1i = field._adjacentFields[0]._i,
          n2i = field._adjacentFields[1]._i,
          n3i = field._adjacentFields[2]._i,
          f1  = f * 2 - 4,
          f2  = f * 2 - 3;

      triangles[f1 * 3 + 0] = n2i;
      triangles[f1 * 3 + 1] = n1i;
      triangles[f1 * 3 + 2] = f;

      triangles[f2 * 3 + 0] = n3i;
      triangles[f2 * 3 + 1] = n2i;
      triangles[f2 * 3 + 2] = f;

    }

  }

  return triangles;

}

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
      indices   = _interfieldTriangles(sphere),
      colors    = new Float32Array(indices.length * 3);

  for (let f = 0; f < sphere._Fields.length; f += 1) {

    let field = sphere._Fields[f],
        fxyz = toCartesian(field.position),
        color = options.colorFn.call(field);

    positions[f * 3 + 0] = fxyz.x;
    positions[f * 3 + 1] = fxyz.y;
    positions[f * 3 + 2] = fxyz.z;

    colors[f * 3 + 0] = color.r;
    colors[f * 3 + 1] = color.g;
    colors[f * 3 + 2] = color.b;

  }

  if (done) done.call(null, null, {
    positions,
    indices,
    colors
  });

}

function _faceIndex(faces, i, a1, a2) {

  var f1 = i * 2 - 4,
      f2 = i * 2 - 3;

  if (
    (faces[f1 * 3 + 1] === a1 || faces[f1 * 3 + 1] === a2) &&
    (faces[f1 * 3 + 0] === a1 || faces[f1 * 3 + 0] === a2)
  ) {
    return f1;
  }

  if (
    (faces[f2 * 3 + 1] === a1 || faces[f2 * 3 + 1] === a2) &&
    (faces[f2 * 3 + 0] === a1 || faces[f2 * 3 + 0] === a2)
  ) {
    return f2;
  }

  return -1;

}

function _getFaceIndex(faces, fi1, fi2, fi3) {

  var c;

  c = _faceIndex(faces, fi1, fi2, fi3);

  if (c >= 0) return c;

  c = _faceIndex(faces, fi2, fi1, fi3);

  if (c >= 0) return c;

  c = _faceIndex(faces, fi3, fi1, fi2);

  if (c >= 0) return c;

  throw new Error('Could not find face index for triangle.');

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

  // TODO: implement colors

  // TODO: in order to implement colors correctly, vertices will need to be duplicated
  // so that each poly has its own set

  // counter-clockwise face-vertex orders

  const PENT_FACES    = [0, 2, 1, /**/ 0, 4, 2, /**/ 4, 3, 2],
        HEX_FACES     = [0, 2, 1, /**/ 0, 3, 2, /**/ 0, 5, 3, /**/ 5, 4, 3],

        // clockwise face-vertex orders

        PENT_FACES_CW = [1, 2, 0, /**/ 2, 4, 0, /**/ 2, 3, 4],
        HEX_FACES_CW  = [1, 2, 0, /**/ 2, 3, 0, /**/ 3, 5, 0, /**/ 3, 4, 5];


  var interfieldTriangles = _interfieldTriangles(sphere),
      nPolyEdgeVerts      = interfieldTriangles.length / 3,
      nPolys              = sphere._Fields.length,
      nTriangles          = nPolys * 4 - 12; // 4 triangles to each hexagon, 3 to each pentagon of which there are 12.

  var indices   = new Uint32Array(nTriangles * 3),
      positions = new Float32Array(nPolyEdgeVerts * 3),
      colors    = new Float32Array(nTriangles * 3 * 3);

  for (let i = 0; i < nPolyEdgeVerts * 3; i += 3) {

    let xyz = toCartesian(
      centroid(
        sphere._Fields[interfieldTriangles[i + 0]].position,
        sphere._Fields[interfieldTriangles[i + 1]].position,
        sphere._Fields[interfieldTriangles[i + 2]].position
      )
    );

    positions[i + 0] = xyz.x;
    positions[i + 1] = xyz.y;
    positions[i + 2] = xyz.z;

  }

  var c = 0;

  for (let f = 0; f < nPolys; f += 1) {

    let field          = sphere._Fields[f],
        sides          = field._adjacentFields.length,
        color          = options.colorFn.call(field),
        polyPosIndices = [];

    for (let i = 0; i < sides; i += 1) {

      let a1 = field.adjacent(i)._i,
          a2 = field.adjacent((i + sides + 1) % sides)._i;

      polyPosIndices.push(
        _getFaceIndex(interfieldTriangles, field._i, a1, a2)
      );

    }

    let faces;

    if (field._i === 1) {
      // The southernmost field needs clockwise faces
      faces = PENT_FACES_CW;
    } else {
      faces = sides === 5 ? PENT_FACES : HEX_FACES;
    }

    for (let v = 0; v < faces.length; v += 1) {

      indices[c] = polyPosIndices[faces[v]];

      colors[c * 3 + 0] = color.r;
      colors[c * 3 + 1] = color.g;
      colors[c * 3 + 2] = color.b;

      c++;

    }

  }

  done.call(null, null, {
    positions,
    indices,
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