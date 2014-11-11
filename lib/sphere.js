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

var PEELS = 5;

(function (module) {

	var Section = require('./section');
	var Field = require('./field');

	function Sphere() {

		var self = this,
			 opts = arguments[0] || {},
			 divisions = Math.max((opts.divisions || 1), 1);

		this._divisions = divisions;
		this._Sections = [];

		this._North = new Field(self, null, true, 'NORTH');
		this._South = new Field(self, null, true, 'SOUTH');

		// Populate the Sphere with Fields in Sections
		(function (s) {
			var i;

			// Initialize the Sections
			for (i = 0; i < s; i += 1) {
				self._Sections[i] = new Section(self, i, divisions);
			}

			// Link the sections together
			for (i = 0; i < s; i += 1) {

				var prev = self._Sections[( i - 1 + PEELS ) % PEELS];

				self._Sections[i].each(function (val, x, y) {
					if (val == null) {
						// Link any unlinked positions
						if (x === 0) {
							if (y === 0) {
								// Link to north pole
								this._link(x, y, self._North);
							} else {
								// Link to northeastern edge of previous section
								this._link(x, y, prev.get(y, 0));
							}
						} else if (y === divisions) {
							if (x === divisions * 2) {
								// Link to south pole
								this._link(x, y, self._South);
							} else {
								// Link to southeastern nodes of previous section
								if (x < divisions) {
									// Link to eastern nodes of previous section
									this._link(x, y, prev.get(x + divisions, 0));
								} else {
									// Link to southern nodes of previous section
									this._link(x, y, prev.get(divisions * 2, (x - divisions)));
								}
							}
						}
					}
				});
			}

			// Link adjacent fields to each other

			// Link polar pentagons to the adjacent fields
			for(i = 0; i < s; i += 1){
				self._North._adjacentFields[i] = self._Sections[i]._Fields[1][0];
				self._South._adjacentFields[i] = self._Sections[i]._Fields[divisions * 2][divisions - 1];
			}

			// Link non-polar fields to adjacent fields
			for(i = 0; i < s; i += 1){
				var section = self._Sections[i],
					 next = self._Sections[( i + 1 + PEELS ) % PEELS];
				section.each(function (field, x, y) {
					if(field._Section === section) {
						// field is native to this section

						// all fields have these fields defined in their own section
						field._adjacentFields[0] = section.get(x - 1, y    );
						field._adjacentFields[1] = section.get(x - 1, y + 1);
						field._adjacentFields[2] = section.get(x,     y + 1);

						if (field._isPentagon) {

							// field is a tropical pentagon
							if(x === divisions){
								// field is the northern tropical pentagon
								field._adjacentFields[3] = section.get(x + 1, y);
								field._adjacentFields[4] = next.get(1, divisions - 1);
							}else

							if(x === divisions * 2){
								// field is the southern tropical pentagon
								field._adjacentFields[3] = next.get(divisions + 1, divisions - 1);
								field._adjacentFields[4] = next.get(divisions,     divisions - 1);
							}

						}else{
							// field is an ordinary hexagon

							if(x === divisions * 2){
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

							}else {
								// field is not on the southeastern edge
								field._adjacentFields[3] = section.get(x + 1, y);

								if (y > 0) {
									// field has all-native adjacent fields
									field._adjacentFields[4] = section.get(x + 1, y - 1);
									field._adjacentFields[5] = section.get(x,     y - 1);

								} else {
									// field is along the large northeastern edge
									if (x < divisions) {
										// field is along the north-northeastern edge, should be linked with next northwestern edge
										field._adjacentFields[4] = next.get(1, x  );
										field._adjacentFields[5] = next.get(1, x-1);
									} else {
										// field is along the east-northeastern edge, should be linked with next west-southwestern edge
										field._adjacentFields[4] = next.get(x - divisions + 1, divisions - 1);
										field._adjacentFields[5] = next.get(x - divisions,     divisions - 1);
									}
								}
							}
						}
					}
				});
			}



		}(PEELS));

	}

	// TODO: make serialization and de-serialization methods

	// TODO: make async Field-by-Field iterator
	// TODO: maybe also make synchronous 'each' iterator

	module.exports = Sphere;

}(module));
