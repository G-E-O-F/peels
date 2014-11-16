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

(function (module) {

  var _ = require('lodash');
  var adjacentFields = require('./adjacent-fields');

  /**
   * Represents a field on the sphere.
   *
   * @param Sphere
   * @param {object|string} position
   * @param {object} [data]
   * @constructor
   */
  function Field(Sphere, position, data) {

    var self = this;

    this._Sphere = Sphere;
    this._position = position;
    this._data = {};

    this._isPentagon = (
      (position === 'NORTH') ||
      (position === 'SOUTH') ||
      (position.y === 0 && ((position.x + 1) % Sphere._divisions) === 0)
    );

    this._adjacentFields = null;

    if(data) this._data.current = data;

    var getData = function(){
      if(self._Sphere._iteration && self._data.hasOwnProperty(self._Sphere._iteration.previous)){
        self._data.current = self._data[self._Sphere._iteration.previous];
        delete self._data[self._Sphere._iteration.previous];
      }
      return self._data.current;
    };

    var setData = function(newData){
      if(self._Sphere._iteration){
        self._data[self._Sphere._iteration.current] = newData;
      }else{
        self._data.current = newData;
      }
    };

    Object.defineProperty(this, 'data', {
      get: getData,
      set: setData
    });

  }

  Field.prototype._linkAdjacent = function(){
    adjacentFields.call(this);
  };

  Field.prototype.adjacent = function(p){
    return this._adjacentFields[p]
  };

  Field.prototype.adjacents = function(){
    return this._adjacentFields;
  };

  module.exports = Field;

}(module));
