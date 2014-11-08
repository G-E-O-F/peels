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

(function(module){

    var Section = require('./section');
    var Field = require('./field');

    function Sphere(){

        var self = this,
            opts = arguments[0] || {},
            divisions = Math.max((opts.divisions || 8), 1);

        this._divisions = divisions;
        this._Sections = [];

        this._North = new Field(self, null, true, 'NORTH');
        this._South = new Field(self, null, true, 'SOUTH');

        // Populate the Sphere with Fields in Sections
        (function(s){

            // Initialize the Sections
            for(var i = 0; i < s; i += 1){
                self._Sections[i] = new Section(self, i, divisions);
            }

            // Link the sections together
            for(var j = 0; j < s; j += 1){

                var prev = self._Sections[( j - 1 + PEELS ) % PEELS];

                self._Sections[j].each(function(val, x, y){
                    if(val == null){
                        // Link any unlinked positions
                        if(x === 0){
                            if(y === 0){
                                // Link to north pole
                                this.link(x, y, self._North);
                            }else{
                                // Link to northeastern edge of previous section
                                this.link(x, y, prev.get(y, 0));
                            }
                        }else
                        if(y+1 === divisions){
                            if(x+1 === divisions*2){
                                // Link to south pole
                                this.link(x, y, self._South);
                            }else{
                                // Link to southeastern nodes of previous section
                                if(x < divisions){
                                    // Link to eastern nodes of previous section
                                    this.link(x, y, prev.get(x + divisions, 0));
                                }else{
                                    // Link to southern nodes of previous section
                                    this.link(x, y, prev.get(divisions*2-1, (x - divisions)));
                                }
                            }
                        }
                    }
                });
            }

            // TODO: Link adjacent fields to each other


        }(PEELS));

    }

    // TODO: make serialization and de-serialization methods

    // TODO: make async Field-by-Field iterator
    // TODO: maybe also make synchronous 'each' iterator

    module.exports = Sphere;

}(module));
