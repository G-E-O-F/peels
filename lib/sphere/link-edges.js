(function(module){

	/**
	 * Links fields along the eastern edges of sections to the corresponding fields
	 * in the previous section. This is done for convenience and because
	 * link-adjacent-fields expects it, but this is not necessarily computationally
	 * efficient and potentially causes issues when using Section.each.
	 * Should only be used in the Sphere's constructor.
	 *
	 * @param {number} PEELS (PEELS should always === 5)
	 * @this Sphere
	 * @private
	 */
	module.exports = function(PEELS){
		var i,
			 self = this,
			 divisions = self._divisions;

		for (i = 0; i < PEELS; i += 1) {
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
	}

}(module));