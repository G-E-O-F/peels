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

(function(module){

    var Field = require('./field'),
        _ = require('lodash');

    function Section(Sphere, index){

        var self = this,
            divisions = Sphere._divisions;

        this._Sphere = Sphere;
        this._index = index;

        this._Fields = [];

        (function(x){
            for(var i = 0; i < x; i += 1){

                self._Fields[i] = [];

                (function(y){
                    for(var j = 0; j < y; j += 1){

                        if( i > 0 && j+1 < divisions ) {
                            // the field is native to this section
                            self._Fields[i][j] = new Field(
                                /* sphere      */ self._Sphere,
                                /* section     */ self,
                                /* is pentagon */ ( ((i+1) % divisions) === 0 && j === 0 ),
                                /* position    */ { x: i, y: j }
                            );
                        }else{
                            // the field belongs in a different section and needs to be linked
                            self._Fields[i][j] = null;
                        }
                    }
                }(divisions))

            }
        }(divisions * 2));

    }

    Section.prototype.get = function(x, y){
        return this._Fields[x][y];
    };

    Section.prototype.each = function(cb, done){
        var self = this;
        _.each(this._Fields, function(column, x){
            _.each(column, function(value, y){
                cb.call(self, value, x, y);
            });
        });
        if(done) done.call(self);
    };

    Section.prototype.link = function(x, y, field){
        if( field instanceof Field &&
            x >= 0 && x < 2 * this._Sphere._divisions &&
            y >= 0 && y <     this._Sphere._divisions )
        {
            return this._Fields[x][y] = field;
        }else{
            debugger;
            throw new Error('Field link argument(s) out of bounds.');
        }
    };

    module.exports = Section;

}(module));
