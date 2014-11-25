(function(){

  var _ = require('lodash'),
      Peels = require('../../index.js'),
      THREE = require('three'),
      sphereGeometry = require('./sphere-geometry');

  var s = new Peels({divisions: 64});

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 33, 1, 0.1, 1000 );


  // Lighting

  scene.add( new THREE.AmbientLight( 0x97867C ) );
  scene.add( new THREE.HemisphereLight( 0xC6C2B6, 0x3A403B, .85 ) );

  // Renderer

  var pixelRatio = matchMedia('(-webkit-min-device-pixel-ratio: 2)').matches ? 2 : 1;

  var renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  var geometry = sphereGeometry(s);

  var material = new THREE.MeshPhongMaterial({
    shading: THREE.SmoothShading,
    vertexColors: THREE.VertexColors
  });

  var sphere = new THREE.Mesh( geometry, material );
  sphere.rotation.x += Math.PI/2;
  scene.add( sphere );

  camera.position.z = 5;

  var renderSize = function(){
    renderer.setSize( window.innerWidth * pixelRatio, window.innerHeight * pixelRatio );

    camera.aspect = (window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();

  }; renderSize();

  var render = function () {
    requestAnimationFrame(render);

    sphere.rotation.z -= 0.003;

    renderer.render(scene, camera);
  };

  document.addEventListener('DOMContentLoaded', function(e){
    document.body.appendChild( renderer.domElement );
    render();
  });

  window.addEventListener('resize', _.debounce(renderSize, 200));

}());