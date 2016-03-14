var dat = require('dat-gui');

import {extend, pick, debounce} from 'lodash';

import * as constants from './constants';
import * as defaults from './defaults';

import SphereRenderer from './sphere-renderer';
import * as colorFns from './color-functions';

class Coordinator {

  constructor() {
    extend(this, defaults);

    this._canvas = document.querySelector('canvas');

    this._sphereWorker           = new Worker('./sphereworker.js');
    this._sphereWorker.onmessage = this.onMessage.bind(this);

    this._sphereRenderer = new SphereRenderer(this._canvas);

    this._setUpGUI();

    this._sphereRenderer.updateMaterial(this);
    this._sphereWorker.postMessage(pick(this, constants.GEO_PROPS));
  }

  onMessage(e) {
    this._sphereRenderer.updateVFC(e.data);
    if (this._sphereRenderer.paused) this._sphereRenderer.play();
    this._canvas.classList.add('ready');
  }

  _setUpGUI() {
    this._gui = new dat.GUI();

    this._gui.add(this, 'divisions')
      .min(1)
      .max(24)
      .step(1)
      .onChange(this._onGeometryChange.bind(this));

    this._gui.add(this, 'geometryType', [
      'poly-per-field',
      'vertex-per-field'
    ])
      .onChange(()=>{
        this._onMaterialChange();
        this._onGeometryChange();
      });

    this._gui.add(this, 'wireframe')
      .onChange(this._onMaterialChange.bind(this));

    this._gui.add(this, 'wireframeLinewidth')
      .min(.1)
      .max(4)
      .onChange(this._onMaterialChange.bind(this));

    this._gui.add(this, 'coloration', Object.keys(colorFns))
      .onChange(this._onGeometryChange.bind(this))
  }

  _onMaterialChange() {
    this._sphereRenderer.updateMaterial(this);
  }

}

Coordinator.prototype._onGeometryChange = debounce(function () {
  this._canvas.classList.remove('ready');
  this._sphereWorker.postMessage(pick(this, constants.GEO_PROPS));
}, 200);

export default Coordinator;