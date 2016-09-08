/*
 * Copyright (c) 2016 Will Shown. All Rights Reserved.
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

'use strict';

import THREE from 'three';
import CANNON from 'cannon';

import { throttle, each, extend, pick } from 'lodash';

const constants = require('./constants');

const TIME_STEP     = 1.0 / 60.0,
      MAX_SUB_STEPS = 3,
      DEFAULT_ω     = -.09,
      OSC_DUR       = 30e3;

const τ = 2 * Math.PI;

class Renderer {

  constructor(canvas) {

    this._lastTime = Date.now();

    // Camera & Scene

    this.scene     = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x000000, 4.5, 6.5);

    this.camera = new THREE.PerspectiveCamera(33, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 0, 4.5);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Lighting

    this.scene.add(new THREE.AmbientLight(0x4f5359));
    this.scene.add(new THREE.HemisphereLight(0xC6C2B6, 0x3A403B, .85));

    // Renderer

    this.renderer = new THREE.WebGLRenderer({
      alpha:     true,
      antialias: true,
      canvas:    canvas
    });

    var renderSize = throttle(() => {
      this.renderer.setSize(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio);
      this.camera.aspect = (window.innerWidth / window.innerHeight);
      this.camera.updateProjectionMatrix();
    }, 200, true);

    renderSize();

    // Physics

    this._world = new CANNON.World();

    // The volume and mass of a human head
    this._body = new CANNON.Body({
      mass:     5,
      position: new CANNON.Vec3(0, 0, 0),
      shape:    new CANNON.Sphere(0.0875)
    });

    this._body.angularDamping = .88;

    this._world.addBody(this._body);

    this._world.addEventListener('preStep', ()=> {
      var t = this._lastTime;

      this._body.angularVelocity.y = Math.sin(τ * ((t + OSC_DUR / 2.5) % (OSC_DUR*2)) / (OSC_DUR*2)) * 2 * DEFAULT_ω;
      this._body.angularVelocity.x = Math.sin(τ * (t % OSC_DUR) / OSC_DUR) * DEFAULT_ω;
      this._body.angularVelocity.z = Math.sin(τ * ((t + OSC_DUR / 2) % OSC_DUR) / OSC_DUR) * DEFAULT_ω;
    });

    // DOM bindings and render loop

    window.addEventListener('resize', renderSize);

    this.paused = true;
    this.render = this._render.bind(this);

  }

  play() {
    this.paused = false;
    this.render();
  }

  pause() {
    this.paused = true;
  }

  _render() {
    var now = Date.now(),
        dt  = (now - this._lastTime) / 1e3;

    this.sphere.rotation.setFromQuaternion(this._body.quaternion);

    this._world.step(TIME_STEP, dt, MAX_SUB_STEPS);

    this.renderer.render(this.scene, this.camera);

    if (!this.paused) requestAnimationFrame(this.render);

    this._lastTime = now;
  }

  updateVFC(vfc) {

    var geometry = new THREE.BufferGeometry();

    geometry.setIndex(new THREE.BufferAttribute(vfc.indices, 1));
    geometry.addAttribute('position', new THREE.BufferAttribute(vfc.positions, 3));
    geometry.addAttribute('normal', new THREE.BufferAttribute(vfc.normals, 3));
    geometry.addAttribute('color', new THREE.BufferAttribute(vfc.colors, 3));

    geometry.computeBoundingSphere();

    this.geometry = geometry;

    if (this.material) this._refreshSphere();

  }

  updateMaterial(opts) {

    this.material = new THREE[opts.wireframe ? 'MeshLambertMaterial' : 'MeshPhongMaterial'](extend({
      shading:      opts.geometryType === 'vertex-per-field' ? THREE.FlatShading : THREE.SmoothShading,
      vertexColors: THREE.VertexColors,
      shininess:    80
    }, pick(opts, constants.MAT_PROPS)));

    if (this.geometry) this._refreshSphere();

  }

  _refreshSphere() {

    if (this.sphere) this.scene.remove(this.sphere);

    this.sphere = new THREE.Object3D();

    this.sphere.add(new THREE.Mesh(this.geometry, this.material));

    this.scene.add(this.sphere);

  }
}

export default Renderer;