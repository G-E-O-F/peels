(function (module) {

  /**
   * Populates each field's _adjacentFields array.
   * Should only be used in the Sphere's constructor.
   *
   * @param {number} PEELS (PEELS should always === 5)
   * @this Sphere
   * @private
   */
  module.exports = function (PEELS) {
    var i,
        self = this,
        divisions = self._divisions;

    // Link polar pentagons to the adjacent fields
    for (i = 0; i < PEELS; i += 1) {
      self._North._adjacentFields[i] = self._Sections[i]._Fields[1][0];
      self._South._adjacentFields[i] = self._Sections[i]._Fields[divisions * 2][divisions - 1];
    }

    // Link non-polar fields to adjacent fields
    for (i = 0; i < PEELS; i += 1) {
      var section = self._Sections[i],
          next = self._Sections[( i + 1 + PEELS ) % PEELS];

      section.each(function (field, x, y) {
        if (field._Section === section) {
          // field is native to this section

          // all fields have these fields defined in their own section
          field._adjacentFields[0] = section.get(x - 1, y);
          field._adjacentFields[1] = section.get(x - 1, y + 1);
          field._adjacentFields[2] = section.get(x, y + 1);

          if (field._isPentagon) {

            // field is a tropical pentagon
            if (x === divisions) {
              // field is the northern tropical pentagon
              field._adjacentFields[3] = section.get(x + 1, y);
              field._adjacentFields[4] = next.get(1, divisions - 1);
            } else if (x === divisions * 2) {
              // field is the southern tropical pentagon
              field._adjacentFields[3] = next.get(divisions + 1, divisions - 1);
              field._adjacentFields[4] = next.get(divisions, divisions - 1);
            }

          } else {
            // field is an ordinary hexagon

            if (x === divisions * 2) {
              // field is along the small southeastern edge, should be linked with south-southwestern edge
              field._adjacentFields[3] = next.get(
                  divisions + 1 + y,
                  divisions - 1
              );
              field._adjacentFields[4] = next.get(
                  divisions + y,
                  divisions - 1
              );
              // y always > 0 when x === divisions * 2 and the field is a hexagon
              field._adjacentFields[5] = section.get(x, y - 1);

            } else {
              // field is not on the southeastern edge
              field._adjacentFields[3] = section.get(x + 1, y);

              if (y > 0) {
                // field has all-native adjacent fields
                field._adjacentFields[4] = section.get(x + 1, y - 1);
                field._adjacentFields[5] = section.get(x, y - 1);

              } else {
                // field is along the large northeastern edge
                if (x < divisions) {
                  // field is along the north-northeastern edge, should be linked with next northwestern edge
                  field._adjacentFields[4] = next.get(1, x);
                  field._adjacentFields[5] = next.get(1, x - 1);
                } else {
                  // field is along the east-northeastern edge, should be linked with next west-southwestern edge
                  field._adjacentFields[4] = next.get(x - divisions + 1, divisions - 1);
                  field._adjacentFields[5] = next.get(x - divisions, divisions - 1);
                }
              }
            }
          }
        }
      });
    }
  }

}(module));