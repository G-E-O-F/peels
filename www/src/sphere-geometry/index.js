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

  var _ = require('lodash'),
      THREE = require('three');

  module.exports = function(Sphere, opts){

    var vfc = Sphere.toCG(opts);

    var geometry = new THREE.Geometry();

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

    // color assignment test pattern for {divisions: 8}:
    //  Sphere.assignColor(Sphere._Fields[0][2][2],  new THREE.Color(1, 1, 1));
    //  Sphere.assignColor(Sphere._Fields[1][7][0],  new THREE.Color(1, 0, 0));
    //  Sphere.assignColor(Sphere._Fields[1][15][0], new THREE.Color(1, 0, 0));
    //  Sphere.assignColor(Sphere._Fields[2][0][7],  new THREE.Color(1, 0, 1));
    //  Sphere.assignColor(Sphere._Fields[2][7][7],  new THREE.Color(1, 0, 1));
    //  Sphere.assignColor(Sphere._Fields[2][8][7],  new THREE.Color(1, 0, 1));

    return geometry;
  }

}());