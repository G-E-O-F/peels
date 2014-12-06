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

  /**
   * Populates each field's _adjacentFields array.
   * Should only be used in the Fields' constructor.
   *
   * @this Field
   * @param {number|string} s - The section index or
   *   the string NORTH or SOUTH representing a pole.
   * @param {number} x - The column index.
   * @param {number} y - The row index.
   * @private
   */
  module.exports = function (s, x, y) {

    var PEELS = 5,
        self = this,
        d = self._Sphere._divisions,
        fields = self._Sphere._Fields,
        isPentagon = (
          (s === 'NORTH') ||
          (s === 'SOUTH') ||
          (y === 0 && ((x + 1) % d) === 0)
        ),
        max = {
          x: d * 2 - 1,
          y: d - 1
        },
        next = ( s + 1 + PEELS ) % PEELS,
        prev = ( s - 1 + PEELS ) % PEELS;

    // Link polar pentagons to the adjacent fields
    if (s === 'NORTH') {
      self._adjacentFields = [
        fields[0][0][0],
        fields[1][0][0],
        fields[2][0][0],
        fields[3][0][0],
        fields[4][0][0]
      ];
    } else if (s === 'SOUTH') {
      self._adjacentFields = [
        fields[0][max.x][max.y],
        fields[1][max.x][max.y],
        fields[2][max.x][max.y],
        fields[3][max.x][max.y],
        fields[4][max.x][max.y]
      ];
    } else {

      self._adjacentFields = [];

      // 0: northwestern adjacent (x--)
      if (x > 0) {
        self._adjacentFields[0] = fields[s][x - 1][y];
      } else {
        if (y === 0) {
          self._adjacentFields[0] = self._Sphere._North;
        } else {
          self._adjacentFields[0] = fields[prev][y - 1][0]
        }
      }

      // 1: western adjacent (x--, y++)
      if (x === 0) {
        // attach northwestern edge to previous north-northeastern edge
        self._adjacentFields[1] = fields[prev][y][0];
      } else {
        if (y === max.y) {
          // attach southwestern edge...
          if (x > d) {
            // ...to previous southeastern edge
            self._adjacentFields[1] = fields[prev][max.x][x - d];
          } else {
            // ...to previous east-northeastern edge
            self._adjacentFields[1] = fields[prev][x + d - 1][0];
          }
        } else {
          self._adjacentFields[1] = fields[s][x - 1][y + 1];
        }
      }

      // 2: southwestern adjacent (y++)
      if (y < max.y) {
        self._adjacentFields[2] = fields[s][x][y + 1];
      } else {
        if (x === max.x && y === max.y) {
          self._adjacentFields[2] = self._Sphere._South;
        } else {
          // attach southwestern edge...
          if (x >= d) {
            // ...to previous southeastern edge
            self._adjacentFields[2] = fields[prev][max.x][x - d + 1];
          } else {
            // ...to previous east-northeastern edge
            self._adjacentFields[2] = fields[prev][x + d][0];
          }
        }
      }

      if (isPentagon) {
        // the last two aren't the same for pentagons

        if (x === d - 1) {
          // field is the northern tropical pentagon
          self._adjacentFields[3] = fields[s][x + 1][0];
          self._adjacentFields[4] = fields[next][0][max.y];
        } else if (x === max.x) {
          // field is the southern tropical pentagon
          self._adjacentFields[3] = fields[next][d][max.y];
          self._adjacentFields[4] = fields[next][d - 1][max.y];
        }

      } else {

        // 3: southeastern adjacent (x++)
        if (x === max.x) {
          self._adjacentFields[3] = fields[next][y + d][max.y]
        } else {
          self._adjacentFields[3] = fields[s][x + 1][y]
        }

        // 4: eastern adjacent (x++, y--)
        if (x === max.x) {
          self._adjacentFields[4] = fields[next][y + d - 1][max.y]
        } else {
          if (y === 0) {
            // attach northeastern side to...
            if (x < d) {
              // ...to next northwestern edge
              self._adjacentFields[4] = fields[next][0][x + 1];
            } else {
              // ...to next west-southwestern edge
              self._adjacentFields[4] = fields[next][x - d + 1][max.y]
            }
          } else {
            self._adjacentFields[4] = fields[s][x + 1][y - 1];
          }
        }

        // 5: northeastern adjacent (y--)
        if (y > 0) {
          self._adjacentFields[5] = fields[s][x][y - 1]
        } else {
          if (y === 0) {
            // attach northeastern side to...
            if (x < d) {
              // ...to next northwestern edge
              self._adjacentFields[5] = fields[next][0][x];
            } else {
              // ...to next west-southwestern edge
              self._adjacentFields[5] = fields[next][x - d][max.y]
            }
          }
        }
      }
    }

  }
}(module));