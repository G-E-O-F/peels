(function(){

  var _ = require('lodash'),
      THREE = require('three');

  module.exports = function(Sphere){

    var vnf = Sphere.toCG();

    var geometry = new THREE.Geometry();

    _.each(vnf.vertices, function(vertex){
      geometry.vertices.push(
        new THREE.Vector3(vertex.x, vertex.y, vertex.z)
      );
    });

    _.each(vnf.faces, function(face){
      geometry.faces.push(
        new THREE.Face3(face[0], face[1], face[2])
      );
    });

    return geometry;
  }

}());