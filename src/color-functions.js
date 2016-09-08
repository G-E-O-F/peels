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

export const useRGB = function(){

  return {
    r: toF * this.data.r,
    g: toF * this.data.g,
    b: toF * this.data.b
  }

};