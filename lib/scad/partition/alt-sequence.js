/*
 * Copyright (c) 2016 Will Shown. All Rights Reserved.
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

'use strict';

module.exports = function(sphere, nPerStrand){

  sphere._Fields.forEach(field=>{

    var i = field._i,
        nF = sphere._Fields.length,
        d = sphere._divisions;

    var s, p;

    if(i === 0) // North is the first member of the first strand
    {s = 0; p = 0;}

    else if (i === 1) // South is the last member of the last strand
    {s = Math.floor(nF / nPerStrand); p = nF % nPerStrand}

    else{

      // TODO: flip indexing for odd-numbered sections

      s = Math.floor( (i - 1) / nPerStrand );

      p = (i - 1) % nPerStrand;

    }

    field.data = { strand: s, point: p };

  });

};