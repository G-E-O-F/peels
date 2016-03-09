/*
 * Copyright (c) 2015 Will Shown. All Rights Reserved.
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

var THREE = require('three');

import { throttle, each, extend, pick} from 'lodash';

var π = Math.PI,
    constants = require('./constants');

function Renderer(canvas){
  var self = this;

  // Camera & Scene

  this.scene = new THREE.Scene();
  this.scene.fog = new THREE.Fog( 0x000000, 4.5, 6.5);

  this.camera = new THREE.PerspectiveCamera( 33, window.innerWidth / window.innerHeight, 0.1, 100 );
  this.camera.position.set(0, 0, 5);
  this.camera.lookAt( new THREE.Vector3(0, 0, 0) );

  // Lighting

  this.scene.add( new THREE.AmbientLight( 0x4f5359 ) );
  this.scene.add( new THREE.HemisphereLight( 0xC6C2B6, 0x3A403B, .85 ) );

  // Renderer

  this.renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: canvas
  });

  self.renderer.setSize( window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio );

  var renderSize = throttle(function(){
    self.renderer.setSize( window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio );
    self.camera.aspect = (window.innerWidth / window.innerHeight);
    self.camera.updateProjectionMatrix();
  }, 200, true);

  renderSize();

  // DOM bindings and render loop

  window.addEventListener('resize', renderSize);

  this.started = false;

  this.start = function(){

    var radpmz = 0;
    var radpmx = 0;
    var radpmy = (-2 * (2*π));

    var radiz = 0;
    var radix = 0;
    var radiy = 0;

    self.started = true;

    var render = function () {
      var now = Date.now();

      self.sphere.rotation.set(
        radix + radpmx * (now % 60e3) / 60e3,
        radiy + radpmy * (now % 60e3) / 60e3,
        radiz + radpmz * (now % 60e3) / 60e3
      );

      self.renderer.render(self.scene, self.camera);

      if(self.started){
        requestAnimationFrame(function(){
          render.call(this, arguments);
        });
      }

    };

    render();

  };

}

Renderer.prototype.updateVFC = function(vfc){

  var geometry = new THREE.Geometry();

  each(vfc.vertices, function(vertex){
    geometry.vertices.push(
      new THREE.Vector3(vertex.x, vertex.y, vertex.z)
    );
  });

  each(vfc.faces, function(face, fi){
    var triangle = new THREE.Face3(face[0], face[1], face[2]);
    triangle.vertexColors[0] = new THREE.Color(vfc.colors[face[0]]);
    triangle.vertexColors[1] = new THREE.Color(vfc.colors[face[1]]);
    triangle.vertexColors[2] = new THREE.Color(vfc.colors[face[2]]);
    geometry.faces[fi] = triangle;
  });

  geometry.computeFaceNormals();
  geometry.computeVertexNormals();

  this.geometry = geometry;

  if(this.material) this._refreshSphere();

};

Renderer.prototype.updateMaterial = function(opts){
  var self = this;

  if(this.material && (this.material.wireframe === opts.wireframe)){
    extend(self.material, pick(opts, constants.MAT_PROPS));
    this.material.needsUpdate = true;
  }else{
    this.material = new THREE[opts.wireframe ? 'MeshLambertMaterial' : 'MeshPhongMaterial' ](extend({
      shading: THREE.FlatShading,
      vertexColors: THREE.VertexColors,
      shininess: 10
    }, pick(opts, constants.MAT_PROPS)));
  }

  if(this.geometry) this._refreshSphere();

};

Renderer.prototype._refreshSphere = function(){

  if(this.sphere) this.scene.remove(this.sphere);
  this.sphere = new THREE.Mesh( this.geometry, this.material );
  this.scene.add(this.sphere);

};

module.exports = Renderer;