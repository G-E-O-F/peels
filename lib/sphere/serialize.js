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

(function(module){

  var _ = require('lodash');

  var _serializeField = function(field){
    return _.has(field, 'data') && _.isObject(field.data) ? field.data : {};
  };

  /**
   * Returns a JSON object representation of this sphere.
   * @this Sphere
   * @private
   */
  module.exports = function(){

    var result = {},
        self = this;

    result.sections = [];
    result.north = _serializeField(self._North);
    result.south = _serializeField(self._South);
    var d = result.divisions = self._divisions;

    var _serializeColumn = function(column){
      return _.map(_.first(column, d), _serializeField);
    };

    _.each(self._Sections, function(section, i){
      result.sections[i] = _.map(section._Fields.slice(1), _serializeColumn);
    });

    return result;

  }

}(module));