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

	var Section = require('../section');
	var Field = require('../field');

	var linkEdges = require('./link-edges');
	var linkAdjacentFields = require('./link-adjacent-fields');

	/**
	 * Represents a sphere of fields arranged in an interpolated icosahedral geodesic pattern.
	 *
	 * @param {object} options
	 * @param {number} [options.divisions = 8] - Integer greater than 0:
	 *   the number of fields per edge of the icosahedron including
	 *   the origin of the edge (but not the endpoint). Determines the
	 *   angular resolution of the sphere. Directly & exponentially related
	 *   to the memory consumption of a Sphere.
	 * @constructor
	 */
	function Sphere(options) {

		var self = this,
			 opts = options || {},
			 divisions = Math.max((opts.divisions || 8), 1);

		this._divisions = divisions;
		this._Sections = [];

		this._North = new Field(self, null, true, 'NORTH');
		this._South = new Field(self, null, true, 'SOUTH');

		(function (s) {
			// Initialize the Sections
			for (var i = 0; i < s; i += 1) {
				self._Sections[i] = new Section(self, i, divisions);
			}
		}(PEELS));

		// Link the sections together
		linkEdges.call(this, PEELS);

		// Link adjacent fields to each other
		linkAdjacentFields.call(this, PEELS);

	}

	// TODO: make serialization and de-serialization methods

	// TODO: make async Field-by-Field iterator
	// TODO: maybe also make synchronous 'each' iterator

	module.exports = Sphere;

}(module));
