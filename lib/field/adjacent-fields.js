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
        fields = self._Sphere._Fields,
        max = {
          x: d * 2 - 1,
          y: d - 1
        },
        pos = self._position,
        next = ( pos.s + 1 + PEELS ) % PEELS,
        prev = ( pos.s - 1 + PEELS ) % PEELS;

    // Link polar pentagons to the adjacent fields
    if (this._position === 'NORTH') {
      self._adjacentFields = [
        fields[0][0][0],
        fields[1][0][0],
        fields[2][0][0],
        fields[3][0][0],
        fields[4][0][0]
      ];
    } else if (this._position === 'SOUTH') {
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
      if (pos.x > 0) {
        self._adjacentFields[0] = fields[pos.s][pos.x - 1][pos.y];
      } else {
        if (pos.y === 0) {
          self._adjacentFields[0] = self._Sphere._North;
        } else {
          self._adjacentFields[0] = fields[prev][pos.y - 1][0]
        }
      }

      // 1: western adjacent (x--, y++)
      if (pos.x === 0) {
        // attach northwestern edge to previous north-northeastern edge
        self._adjacentFields[1] = fields[prev][pos.y][0];
      } else {
        if (pos.y === max.y) {
          // attach southwestern edge...
          if (pos.x > d) {
            // ...to previous southeastern edge
            self._adjacentFields[1] = fields[prev][max.x][pos.x - d];
          } else {
            // ...to previous east-northeastern edge
            self._adjacentFields[1] = fields[prev][pos.x + d - 1][0];
          }
        } else {
          self._adjacentFields[1] = fields[pos.s][pos.x - 1][pos.y + 1];
        }
      }

      // 2: southwestern adjacent (y++)
      if (pos.y < max.y) {
        self._adjacentFields[2] = fields[pos.s][pos.x][pos.y + 1];
      } else {
        if (pos.x === max.x && pos.y === max.y) {
          self._adjacentFields[2] = self._Sphere._South;
        } else {
          // attach southwestern edge...
          if (pos.x >= d) {
            // ...to previous southeastern edge
            self._adjacentFields[2] = fields[prev][max.x][pos.x - d + 1];
          } else {
            // ...to previous east-northeastern edge
            self._adjacentFields[2] = fields[prev][pos.x + d][0];
          }
        }
      }

      if (this._isPentagon) {
        // the last two aren't the same for pentagons

        if (pos.x === d - 1) {
          // field is the northern tropical pentagon
          self._adjacentFields[3] = fields[pos.s][pos.x + 1][0];
          self._adjacentFields[4] = fields[next][0][max.y];
        } else if (pos.x === max.x) {
          // field is the southern tropical pentagon
          self._adjacentFields[3] = fields[next][d][max.y];
          self._adjacentFields[4] = fields[next][d - 1][max.y];
        }

      } else {

        // 3: southeastern adjacent (x++)
        if (pos.x === max.x) {
          self._adjacentFields[3] = fields[next][pos.y + d][max.y]
        } else {
          self._adjacentFields[3] = fields[pos.s][pos.x + 1][pos.y]
        }

        // 4: eastern adjacent (x++, y--)
        if (pos.x === max.x) {
          self._adjacentFields[4] = fields[next][pos.y + d - 1][max.y]
        } else {
          if (pos.y === 0) {
            // attach northeastern side to...
            if (pos.x < d) {
              // ...to next northwestern edge
              self._adjacentFields[4] = fields[next][0][pos.y + 1];
            } else {
              // ...to next west-southwestern edge
              self._adjacentFields[4] = fields[next][pos.x - d + 1][max.y]
            }
          } else {
            self._adjacentFields[4] = fields[pos.s][pos.x + 1][pos.y - 1];
          }
        }

        // 5: northeastern adjacent (y--)
        if (pos.y > 0) {
          self._adjacentFields[5] = fields[pos.s][pos.x][pos.y - 1]
        } else {
          if (pos.y === 0) {
            // attach northeastern side to...
            if (pos.x < d) {
              // ...to next northwestern edge
              self._adjacentFields[5] = fields[next][0][pos.y];
            } else {
              // ...to next west-southwestern edge
              self._adjacentFields[5] = fields[next][pos.x - d][max.y]
            }
          }
        }
      }
    }

  }
}(module));