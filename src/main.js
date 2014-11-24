var _ = require('lodash'),
    Peels = require('../../index.js'),
    THREE = require('three');

(function(){

  var s = new Peels({divisions: 4});

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 33, window.innerWidth / window.innerHeight, 0.1, 1000 );

  var pixelRatio = matchMedia('(-webkit-min-device-pixel-ratio: 2)').matches ? 2 : 1;

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth * pixelRatio, window.innerHeight * pixelRatio );

  var vnf = s.toCG();
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

  var material = new THREE.MeshBasicMaterial({
    color: 0xc6c2b6,
    wireframe: true
  });

  var sphere = new THREE.Mesh( geometry, material );
  scene.add( sphere );

  camera.position.z = 5;

  var render = function () {
    requestAnimationFrame(render);

    sphere.rotation.x += 0.002;
    sphere.rotation.y += 0.001;
    sphere.rotation.z += 0.001;

    renderer.render(scene, camera);
  };

  document.addEventListener('DOMContentLoaded', function(e){
    document.body.appendChild( renderer.domElement );
    render();
  });

}());