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

const cos = Math.cos,
      sin = Math.sin;

var centroid = require('./positions').centroid,
    toCartesian = require('./positions').toCartesian;

/**
 * Creates edges **between field barycenters** and returns an array of vertices
 * and a corresponding array of faces to use in three.js. Bear in mind, this is
 * not necessarily the most accurate representation of the model.
 *
 * @param sphere
 * @param [options]
 * @param done
 */
function barycenterVerticesAndFaces (sphere, options, done){

  var opts = options || {},
      colorFn = opts.colorFn;

  var INCLUDE_COLORS = !!colorFn && colorFn.constructor.name === 'Function';

  var vertices = [],
      faces = [],
      colors = [];

  sphere.iterate(

    function(doneField){

      var n0i = this._i;

      vertices[n0i] = toCartesian(this.position);

      if(INCLUDE_COLORS) colors[n0i] = colorFn.call(this, this.data, this._pos, this._sxy);

      if(n0i > 1){ // not North or South

        var n1i = this._adjacentFields[0]._i,
            n2i = this._adjacentFields[1]._i,
            n3i = this._adjacentFields[2]._i,
            f1 = n0i * 2 - 4,
            f2 = n0i * 2 - 3;

        faces[f1] = [n2i, n1i, n0i];
        faces[f2] = [n3i, n2i, n0i];

      }

      doneField();
    },

    function(){

      sphere._geometryMap = geometryMap;

      var result = {
        vertices: vertices,
        faces: faces
      };

      if(INCLUDE_COLORS) result.colors = colors;

      if(done) done.call(null, null, result);

    }

  );

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
function fieldVerticesAndFaces (sphere, options, done){

  barycenterVerticesAndFaces(sphere, options, (err, bvfc) => {

    var centroids = [];

    bvfc.faces.forEach((face, f)=>{

      centroids[f] = toCartesian(
        centroid(
          sphere._Fields[ face[0] ].position,
          sphere._Fields[ face[1] ].position,
          sphere._Fields[ face[2] ].position
        )
      )

    });

    bvfc.centroids = centroids;

    done.call(null, null, bvfc);

  });

}

function getVerticesAndFaces (options, done){
  // will route to different algorithms depending on options, but only does barycenter technique for now.
  switch(options.type){
    case 'fields':
      return fieldVerticesAndFaces(this, options, done);
      break;
    case 'barycenters':
    default:
      return barycenterVerticesAndFaces(this, options, done);
      break;
  }
}

module.exports = getVerticesAndFaces;