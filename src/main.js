(function(){

  var _ = require('lodash'),
      Peels = require('../../index.js'),
      THREE = require('three'),
      color = require('color'),
      sphereGeometry = require('./sphere-geometry');

  var π = Math.PI;

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

  var ce = color('#86ABA5'),
      cp = color('#003171');

  var colorEqP = function(blend){
    var cr = color();
    cr.red( ce.red() * (1 - blend) + cp.red() * blend );
    cr.green( ce.green() * (1 - blend) + cp.green() * blend );
    cr.blue( ce.blue() * (1 - blend) + cp.blue() * blend );
    return cr.hexString();
  };

  var geometry = sphereGeometry(s, {
    colorFn: function(data, pos, sxy){
      var rφ = Math.min((Math.random() * π/30) + Math.abs(pos.φ), π/2),
        k = rφ / (π/2);
      return colorEqP(Math.pow(k, 1.7));
    }
  });

  var material = new THREE.MeshPhongMaterial({
    shading: THREE.SmoothShading,
    vertexColors: THREE.VertexColors
  });

  var sphere = new THREE.Mesh( geometry, material );
  sphere.rotation.x += π/2;
  scene.add( sphere );

  camera.position.z = 5;

  var renderSize = function(){
    renderer.setSize( window.innerWidth * pixelRatio, window.innerHeight * pixelRatio );

    camera.aspect = (window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();

  }; renderSize();

  var radpm = -2 * (2*π);

  var render = function () {
    sphere.rotation.z = radpm * (Date.now() % 60e3) / 60e3;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  document.addEventListener('DOMContentLoaded', function(e){
    document.body.appendChild( renderer.domElement );
    render();
  });

  window.addEventListener('resize', _.debounce(renderSize, 200));

}());