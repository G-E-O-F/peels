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

    _.each(vfc.faces, function(face){
      var triangle = new THREE.Face3(face[0], face[1], face[2]);
      triangle.vertexColors[0] = new THREE.Color(vfc.colors[face[0]]);
      triangle.vertexColors[1] = new THREE.Color(vfc.colors[face[1]]);
      triangle.vertexColors[2] = new THREE.Color(vfc.colors[face[2]]);
      geometry.faces.push(triangle);
    });

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    return geometry;
  }

}());