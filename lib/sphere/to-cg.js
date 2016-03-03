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

  var _ = require('underscore');

  var cos = Math.cos,
      sin = Math.sin;

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
  var toCartesian = function(sphericalPos, radius){

    var r = radius || 1;

    return {
      x: r * cos(sphericalPos.φ) * cos(sphericalPos.λ),
      z: r * cos(sphericalPos.φ) * sin(sphericalPos.λ),
      y: r * sin(sphericalPos.φ)
    };

  };

  var addToMap = function(faceMap, i, fi, v){
    if(!_.isObject(faceMap[i])) {
      faceMap[i] = {};
    }
    faceMap[i][fi] = v;
  };

  /**
   * Creates edges **between field barycenters** and returns an array of vertices
   * and a corresponding array of faces to use in three.js. Bear in mind, this is
   * not necessarily the most accurate representation of the model.
   *
   * @param sphere
   * @param [options]
   */
  var barycenterVerticesAndFaces = function(sphere, options, done){

    var opts = options || {},
        colorFn = opts.colorFn;

    var INCLUDE_COLORS = _.isFunction(colorFn);

    var vertices = [],
        faces = [],
        colors = [],
        geometryMap = [];

    sphere.iterate(

      function(doneField){

        var n0i = sphere.linearIndex(this._sxy);

        vertices[n0i] = toCartesian(this._pos);

        if(INCLUDE_COLORS) colors[n0i] = colorFn.call(this, this.data, this._pos, this._sxy);

        if(n0i > 1){ // not North or South

          var n1i = sphere.linearIndex(this._adjacentFields[0]._sxy),
              n2i = sphere.linearIndex(this._adjacentFields[1]._sxy),
              n3i = sphere.linearIndex(this._adjacentFields[2]._sxy),
              f1 = n0i * 2 - 4,
              f2 = n0i * 2 - 3;

          faces[f1] = [n0i, n1i, n2i];
          faces[f2] = [n0i, n2i, n3i];

          addToMap(geometryMap, n0i, f1, 0);
          addToMap(geometryMap, n1i, f1, 1);
          addToMap(geometryMap, n2i, f1, 2);
          addToMap(geometryMap, n0i, f2, 0);
          addToMap(geometryMap, n2i, f2, 1);
          addToMap(geometryMap, n3i, f2, 2);

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

        done.call(null, null, result);

      }

    );

  };

  /**
   * Creates edges between actual fields and returns an array of vertices and a
   * corresponding array of faces to use in three.js. This representation of the
   * model is popularly depicted in the reference materials.
   *
   * @param sphere
   * @param options
   */
  var fieldVerticesAndFaces = function(sphere, options, done){

    barycenterVerticesAndFaces(sphere, options, function(err, bvfc){

      debugger;

    });

  };

  var getVerticesAndFaces = function(sphere, options, done){
    // will route to different algorithms depending on options, but only does barycenter technique for now.
    switch(options.type){
      case 'fields':
        return fieldVerticesAndFaces(sphere, options, done);
        break;
      case 'barycenters':
      default:
        return barycenterVerticesAndFaces(sphere, options, done);
        break;
    }
  };

  module.exports = {
    getVerticesAndFaces: getVerticesAndFaces
  };

}());