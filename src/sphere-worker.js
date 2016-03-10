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

import Sphere from '../../index.js';

onmessage = function(e){

  var opts = e.data || {};

  var s = new Sphere(opts);

  var colorFn;

  switch(opts.coloration) {
    case 'highlight-icosahedron':
      colorFn = function(){
        var d = this._parent._divisions,
            sxy = this._sxy,
            onEdge = (
              this._i < 2 ||
              (sxy[1] + sxy[2] + 1) % d === 0 ||
              (sxy[1] + 1) % d === 0 ||
              sxy[2] === 0
            );
        if( onEdge ){
          return '#C6C2B6'
        }else{
          return '#4D646C'
        }
      };
      break;
    default:
      colorFn = function(){
        return '#C6C2B6';
      };
      break;
  }

  s.toCG({ colorFn: colorFn, type: 'fields' }, function(err, vfc){
    postMessage(vfc);
  });

};
