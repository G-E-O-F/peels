/*
 * Copyright (c) 2014 Will Shown. All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function(){

  var _ = require('lodash'),
      Sphere = require('../../index.js'),
      THREE = require('three'),
      color = require('color'),
      async = require('async'),
      sphereGeometry = require('./sphere-geometry');

  var π = Math.PI;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera( 33, 1, 0.1, 1000 );

  camera.position.z = 5;

  // Lighting

  scene.add( new THREE.AmbientLight( 0x97867C ) );
  scene.add( new THREE.HemisphereLight( 0xC6C2B6, 0x3A403B, .85 ) );

  // Renderer

  var pixelRatio = matchMedia('(-webkit-min-device-pixel-ratio: 2)').matches ? 2 : 1;

  var renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });

  var renderSize = function(){
    renderer.setSize( window.innerWidth * pixelRatio, window.innerHeight * pixelRatio );

    camera.aspect = (window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();

  }; renderSize();

  // Sphere

  var s = new Sphere({divisions: 12});

  var ce = color('#86ABA5'),
      cp = color('#003171');

  var colorBlend = function(blend){
    var cr = color();
    cr.red( ce.red() * (1 - blend) + cp.red() * blend );
    cr.green( ce.green() * (1 - blend) + cp.green() * blend );
    cr.blue( ce.blue() * (1 - blend) + cp.blue() * blend );
    return new THREE.Color(cr.hexString());
  };

  var colorFn = function(data, pos, sxy){
    var rφ = Math.min(Math.abs(pos.φ), π/2),
        k = rφ / (π/2);
    return colorBlend(Math.pow(k, (1.2 + data * .7 || 1.9)));
  };

  var geometry = sphereGeometry(s, { colorFn: colorFn });

  var material = new THREE.MeshPhongMaterial({
    shading: THREE.SmoothShading,
    vertexColors: THREE.VertexColors
  });

  var sphere = new THREE.Mesh( geometry, material );
  sphere.rotation.x -= π/2;
  scene.add( sphere );

  // DOM bindings and render loop

  var perField = function(done){
    this.data = Math.sin(2 * π * (Date.now() % 5e3) / 5e3);
    done();
  };

  var startLoop = function(){

    var iterNext = false,
        iterator = function(next){
          console.log('iterate');
          iterNext = false;
          s.iterate(perField, function(){
            iterNext = next;
          });
        };

    var radpm = -2 * (2*π);

    var render = function () {
      sphere.rotation.z = radpm * (Date.now() % 60e3) / 60e3;
      renderer.render(scene, camera);
      requestAnimationFrame(function(){
        render.call(this, arguments);
        if(iterNext) iterNext();
      });
    };

    render();
    async.forever(iterator);
  };

  document.addEventListener('DOMContentLoaded', function(e){
    document.body.appendChild( renderer.domElement );
    startLoop();
  });

  window.addEventListener('resize', _.debounce(renderSize, 200));

}());