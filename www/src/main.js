(function(){

  var _ = require('lodash'),
      Peels = require('../../index.js'),
      THREE = require('three'),
      mesh = require('./sphere-mesh');

  var s = new Peels({divisions: 32});

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 33, 1, 0.1, 1000 );

  var pixelRatio = matchMedia('(-webkit-min-device-pixel-ratio: 2)').matches ? 2 : 1;

  var renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  var geometry = mesh(s);

  var material = new THREE.MeshBasicMaterial({
    color: 0xc6c2b6,
    wireframe: true
  });

  var sphere = new THREE.Mesh( geometry, material );
  scene.add( sphere );

  camera.position.z = 5;

  var renderSize = function(){
    renderer.setSize( window.innerWidth * pixelRatio, window.innerHeight * pixelRatio );

    camera.aspect = (window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();

  }; renderSize();

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

  window.addEventListener('resize', _.debounce(renderSize, 200));

}());