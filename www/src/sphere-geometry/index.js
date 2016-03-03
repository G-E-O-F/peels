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

(function(){

  var _ = require('underscore'),
      THREE = require('three');

  module.exports = function(Sphere, opts){

    var geometry = new THREE.Geometry();

    Sphere.toCG(opts, function(err, vfc){

      _.each(vfc.vertices, function(vertex){
        geometry.vertices.push(
          new THREE.Vector3(vertex.x, vertex.y, vertex.z)
        );
      });

      _.each(vfc.faces, function(face, fi){
        var triangle = new THREE.Face3(face[0], face[1], face[2]);
        triangle.vertexColors[0] = vfc.colors[face[0]];
        triangle.vertexColors[1] = vfc.colors[face[1]];
        triangle.vertexColors[2] = vfc.colors[face[2]];
        geometry.faces[fi] = triangle;
      });

      geometry.computeFaceNormals();
      geometry.computeVertexNormals();

      Sphere.bindGeometry(geometry, opts.colorFn);

      geometry.needsUpdate = true;
      geometry.verticesNeedUpdate = true;

    });

    return geometry;

  }

}());