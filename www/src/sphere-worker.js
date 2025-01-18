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

import Sphere from '../../index.js';

import * as colorFns from './color-functions';

import partition from '../../lib/scad/partition';

function _clamp(RGBval){
  return Math.max(Math.min(RGBval, 255), 0)
}

onmessage = function(e){

  var opts = e.data || {};

  var s = new Sphere(opts);

  var colorFn = colorFns[opts.coloration] ? colorFns[opts.coloration] : colorFns.default;

  if(opts.coloration === 'useRGB' && opts.imageData) {

    s.fromRaster(opts.imageData, opts.imageWidth, opts.imageHeight, 4, function (r, g, b) {

      this.data = {
        r: _clamp(r),
        g: _clamp(g),
        b: _clamp(b)
      };

    }, function () {

      s.toCG({colorFn: colorFn, type: (opts.geometryType || 'fields')}, function (err, vfc) {
        postMessage(vfc);
      });

    });

  }else if( opts.coloration === 'LEDStrings' ){

    partition(s, opts.leds);

    s.toCG({colorFn: colorFn, type: (opts.geometryType || 'fields')}, function (err, vfc) {
      postMessage(vfc);
    });

  }else{

    s.toCG({ colorFn: colorFn, type: (opts.geometryType || 'fields') }, function(err, vfc){
      postMessage(vfc);
    });

  }

};
