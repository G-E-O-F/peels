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

var assert = require('assert'),
    chai = require('chai'),
    expect = chai.expect,
    _ = require('lodash');

chai.should();

describe('Sphere', function(){

    var Sphere = require('../lib/sphere');

    var s = new Sphere({
        divisions: 1
    });

    var z = new Sphere({
        divisions: 8
    });

    describe('constructor', function(){

        it('should have 5 sections.', function(){
            return s._Sections.length.should.equal(5);
        });

        it('should populate fields in sections the right way.', function(){
            var thingsAreGood = true;
            z._Sections[0].each(function(val, x, y){
                if(val == null){
                    thingsAreGood = false;
                }
                if(x === 0){
                    if(y === 0){
                        if(val !== z._North){
                            thingsAreGood = false;
                        }
                    }else{
                        if(val._Section._index !== 4){
                            thingsAreGood = false;
                        }
                    }
                }else
                if(y+1 === z._divisions){
                    if(x+1 === z._divisions * 2){
                        if(val !== z._South){
                            thingsAreGood = false;
                        }
                    }else
                    if(val._Section._index !== 4){
                        thingsAreGood = false;
                    }
                }
            });
            return thingsAreGood;
        });

        // TODO: write more tests.

    });

});
