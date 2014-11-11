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

describe('Sphere', function () {

	var Sphere = require('../lib/sphere');

	var s = new Sphere({
		divisions: 1
	});

	var z = new Sphere({
		divisions: 3
	});

	describe('constructor', function () {

		it('should have 5 sections.', function () {
			return s._Sections.length.should.equal(5);
		});

		describe('edge linking', function(){

			it('should link the north pole.', function(){
				return z._Sections[0].get(0,0).should.equal(z._North) &&
					z._Sections[1].get(0,0).should.equal(z._North) &&
					z._Sections[2].get(0,0).should.equal(z._North) &&
					z._Sections[3].get(0,0).should.equal(z._North) &&
					z._Sections[4].get(0,0).should.equal(z._North);
			});

			it('should link the south pole.', function(){
				var dy = z._divisions,
					dx = dy * 2;
				return z._Sections[0].get(dx,dy).should.equal(z._South) &&
					z._Sections[1].get(dx,dy).should.equal(z._South) &&
					z._Sections[2].get(dx,dy).should.equal(z._South) &&
					z._Sections[3].get(dx,dy).should.equal(z._South) &&
					z._Sections[4].get(dx,dy).should.equal(z._South);
			});

			it('should connect the northwestern edge.', function(){
				// TODO: don't just check null, check that the fields are the correct fields
				return z._Sections[0].get(0,0).should.not.be.null &&
					z._Sections[0].get(0,1).should.not.be.null &&
					z._Sections[0].get(0,2).should.not.be.null &&
					z._Sections[0].get(0,3).should.not.be.null;
			});

			it('should connect the southwestern edges.', function(){
				// TODO: don't just check null, check that the fields are the correct fields
				var dy = z._divisions;
				return z._Sections[0].get(0,dy).should.not.be.null &&
					z._Sections[0].get(1,dy).should.not.be.null &&
					z._Sections[0].get(2,dy).should.not.be.null &&
					z._Sections[0].get(3,dy).should.not.be.null &&
					z._Sections[0].get(4,dy).should.not.be.null &&
					z._Sections[0].get(5,dy).should.not.be.null &&
					z._Sections[0].get(6,dy).should.not.be.null;
			});

		});

		describe('adjacent field linking', function(){

			it('should connect the north pole’s adjacent fields.', function(){
				return z._North._adjacentFields[0].should.equal(z._Sections[0].get(1,0)) &&
					z._North._adjacentFields[1].should.equal(z._Sections[1].get(1,0)) &&
					z._North._adjacentFields[2].should.equal(z._Sections[2].get(1,0)) &&
					z._North._adjacentFields[3].should.equal(z._Sections[3].get(1,0)) &&
					z._North._adjacentFields[4].should.equal(z._Sections[4].get(1,0));
			});

			it('should connect the south pole’s adjacent fields.', function(){
				var dy = z._divisions,
					dx = dy * 2;
				return z._South._adjacentFields[0].should.equal(z._Sections[0].get(dx, dy - 1)) &&
					z._South._adjacentFields[1].should.equal(z._Sections[1].get(dx, dy - 1)) &&
					z._South._adjacentFields[2].should.equal(z._Sections[2].get(dx, dy - 1)) &&
					z._South._adjacentFields[3].should.equal(z._Sections[3].get(dx, dy - 1)) &&
					z._South._adjacentFields[4].should.equal(z._Sections[4].get(dx, dy - 1));
			});

			it('should connect one of the northern tropical pentagon’s adjacent fields.', function(){
				var northTropPent = s._Sections[0].get(1,0);
				return northTropPent._adjacentFields[0].should.equal(s._North) &&
					northTropPent._adjacentFields[1].should.equal(s._Sections[4].get(1,0)) &&
					northTropPent._adjacentFields[2].should.equal(s._Sections[4].get(2,0)) &&
					northTropPent._adjacentFields[3].should.equal(s._Sections[0].get(2,0)) &&
					northTropPent._adjacentFields[4].should.equal(s._Sections[1].get(1,0));
			});

			it('should connect one of the southern tropical pentagon’s adjacent fields.', function(){
				var southTropPent = s._Sections[0].get(2,0);
				return southTropPent._adjacentFields[0].should.equal(s._Sections[0].get(1,0)) &&
					southTropPent._adjacentFields[1].should.equal(s._Sections[4].get(2,0)) &&
					southTropPent._adjacentFields[2].should.equal(s._South) &&
					southTropPent._adjacentFields[3].should.equal(s._Sections[1].get(2,0)) &&
					southTropPent._adjacentFields[4].should.equal(s._Sections[1].get(1,0));
			});

			// TODO: it should connect one of the north-northeastern edge’s hexagon’s adjacent fields.
			// TODO: it should connect one of the east-northeastern edge’s hexagon’s adjacent fields.
			// TODO: it should connect one of the southeastern edge’s hexagon’s adjacent fields.
			// TODO: it should connect one of the section-internal hexagon’s adjacent fields.

		});

	});

});
