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

    var Field = require('./field');

    function Section(Sphere, index, divisions){

        var self = this;

        this._Sphere = Sphere;
        this._index = index;
        this._divisions = divisions;

        this._Fields = [];

        (function(x){
            for(var i = 0; i < x; i += 1){

                self._Fields[i] = [];

                (function(y){
                    for(var j = 0; j < y; j += 1){

                        if( i > 0 && j+1 < divisions ) {
                            // the field belongs in this section or is already linkable

                            switch (true) {

                                // north pole
                                case (i === 0 && j === 0):
                                    self._Fields[i][j] = self._Sphere._North;
                                    break;

                                // south pole
                                case (i + 1 === divisions * 2 && j + 1 === divisions):
                                    self._Fields[i][j] = self._Sphere._South;
                                    break;

                                // everything else
                                default:
                                    self._Fields[i][j] = new Field(
                                        self._Sphere,
                                        self,
                                        (i + 1 % divisions === 0 || j + 1 % divisions === 0)
                                    );
                                    break;
                            }

                        }else{
                            // the field belongs in a different section and needs to be stitched
                            self._Fields[i][j] = null;
                        }
                    }
                }(divisions))

            }
        }(divisions * 2));

    }

    module.exports = Section;

}(module));