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
  var validate = require('../lib/sphere/validate');
  var Field = require('../lib/field');
  var λφ = require('../lib/sphere/set-λφ');

  // `s` is a sphere that is essentially an icosahedron, good for testing that strange case.
  var s = new Sphere({
    divisions: 1
  });

  // `z` is a sphere with two hexagons per edge and a hexagon in the middle of each triangle.
  var z = new Sphere({
    divisions: 3
  });

  describe('constructor', function () {

    describe('adjacent field linking', function () {

      it('should connect the north pole’s adjacent fields.', function () {
        return z._North._adjacentFields.length.should.equal(5) &&
          z._North.adjacent(0).should.equal(z._Fields[0][0][0]) &&
          z._North.adjacent(1).should.equal(z._Fields[1][0][0]) &&
          z._North.adjacent(2).should.equal(z._Fields[2][0][0]) &&
          z._North.adjacent(3).should.equal(z._Fields[3][0][0]) &&
          z._North.adjacent(4).should.equal(z._Fields[4][0][0]);
      });

      it('should connect the south pole’s adjacent fields.', function () {
        var dy = z._divisions,
            dx = dy * 2;
        return dy.should.equal(3) && dx.should.equal(6) &&
          z._South._adjacentFields.length.should.equal(5) &&
          z._South.adjacent(0).should.equal(z._Fields[0][dx - 1][dy - 1]) &&
          z._South.adjacent(1).should.equal(z._Fields[1][dx - 1][dy - 1]) &&
          z._South.adjacent(2).should.equal(z._Fields[2][dx - 1][dy - 1]) &&
          z._South.adjacent(3).should.equal(z._Fields[3][dx - 1][dy - 1]) &&
          z._South.adjacent(4).should.equal(z._Fields[4][dx - 1][dy - 1]);
      });

      it('should connect one of the northern tropical pentagon’s adjacent fields.', function () {
        var northTropPent = s._Fields[0][0][0];
        return northTropPent._adjacentFields.length.should.equal(5) &&
          northTropPent.adjacent(0).should.equal(s._North) &&
          northTropPent.adjacent(1).should.equal(s._Fields[4][0][0]) &&
          northTropPent.adjacent(2).should.equal(s._Fields[4][1][0]) &&
          northTropPent.adjacent(3).should.equal(s._Fields[0][1][0]) &&
          northTropPent.adjacent(4).should.equal(s._Fields[1][0][0]);
      });

      it('should connect one of the southern tropical pentagon’s adjacent fields.', function () {
        var southTropPent = s._Fields[0][1][0];
        return southTropPent._adjacentFields.length.should.equal(5) &&
          southTropPent.adjacent(0).should.equal(s._Fields[0][0][0]) &&
          southTropPent.adjacent(1).should.equal(s._Fields[4][1][0]) &&
          southTropPent.adjacent(2).should.equal(s._South) &&
          southTropPent.adjacent(3).should.equal(s._Fields[1][1][0]) &&
          southTropPent.adjacent(4).should.equal(s._Fields[1][0][0]);
      });

      it('should connect one of the north-northeastern edge’s hexagon’s adjacent fields.', function () {
        var nNEHex = z._Fields[0][0][0];
        return nNEHex.adjacent(0).should.equal(z._North) &&
          nNEHex._adjacentFields.length.should.equal(6) &&
          nNEHex.adjacent(1).should.equal(z._Fields[4][0][0]) &&
          nNEHex.adjacent(2).should.equal(z._Fields[0][0][1]) &&
          nNEHex.adjacent(3).should.equal(z._Fields[0][1][0]) &&
          nNEHex.adjacent(4).should.equal(z._Fields[1][0][1]) &&
          nNEHex.adjacent(5).should.equal(z._Fields[1][0][0]);
      });

      it('should connect one of the east-northeastern edge’s hexagon’s adjacent fields.', function () {
        var dy = z._divisions,
            eNEHex = z._Fields[0][dy][0];
        return dy.should.equal(3) &&
          eNEHex._adjacentFields.length.should.equal(6) &&
          eNEHex.adjacent(0).should.equal(z._Fields[0][dy - 1][0]) &&
          eNEHex.adjacent(1).should.equal(z._Fields[0][dy - 1][1]) &&
          eNEHex.adjacent(2).should.equal(z._Fields[0][dy][1]) &&
          eNEHex.adjacent(3).should.equal(z._Fields[0][dy + 1][0]) &&
          eNEHex.adjacent(4).should.equal(z._Fields[1][1][dy - 1]) &&
          eNEHex.adjacent(5).should.equal(z._Fields[1][0][dy - 1]);
      });

      it('should connect one of the southeastern edge’s hexagon’s adjacent fields.', function () {
        var dy = z._divisions,
            dx = dy * 2,
            sEHex = z._Fields[0][dx - 1][1];
        return dy.should.equal(3) && dx.should.equal(6) &&
          sEHex._adjacentFields.length.should.equal(6) &&
          sEHex.adjacent(0).should.equal(z._Fields[0][dx - 2][1]) &&
          sEHex.adjacent(1).should.equal(z._Fields[0][dx - 2][2]) &&
          sEHex.adjacent(2).should.equal(z._Fields[0][dx - 1][2]) &&
          sEHex.adjacent(3).should.equal(z._Fields[1][dy + 1][dy - 1]) &&
          sEHex.adjacent(4).should.equal(z._Fields[1][dy][dy - 1]) &&
          sEHex.adjacent(5).should.equal(z._Fields[0][dx - 1][0]);
      });

      it('should connect one of the section-internal hexagon’s adjacent fields.', function () {
        var dy = z._divisions,
            dx = dy * 2,
            innerHex = z._Fields[0][dy][1];
        return dy.should.equal(3) && dx.should.equal(6) &&
          innerHex._adjacentFields.length.should.equal(6) &&
          innerHex.adjacent(0).should.equal(z._Fields[0][dy - 1][1]) &&
          innerHex.adjacent(1).should.equal(z._Fields[0][dy - 1][2]) &&
          innerHex.adjacent(2).should.equal(z._Fields[0][dy][2]) &&
          innerHex.adjacent(3).should.equal(z._Fields[0][dy + 1][1]) &&
          innerHex.adjacent(4).should.equal(z._Fields[0][dy + 1][0]) &&
          innerHex.adjacent(5).should.equal(z._Fields[0][dy][0]);
      });

    });

  });

  describe('serialization', function(){

    // `so` is the serialized version of `s`
    var so = {
      north: {},
      south: {},
      divisions: 1,
      fields: [
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
        fields: [
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
        fields: [
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
        fields: [
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
        fields: [
          [[{}], [{}]],
          [[{}], [{}]],
          [[{}], [{}, {}]],
          [[{}], [{}]],
          [[{}], [{}]]
        ]
      };

      it('should validate well-formed serializations.', function(){
        return validate(so).should.be.true;
      });

      it('should not validate badly-formed serializations.', function(){
        return validate(s1).should.be.false;
      });

      it('should not validate badly-formed serializations.', function(){
        return validate(s2).should.be.false;
      });

      it('should not validate badly-formed serializations.', function(){
        return validate(s3).should.be.false;
      });

      it('should not validate badly-formed serializations.', function(){
        return validate(s4).should.be.false;
      });

    });

    describe('de-serialization', function(){

      // `haysphereData` is the serialized version of `s` with some data in it
      var haysphereData = {
        north: {},
        south: {},
        divisions: 1,
        fields: [
          [[{}], [{}]],
          [[{}], [{ needle: true }]],
          [[{}], [{}]],
          [[{}], [{}]],
          [[{}], [{}]]
        ]
      };

      var haysphere = new Sphere({
        data: haysphereData
      });

      it('should de-serialize data into Sphere instances.', function(){
        return haysphere._Fields[1][1][0].data.needle.should.be.true;
      });

      it('should serialize into the exact same data as input.', function(){
        return haysphere.serialize().should.satisfy(function(hss){
          return _.isEqual(hss, haysphereData);
        });
      })

    });

  });

  describe('data', function(){

      var field = z._Fields[0][1][0];

      it('should be able to get an adjacent field', function(){
        return field.adjacent(0).should.be.an.instanceof(Field);
      });

      it('should be able to get all adjacent fields', function(){
        return field.adjacents().should.be.an.instanceof(Array);
      });

      it('should be able to set data directly when Sphere isn’t iterating.', function(){
        field.data = { apple: 'strudel' };
        return field.data.apple.should.equal('strudel');
      });

      it('should also be able to set data directly when Sphere is on its first iteration.', function(){
        field.data = { apple: 'cobbler' };
        z._iteration = { current: 0 };
        return field.data.apple.should.equal('cobbler');
      });

      it('should not be able to set previous data values when Sphere is on its next iteration.', function(){
        field.data = { apple: 'tart' };
        z._iteration = { previous: 0, current: 1 };
        field.data = { apple: 'pie' };
        return field.data.apple.should.equal('tart');
      });

      it('should point to the latest data values when the Sphere starts a new iteration.', function(){
        z._iteration = { previous: 1, current: 2 };
        return field.data.apple.should.equal('pie');
      });

  });

  describe('geometry', function(){

    describe('navigation', function(){

      var L = Math.acos(Math.sqrt(5) / 5),
          A = 2 * Math.PI / 5,
          tolerance = 1e-10,
          north = {
            λ: 1e-15,
            φ: Math.PI / 2 + 1e-15
          },
          refFirst = {
            λ: 0,
            φ: Math.PI / 2 - L
          },
          refSecond = {
            λ: L,
            φ: Math.PI / 2 - L
          };

      var first = λφ.swim(north, 0, L);

      var second = λφ.swim(refFirst, A, L);

      it('should swim to the first point accurately', function(){
        console.log('Accuracy:', {
          λ: first.λ - refFirst.λ,
          φ: first.φ - refFirst.φ
        });
        return first.λ.should.be.closeTo(refFirst.λ, tolerance) &&
               first.φ.should.be.closeTo(refFirst.φ, tolerance);
      });

      it('should swim to the second point accurately', function(){
        console.log('Accuracy:', {
          λ: second.λ - refSecond.λ,
          φ: second.φ - refSecond.φ
        });
        return second.λ.should.be.closeTo(refSecond.λ, tolerance) &&
               second.φ.should.be.closeTo(refSecond.φ, tolerance);
      });

    });

  });

});
