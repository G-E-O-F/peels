(function(){

  var _ = require('lodash');

  var cos = Math.cos,
      sin = Math.sin;

  /**
   * Maps Peels indexes to a flat array without gaps.
   * Indexes 0 and 1 are reserved for North and South respectively.
   *
   * @param {number} d - number of divisions in the sphere
   * @param {number|string} s - section index or 'NORTH' or 'SOUTH'
   * @param {number} x - x index in section
   * @param {number} y - y index in section
   * @returns {number} index
   */
  var linearIndex = function(d, s, x, y){
    if(s === 'NORTH'){
      return 0;
    }else
    if(s === 'SOUTH'){
      return 1;
    }else{
      return (s * d * d * 2) + (x * d) + (y) + 2;
    }
  };

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

    var cartesianPos = {
      x: r * cos(sphericalPos.φ) * cos(sphericalPos.λ),
      y: r * cos(sphericalPos.φ) * sin(sphericalPos.λ),
      z: r * sin(sphericalPos.φ)
    };

    return cartesianPos;

  };

  /**
   * Creates edges **between field barycenters** and returns an array of vertices
   * and a corresponding array of faces to use in three.js. Bear in mind, this is
   * not necessarily the most accurate representation of the model.
   *
   * @param Sphere
   * @param [options]
   */
  var barycenterVerticesAndFaces = function(Sphere, options){

    var opts = options || {},
        colorFn = opts.colorFn || function(){};

    var d = Sphere._divisions,
        vertices = [],
        faces = [],
        aux = [];

    vertices[0] = toCartesian(Sphere._North._pos);
    vertices[1] = toCartesian(Sphere._South._pos);
    aux[0] = colorFn.call(Sphere._North, Sphere._North.data, Sphere._North.pos, Sphere._North._sxy);
    aux[1] = colorFn.call(Sphere._South, Sphere._South.data, Sphere._South.pos, Sphere._South._sxy);

    _.each(Sphere._Fields, function(section, s){
      _.each(section, function(column, x){
        _.each(column, function(field, y){
          // for each field, first add its vertex
          var n0i = linearIndex(d, s, x, y);
          vertices[n0i] = toCartesian(field._pos);
          aux[n0i] = colorFn.call(field, field.data, field._pos, field._sxy);

          // each field is also responsible for 2 triangles forming a rhombus between itself and its first 3 neighbors
          var n1i = linearIndex.apply(null, [d].concat(field._adjacentFields[0]._sxy)),
              n2i = linearIndex.apply(null, [d].concat(field._adjacentFields[1]._sxy)),
              n3i = linearIndex.apply(null, [d].concat(field._adjacentFields[2]._sxy));
          faces.push([n0i, n1i, n2i], [n0i, n2i, n3i]);
        });
      });
    });

    return {
      vertices: vertices,
      faces: faces,
      aux: aux
    }

  };

  var getVerticesAndFaces = function(Sphere, options){
    // will route to different algorithms depending on options, but only does barycenter technique for now.
    return barycenterVerticesAndFaces(Sphere, options);
  };

  module.exports = {
    getVerticesAndFaces: getVerticesAndFaces
  };

}());