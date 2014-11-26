(function(){

  var _ = require('lodash'),
      THREE = require('three');

  module.exports = function(Sphere, opts){

    var vfa = Sphere.toCG(opts);

    var geometry = new THREE.Geometry();

    _.each(vfa.vertices, function(vertex){
      geometry.vertices.push(
        new THREE.Vector3(vertex.x, vertex.y, vertex.z)
      );
    });

    _.each(vfa.faces, function(face){
      var triangle = new THREE.Face3(face[0], face[1], face[2]);
      triangle.vertexColors[0] = new THREE.Color(vfa.aux[face[0]]);
      triangle.vertexColors[1] = new THREE.Color(vfa.aux[face[1]]);
      triangle.vertexColors[2] = new THREE.Color(vfa.aux[face[2]]);
      geometry.faces.push(triangle);
    });

    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    return geometry;
  }

}());