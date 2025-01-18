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

const {find, filter} = require('lodash');

const unlabled = field => typeof field.data.strand === 'undefined';

module.exports = function(sphere, nPerStrand){
  'use strict';

  var seed = sphere._Fields[0],
      marked = 0,
      cStrand = 0;

  while(seed){

    let queue = new Set([seed]);

    while(queue.size < nPerStrand && queue.size < (sphere._Fields.length - marked)){

      let toAdd = [];

      queue.forEach(
        field => {
          toAdd = toAdd.concat(
            filter( field._adjacentFields, adjacent => unlabled(adjacent) && !queue.has(adjacent) )
          );
        }
      );

      if(toAdd.length === 0){
        break;
      }else{
        toAdd.forEach( field => queue.add(field) );
      }

    }

    let q = 0;

    queue.forEach(field=>{

      if(q < nPerStrand){
        field.data = { strand: cStrand };
        marked ++;
        q ++;
      }

    });

    seed = find(sphere._Fields, unlabled);

    cStrand ++;

  }

};