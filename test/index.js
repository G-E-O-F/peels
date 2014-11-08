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
    chaiAsPromised = require("chai-as-promised"),
    q = require('q'),
    expect = chai.expect,
    _ = require('lodash');

chai.should();
chai.use(chaiAsPromised);

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

            var xi = [], yi = [], id = q.defer();

            z._Sections[0].each(function(val, x, y){

                xi[x] = true;
                yi[y] = true;

                if(val == null){
                    id.reject("Unlinked field.");
                }
                if(x === 0){
                    if(y === 0){
                        if(val !== z._North){
                            id.reject("Couldn't find north pole.");
                        }
                    }else{
                        if(val._Section._index !== 4){
                            id.reject('Wrong section index.');
                        }
                    }
                }else
                if(y+1 === z._divisions){
                    if(x+1 === z._divisions * 2){
                        if(val !== z._South){
                            id.reject("Couldn't find south pole.");
                        }
                    }else
                    if(val._Section._index !== 4){
                        id.reject('Wrong section index.');
                    }
                }
            }, function(){

                if((xi.length === (z._divisions * 2)) && (yi.length === z._divisions)){
                    id.resolve();
                }else{
                    id.reject('Wrong range of values in sections.');
                }

            });

            return id.promise.should.eventually.be.fulfilled;

        });

        // TODO: write more tests.

    });

});
