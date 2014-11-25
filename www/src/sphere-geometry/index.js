(function(){

  var _ = require('lodash'),
      THREE = require('three'),
      color = require('color');

  module.exports = function(Sphere){

    var vfa = Sphere.toCG({
      colorFn: function(data, pos, sxy){
        var color;
        if(sxy === 'NORTH' || sxy === 'SOUTH'){
          color = 'black';
        }else{
          switch(sxy[0]){
            case 0:
              color = '#DC3023';
              break;
            case 1:
              color = '#FFA631';
              break;
            case 2:
              color = '#5B8930';
              break;
            case 3:
              color = '#317589';
              break;
            case 4:
              color = '#8F4155';
              break;
            default:
              color = 'white';
              break;
          }
        }
        return color;
      }
    });

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