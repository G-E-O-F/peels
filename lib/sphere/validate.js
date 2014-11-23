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

  var _isField = function (field) {
    // fields have to be objects
    return _.isObject(field)
  };

  module.exports = function (data) {

    if (!(
      _.has(data, 'fields') &&
      _.has(data, 'north') &&
      _.has(data, 'south') &&
      _.has(data, 'divisions')
    )) {
      return false
    } else {

      if (!(
        data.divisions === parseInt(data.divisions, 10) && // divisions is an integer
        data.divisions > 0 &&
        _isField(data.north) &&
        _isField(data.south) &&
        _.isArray(data.fields) &&
        data.fields.length === 5
      )) {
        return false
      } else {

        var divisions = data.divisions,
            _validateColumn = function (column) {
              return _.isArray(column) &&
                column.length === divisions &&
                _.every(column, _isField);
            },
            _validateSection = function (section) {
              return _.isArray(section) &&
                section.length === 2 * divisions &&
                _.every(section, _validateColumn);
            };

        return _.every(data.fields, _validateSection);

      }

    }
  }

}(module));