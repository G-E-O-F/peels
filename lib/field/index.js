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

/**
 * Represents a field on the sphere.
 * @constructor
 */
class Field {

  constructor(parent, index, data) {

    this._parent = parent;
    this._i      = index;
    this._data   = {};

    this._adjacentFields = null;
    this._pos            = null;

    this._data.current = data || {};

  }

  get data() {
    if (this._parent._iteration && this._data.hasOwnProperty(this._parent._iteration.previous)) {
      this._data.current = this._data[this._parent._iteration.previous];
      delete this._data[this._parent._iteration.previous];
    }
    return this._data.current;
  }

  set data(newData) {
    if (this._parent._iteration) {
      this._data[this._parent._iteration.current] = newData;
    } else {
      this._data.current = newData;
    }
  }

  get position() {
    return this._pos;
  }

  set position(pos) {
    this._pos = {λ: pos.λ, φ: pos.φ};
  }

  adjacent(p) {
    return this._adjacentFields[p];
  }

  adjacents() {
    return this._adjacentFields;
  }

}

module.exports = Field;
