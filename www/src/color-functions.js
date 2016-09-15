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

const toF = 1 / 225;

export default function(){

  return {
    r: toF * 235,
    g: toF * 246,
    b: toF * 247
  }

}

export const highlightIcosahedron = function(){

  var d = this._parent._divisions,
      sxy = this._sxy,
      onEdge = (
        this._i < 2 ||
        (sxy[1] + sxy[2] + 1) % d === 0 ||
        (sxy[1] + 1) % d === 0 ||
        sxy[2] === 0
      );
  if( onEdge ){
    return {
      r: toF * 134,
      g: toF * 171,
      b: toF * 165
    }
  }else{
    return {
      r: toF * 0,
      g: toF * 108,
      b: toF * 127
    }
  }

};

const cToF = c=>c*toF;

const panelColors = [
  [85,98,112].map(cToF),
  [78,205,196].map(cToF),
  [199,244,100].map(cToF),
  [255,107,107].map(cToF),
  [196,77,88].map(cToF),

  [209,242,165].map(cToF),
  [255,159,128].map(cToF),
  [239,250,180].map(cToF),
  [245,105,145].map(cToF),
  [255,196,140].map(cToF),

  [103,145,122].map(cToF),
  [184,175,3].map(cToF),
  [227,50,88].map(cToF),
  [204,191,130].map(cToF),

  [171,82,107].map(cToF),
  [240,226,164].map(cToF),
  [197,206,174].map(cToF),
  [188,162,151].map(cToF),
];

export const tenPanelsAndPoles = function(){

  var d = this._parent._divisions,
      sxy = this._sxy,
      p;

  if(this._i < 2){
    return {
      r: 1,
      g: 1,
      b: 1
    }
  }else{
    p = Math.floor(sxy[1] / d) * 5 + sxy[0]
  }

  return {
    r: panelColors[p][0],
    g: panelColors[p][1],
    b: panelColors[p][2]
  }

};

const stringLim = 64;

// TODO: implement

// export const LEDStrings = function(){
//
// };

export const useRGB = function(){

  return {
    r: toF * this.data.r,
    g: toF * this.data.g,
    b: toF * this.data.b
  }

};