(function (module) {

  var _ = require('lodash');

  /**
   * Populates each field's _adjacentFields array.
   * Should only be used in the Fields' constructor.
   *
   * @this Field
   * @private
   */
  module.exports = function () {

    var i, PEELS = 5,
        self = this,
        d = self._Sphere._divisions,
        max = {
          x: d * 2 - 1,
          y: d - 1
        },
        pos = self._position,
        next = ( pos.s + 1 + PEELS ) % PEELS,
        prev = ( pos.s - 1 + PEELS ) % PEELS;

    // Link polar pentagons to the adjacent fields
    if (this._position === 'NORTH') {
      return [
        { s: 0, x: 0, y: 0 },
        { s: 1, x: 0, y: 0 },
        { s: 2, x: 0, y: 0 },
        { s: 3, x: 0, y: 0 },
        { s: 4, x: 0, y: 0 }
      ];
    } else if (this._position === 'SOUTH') {
      return [
        { s: 0, x: max.x, y: max.y },
        { s: 1, x: max.x, y: max.y },
        { s: 2, x: max.x, y: max.y },
        { s: 3, x: max.x, y: max.y },
        { s: 4, x: max.x, y: max.y }
      ];
    } else {

      var result = [];

      // 0: northwestern adjacent (x--)
      if (pos.x > 0) {
        result[0] = { s: pos.s, x: pos.x - 1, y: pos.y };
      } else {
        if (pos.y === 0) {
          result[0] = 'NORTH';
        } else {
          result[0] = { s: prev, x: pos.y - 1, y: 0 }
        }
      }

      // 1: western adjacent (x--, y++)
      if (pos.x === 0) {
        // attach northwestern edge to previous north-northeastern edge
        result[1] = { s: prev, x: pos.y, y: 0 };
      } else {
        if (pos.y === max.y) {
          // attach southwestern edge...
          if (pos.x > d) {
            // ...to previous southeastern edge
            result[1] = {s: prev, x: max.x, y: pos.x - d};
          } else {
            // ...to previous east-northeastern edge
            result[1] = {s: prev, x: pos.x + d - 1, y: 0};
          }
        } else {
          result[1] = {s: pos.s, x: pos.x - 1, y: pos.y + 1};
        }
      }

      // 2: southwestern adjacent (y++)
      if (pos.y < max.y) {
        result[2] = { s: pos.s, x: pos.x, y: pos.y + 1 };
      } else {
        if (pos.x === max.x && pos.y === max.y) {
          result[2] = 'SOUTH';
        } else {
          // attach southwestern edge...
          if (pos.x >= d) {
            // ...to previous southeastern edge
            result[2] = { s: prev, x: max.x, y: pos.x - d + 1};
          } else {
            // ...to previous east-northeastern edge
            result[2] = { s: prev, x: pos.x + d, y: 0 };
          }
        }
      }

      if (this._isPentagon) {
        // the last two aren't the same for pentagons

        if (pos.x === d - 1) {
          // field is the northern tropical pentagon
          result[3] = { s: pos.s, x: pos.x + 1, y: 0};
          result[4] = { s: next, x: 0, y: max.y };
        } else if (pos.x === max.x) {
          // field is the southern tropical pentagon
          result[3] = { s: next, x: d, y: max.y };
          result[4] = { s: next, x: d - 1, y: max.y };
        }

      } else {

        // 3: southeastern adjacent (x++)
        if (pos.x === max.x) {
          result[3] = { s: next, x: pos.y + d, y: max.y }
        } else {
          result[3] = { s: pos.s, x: pos.x + 1, y: pos.y }
        }

        // 4: eastern adjacent (x++, y--)
        if (pos.x === max.x) {
          result[4] = { s: next, x: pos.y + d - 1, y: max.y }
        } else {
          if (pos.y === 0) {
            // attach northeastern side to...
            if (pos.x < d) {
              // ...to next northwestern edge
              result[4] = { s: next, x: 0, y: pos.y + 1 };
            } else {
              // ...to next west-southwestern edge
              result[4] = { s: next, x: pos.x - d + 1, y: max.y }
            }
          } else {
            result[4] = { s: pos.s, x: pos.x + 1, y: pos.y - 1 };
          }
        }

        // 5: northeastern adjacent (y--)
        if (pos.y > 0) {
          result[5] = { s: pos.s, x: pos.x, y: pos.y - 1 }
        } else {
          if (pos.y === 0) {
            // attach northeastern side to...
            if (pos.x < d) {
              // ...to next northwestern edge
              result[5] = { s: next, x: 0, y: pos.y };
            } else {
              // ...to next west-southwestern edge
              result[5] = { s: next, x: pos.x - d, y: max.y }
            }
          }
        }
      }
    }

    return result;

  }
}(module));