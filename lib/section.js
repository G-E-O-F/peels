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

  var Field = require('./field'),
      _ = require('lodash');

  /**
   * Represents one of the five sections of the Sphere.
   *
   * @param Sphere
   * @param {number} [index]
   * @param {object} [data]
   * @constructor
   * @private
   */
  function Section(Sphere, index, data) {
    var self = this,
        divisions = Sphere._divisions;

    this._Sphere = Sphere;
    this._index = index;

    this._Fields = [];

    (function (x) {
      for (var i = 0; i <= x; i += 1) {

        self._Fields[i] = [];

        (function (y) {
          for (var j = 0; j <= y; j += 1) {

            if (i > 0 && j < divisions) {
              // the field is native to this section
              self._Fields[i][j] = new Field(
                /* sphere      */ self._Sphere,
                /* section     */ self,
                /* is pentagon */ ( i % divisions === 0 && j === 0 ),
                /* data */        (data ? data[i - 1][j] : undefined)
              );
            } else {
              // the field belongs in a different section and needs to be linked
              self._Fields[i][j] = null;
            }
          }
        }(divisions))

      }
    }(divisions * 2));

  }

  /**
   * Gets a Field in this section.
   * @param {number} x
   * @param {number} y
   * @returns {Field}
   */
  Section.prototype.get = function (x, y) {
    return this._Fields[x][y];
  };

  /**
   * Iterates over each field in this section.
   * Caution: this will iterate over fields not native to this section when eastern edges are linked.
   * @param {function} cb
   * @param {function} [done]
   */
  Section.prototype.each = function (cb, done) {
    var self = this;
    _.each(this._Fields, function (column, x) {
      _.each(column, function (value, y) {
        cb.call(self, value, x, y);
      });
    });
    if (done) done.call(self);
  };

  /**
   * Links a field at position (x,y) if that position isn't populated yet.
   * @param {number} x
   * @param {number} y
   * @param {Field} field
   * @private
   */
  Section.prototype._link = function (x, y, field) {

    if (field instanceof Field && // field is a Field
      _.isNull(this.get(x, y)) // the position in this section isn't already linked
      ) {
      return this._Fields[x][y] = field;
    } else {
      debugger;
      throw new Error("Can't link like this.");
    }
  };

  module.exports = Section;

}(module));
