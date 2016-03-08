var dat = require('dat-gui');

import {extend, pick, debounce} from 'lodash';

var defaults = require('./defaults'),
    constants = require('./constants'),
    SphereRenderer = require('./sphere-renderer'),
    SphereWorker = require('./sphere.worker');

class Coordinator {

  constructor () {
    extend(this, defaults);

    this._canvas = document.querySelector('canvas');

    this._sphereWorker = new SphereWorker();
    this._sphereWorker.onmessage = this.onMessage.bind(this);

    this._sphereRenderer = new SphereRenderer(this._canvas);

    this._setUpGUI();

    this._sphereRenderer.updateMaterial(pick(this, constants.MAT_PROPS));
    this._sphereWorker.postMessage(pick(this, constants.GEO_PROPS));
  }

  onMessage (e) {
    this._sphereRenderer.updateVFC(e.data);
    if(!this._sphereRenderer.started) this._sphereRenderer.start();
    this._canvas.classList.add('ready');
  }

  _setUpGUI () {
    this._gui = new dat.GUI();

    this._gui.add(this, 'divisions')
      .min(1)
      .max(24)
      .step(1)
      .onChange(this._onGeometryChange.bind(this));

    this._gui.add(this, 'wireframe')
      .onChange(this._onMaterialChange.bind(this));

    this._gui.add(this, 'wireframeLinewidth')
      .min(.1)
      .max(4)
      .onChange(this._onMaterialChange.bind(this));

    this._gui.add(this, 'coloration', [
        'highlight-icosahedron',
        'default'
      ])
      .onChange(this._onGeometryChange.bind(this))
  }

  _onMaterialChange () {
    this._sphereRenderer.updateMaterial(pick(this, constants.MAT_PROPS));
  }

}

Coordinator.prototype._onGeometryChange = debounce(function(){
  this._canvas.classList.remove('ready');
  this._sphereWorker.postMessage(pick(this, constants.GEO_PROPS));
}, 200);

module.exports = Coordinator;