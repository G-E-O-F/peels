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

  // `s` is a sphere that is essentially an icosahedron, good for testing that strange case.
  var s = new Sphere({
    divisions: 1
  });

  // `z` is a sphere with two hexagons per edge and a hexagon in the middle of each triangle.
  var z = new Sphere({
    divisions: 3
  });

  describe('constructor', function () {

    it('should have 5 sections.', function () {
      return s._Sections.length.should.equal(5);
    });

    describe('edge linking', function () {

      it('should link the north pole.', function () {
        return z._Sections[0].get(0, 0).should.equal(z._North) &&
          z._Sections[1].get(0, 0).should.equal(z._North) &&
          z._Sections[2].get(0, 0).should.equal(z._North) &&
          z._Sections[3].get(0, 0).should.equal(z._North) &&
          z._Sections[4].get(0, 0).should.equal(z._North);
      });

      it('should link the south pole.', function () {
        var dy = z._divisions,
            dx = dy * 2;
        return dy.should.equal(3) && dx.should.equal(6) &&
          z._Sections[0].get(dx, dy).should.equal(z._South) &&
          z._Sections[1].get(dx, dy).should.equal(z._South) &&
          z._Sections[2].get(dx, dy).should.equal(z._South) &&
          z._Sections[3].get(dx, dy).should.equal(z._South) &&
          z._Sections[4].get(dx, dy).should.equal(z._South);
      });

      it('should connect the northwestern edge.', function () {
        return z._Sections[0].get(0, 0).should.equal(z._North) &&
          z._Sections[0].get(0, 1).should.equal(z._Sections[4].get(1, 0)) &&
          z._Sections[0].get(0, 2).should.equal(z._Sections[4].get(2, 0)) &&
          z._Sections[0].get(0, 3).should.equal(z._Sections[4].get(3, 0));
      });

      it('should connect the southwestern edges.', function () {
        var dy = z._divisions;
        return dy.should.equal(3) &&
          z._Sections[0].get(0, dy).should.equal(z._Sections[4].get(dy, 0)) &&
          z._Sections[0].get(1, dy).should.equal(z._Sections[4].get(dy + 1, 0)) &&
          z._Sections[0].get(2, dy).should.equal(z._Sections[4].get(dy + 2, 0)) &&
          z._Sections[0].get(3, dy).should.equal(z._Sections[4].get(dy * 2, 0)) &&
          z._Sections[0].get(4, dy).should.equal(z._Sections[4].get(dy * 2, 1)) &&
          z._Sections[0].get(5, dy).should.equal(z._Sections[4].get(dy * 2, 2)) &&
          z._Sections[0].get(6, dy).should.equal(z._South);
      });

    });

    describe('adjacent field linking', function () {

      it('should connect the north pole’s adjacent fields.', function () {
        return z._North._adjacentFields.length.should.equal(5) &&
          z._North._adjacentFields[0].should.equal(z._Sections[0].get(1, 0)) &&
          z._North._adjacentFields[1].should.equal(z._Sections[1].get(1, 0)) &&
          z._North._adjacentFields[2].should.equal(z._Sections[2].get(1, 0)) &&
          z._North._adjacentFields[3].should.equal(z._Sections[3].get(1, 0)) &&
          z._North._adjacentFields[4].should.equal(z._Sections[4].get(1, 0));
      });

      it('should connect the south pole’s adjacent fields.', function () {
        var dy = z._divisions,
            dx = dy * 2;
        return dy.should.equal(3) && dx.should.equal(6) &&
          z._South._adjacentFields.length.should.equal(5) &&
          z._South._adjacentFields[0].should.equal(z._Sections[0].get(dx, dy - 1)) &&
          z._South._adjacentFields[1].should.equal(z._Sections[1].get(dx, dy - 1)) &&
          z._South._adjacentFields[2].should.equal(z._Sections[2].get(dx, dy - 1)) &&
          z._South._adjacentFields[3].should.equal(z._Sections[3].get(dx, dy - 1)) &&
          z._South._adjacentFields[4].should.equal(z._Sections[4].get(dx, dy - 1));
      });

      it('should connect one of the northern tropical pentagon’s adjacent fields.', function () {
        var northTropPent = s._Sections[0].get(1, 0);
        return northTropPent._adjacentFields.length.should.equal(5) &&
          northTropPent._adjacentFields[0].should.equal(s._North) &&
          northTropPent._adjacentFields[1].should.equal(s._Sections[4].get(1, 0)) &&
          northTropPent._adjacentFields[2].should.equal(s._Sections[4].get(2, 0)) &&
          northTropPent._adjacentFields[3].should.equal(s._Sections[0].get(2, 0)) &&
          northTropPent._adjacentFields[4].should.equal(s._Sections[1].get(1, 0));
      });

      it('should connect one of the southern tropical pentagon’s adjacent fields.', function () {
        var southTropPent = s._Sections[0].get(2, 0);
        return southTropPent._adjacentFields.length.should.equal(5) &&
          southTropPent._adjacentFields[0].should.equal(s._Sections[0].get(1, 0)) &&
          southTropPent._adjacentFields[1].should.equal(s._Sections[4].get(2, 0)) &&
          southTropPent._adjacentFields[2].should.equal(s._South) &&
          southTropPent._adjacentFields[3].should.equal(s._Sections[1].get(2, 0)) &&
          southTropPent._adjacentFields[4].should.equal(s._Sections[1].get(1, 0));
      });

      it('should connect one of the north-northeastern edge’s hexagon’s adjacent fields.', function () {
        var nNEHex = z._Sections[0].get(1, 0);
        return nNEHex._adjacentFields[0].should.equal(z._North) &&
          nNEHex._adjacentFields.length.should.equal(6) &&
          nNEHex._adjacentFields[1].should.equal(z._Sections[4].get(1, 0)) &&
          nNEHex._adjacentFields[2].should.equal(z._Sections[0].get(1, 1)) &&
          nNEHex._adjacentFields[3].should.equal(z._Sections[0].get(2, 0)) &&
          nNEHex._adjacentFields[4].should.equal(z._Sections[1].get(1, 1)) &&
          nNEHex._adjacentFields[5].should.equal(z._Sections[1].get(1, 0));
      });

      it('should connect one of the east-northeastern edge’s hexagon’s adjacent fields.', function () {
        var dy = z._divisions,
            eNEHex = z._Sections[0].get(dy + 1, 0);
        return dy.should.equal(3) &&
          eNEHex._adjacentFields.length.should.equal(6) &&
          eNEHex._adjacentFields[0].should.equal(z._Sections[0].get(dy, 0)) &&
          eNEHex._adjacentFields[1].should.equal(z._Sections[0].get(dy, 1)) &&
          eNEHex._adjacentFields[2].should.equal(z._Sections[0].get(dy + 1, 1)) &&
          eNEHex._adjacentFields[3].should.equal(z._Sections[0].get(dy + 2, 0)) &&
          eNEHex._adjacentFields[4].should.equal(z._Sections[1].get(2, dy - 1)) &&
          eNEHex._adjacentFields[5].should.equal(z._Sections[1].get(1, dy - 1));
      });

      it('should connect one of the southeastern edge’s hexagon’s adjacent fields.', function () {
        var dy = z._divisions,
            dx = dy * 2,
            sEHex = z._Sections[0].get(dx, 1);
        return dy.should.equal(3) && dx.should.equal(6) &&
          sEHex._adjacentFields.length.should.equal(6) &&
          sEHex._adjacentFields[0].should.equal(z._Sections[0].get(dx - 1, 1)) &&
          sEHex._adjacentFields[1].should.equal(z._Sections[0].get(dx - 1, 2)) &&
          sEHex._adjacentFields[2].should.equal(z._Sections[0].get(dx, 2)) &&
          sEHex._adjacentFields[3].should.equal(z._Sections[1].get(dy + 2, dy - 1)) &&
          sEHex._adjacentFields[4].should.equal(z._Sections[1].get(dy + 1, dy - 1)) &&
          sEHex._adjacentFields[5].should.equal(z._Sections[0].get(dx, 0));
      });

      it('should connect one of the section-internal hexagon’s adjacent fields.', function () {
        var dy = z._divisions,
            dx = dy * 2,
            innerHex = z._Sections[0].get(dy + 1, 1);
        return dy.should.equal(3) && dx.should.equal(6) &&
          innerHex._adjacentFields.length.should.equal(6) &&
          innerHex._adjacentFields[0].should.equal(z._Sections[0].get(dy, 1)) &&
          innerHex._adjacentFields[1].should.equal(z._Sections[0].get(dy, 2)) &&
          innerHex._adjacentFields[2].should.equal(z._Sections[0].get(dy + 1, 2)) &&
          innerHex._adjacentFields[3].should.equal(z._Sections[0].get(dy + 2, 1)) &&
          innerHex._adjacentFields[4].should.equal(z._Sections[0].get(dy + 2, 0)) &&
          innerHex._adjacentFields[5].should.equal(z._Sections[0].get(dy + 1, 0));
      });

    });

  });

  describe('serialization', function(){

    // `so` is the serialized version of `s`
    var so = {
      north: {},
      south: {},
      divisions: 1,
      sections: [
        [[{}], [{}]],
        [[{}], [{}]],
        [[{}], [{}]],
        [[{}], [{}]],
        [[{}], [{}]]
      ]
    };

    it('should match the reference serialization.', function(){
      return s.serialize().should.satisfy(function(ss){ return _.isEqual(ss, so) });
    });

    describe('validation', function(){

      // `s1` is the serialized version of `s` with the wrong number of sections.
      var s1 = {
        north: {},
        south: {},
        divisions: 1,
        sections: [
          [[{}], [{}]],
          [[{}], [{}]],
          [[{}], [{}]],
          [[{}], [{}]],
          [[{}], [{}]],
          [[{}], [{}]]
        ]
      };

      // `s2` is the serialized version of `s` with a bad divisions value.
      var s2 = {
        north: {},
        south: {},
        divisions: 2,
        sections: [
          [[{}], [{}]],
          [[{}], [{}]],
          [[{}], [{}]],
          [[{}], [{}]],
          [[{}], [{}]]
        ]
      };

      // `s3` is the serialized version of `s` with a missing field.
      var s3 = {
        north: {},
        south: {},
        divisions: 1,
        sections: [
          [[{}], [{}]],
          [[{}], [{}]],
          [[{}], [{}]],
          [[{}], ['potato']],
          [[{}], [{}]]
        ]
      };

      // `s4` is the serialized version of `s` with an extra field.
      var s4 = {
        north: {},
        south: {},
        divisions: 1,
        sections: [
          [[{}], [{}]],
          [[{}], [{}]],
          [[{}], [{}, {}]],
          [[{}], [{}]],
          [[{}], [{}]]
        ]
      };

      it('should validate well-formed serializations.', function(){
        return s.validate(so).should.be.true;
      });

      it('should not validate badly-formed serializations.', function(){
        return s.validate(s1).should.be.false;
      });

      it('should not validate badly-formed serializations.', function(){
        return s.validate(s2).should.be.false;
      });

      it('should not validate badly-formed serializations.', function(){
        return s.validate(s3).should.be.false;
      });

      it('should not validate badly-formed serializations.', function(){
        return s.validate(s4).should.be.false;
      });

    });

  });

});
