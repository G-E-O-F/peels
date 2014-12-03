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