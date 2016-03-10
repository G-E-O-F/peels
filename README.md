<img src="https://rawgit.com/G-E-O-F/peels/master/docs/assets/geof-peels.svg" height="120" title="GEOF.core.peels"/>
<img src="https://rawgit.com/G-E-O-F/peels/master/docs/assets/geof8.min.svg" height="120" title="GEOF.core" align="right"/>

[![Build Status](https://travis-ci.org/G-E-O-F/peels.svg)](https://travis-ci.org/G-E-O-F/peels)

### [Demo](http://g-e-o-f.github.io/peels/)

A configurable spherical geodesic grid data model designed for simulations and visualization.

The literature extolling spherical geodesic grids as data models for simulations of 2½D spherical phenomena like oceanography and climate is enormous (see references below), but the algorithms for those simulations are often written for research-oriented platforms (i.e. in FORTRAN), making accessibility and portability an issue.

**Peels** is the first attempt at a JavaScript implementation of the spherical geodesic grid data model for use in browsers or Node. While it was developed as the first component of [GEOF](http://github.com/G-E-O-F), Peels has no gaming-specific functionality and should be useful for other goals as well.

## Usage

First, install:

```bash
npm install --save peels
```

Next, make a sphere:

```javascript
var Sphere = require('peels'),
    sphere = new Sphere({divisions: 8});
```

Peels is still in development; bear in mind the API is likely to change in the near future, especially for methods & properties that begin with an underscore.

### `Sphere` Constructor

The constructor takes an `options` argument.

#### `options.divisions`

When constructing a sphere, you can specify its resolution by passing `divisions: [integer]` in the constructor's options. The value must be greater than zero, since it is the number of times the edges of the sphere's initial icosahedron will be divided. Though there’s no maximum, bear in mind this value is quadratically related to the model's size/complexity.

In the body of research on spherical geodesic grids, resolution is usually described in terms of ‘level’ of division, where each level yields 2<sup><i>n</i></sup> fields along each edge. `divisions` in this algorithm is not this metric; each increment of `divisions` yields <i>n</i> + 1 fields along each edge, i.e. 10<i>n</i><sup>2</sup> + 2 fields across the entire surface of the sphere, allowing much finer control of the model's resolution than most algorithms described in the literature.

#### `options.data`

A sphere model can be reconstituted from serialized JSON data if that data is provided in this value.

The data must be the product of `Sphere.serialize()`.

### `Sphere` Instance Methods

#### `sphere.linearIndex(sxy)`

Given an array of internal coordinates `[s,x,y]` for a field, returns the index of that field if all fields were arranged in a flat, gapless array.

#### `sphere.iterate(perField, done)`

Takes two functions: `perField`, and `done`.

For each field in the sphere, `perField` is called as an async iterator, i.e. with a `done` function as the only argument to be called when processing the field is finished, and with `this` set to the current field.

Once `perField` has been called for all fields in the sphere, `done` is called with an `error` argument which is `null` if no errors occurred.

e.g.:

```javascript
planet.iterate(function(done){
  this.data = {
    temperature: getTemp(this._pos),
    pressure: getPressure(this._pos)
  };
  done();
}, d.resolve);
```

During iteration, every field’s `data` property is only affected after the iteration is complete for all fields, so it's safe to assume an adjacent field’s `data` will be consistent no matter when during the iteration it’s accessed.

#### `sphere.toCG(options)`

Meant to be used in conjunction with [ThreeJS](http://threejs.org/).

Returns an object with the keys `vertices` and `faces` populated by cartesian coordinates and indices required to visualize the model with ThreeJS. Also returns an additional key `colors` if `options` has a `colorFn` function specified.

e.g.:

```javascript
var vfc = planet.toCG(opts);

var geometry = new THREE.Geometry();

_.each(vfc.vertices, function(vertex){
  geometry.vertices.push(
    new THREE.Vector3(vertex.x, vertex.y, vertex.z)
  );
});

_.each(vfc.faces, function(face, fi){
  var triangle = new THREE.Face3(face[0], face[1], face[2]);
  triangle.vertexColors[0] = vfc.colors[face[0]];
  triangle.vertexColors[1] = vfc.colors[face[1]];
  triangle.vertexColors[2] = vfc.colors[face[2]];
  geometry.faces[fi] = triangle;
});

geometry.computeFaceNormals();
geometry.computeVertexNormals();
```

#### `sphere.bindGeometry(geometry, colorFn)`

A convenience function that takes the geometry reference created by ThreeJS and optionally a `colorFn` function and adds them as properties to the sphere model as `this._geometry` and `this._colorFn` respectively so that either can be used during iteration.

### `Field` properties

#### `field.data`

The data stored to this field. It can be anything.

If this is accessed while iterating over all fields in the sphere, `this.data` is the field’s data from the beginning of the iteration. Once iterating over all fields is finished, `this.data` is updated to the new value, if a new value was set.

#### `field._Sphere`

A reference to the field’s parent sphere model.

#### `field.adjacent(i)`

Returns a reference to a field adjacent to this one at index `i`. Twelve fields in the model will be pentagonal and all others are hexagonal, so bear in mind a field will have either 5 or 6 adjacent fields.

#### `field.adjacents()`

Returns an array of the fields adjacent to this one. The length of the array will be either 5 or 6.

#### `field._pos`

An object with spherical latitude/longitude coordinates of the field's barycenter in the style used to navigate Earth **in radians**. The key `λ` is latitude (from 0 to 2π), and the key `φ` is longitude (between π/2 and -π/2, positive is north and negative is south), e.g. a field centered on Seattle would be near:

```json
{
    "φ": 0.8310430088332776,
    "λ": 4.148333263285652
}
```

This property is set during the sphere’s construction and shouldn’t be modified.

## References

- Peels is largely based on the [Spherical Geodesic Grids technique](http://kiwi.atmos.colostate.edu/BUGS/geodesic/) described by Todd D. Ringler, Ross P. Heikes, and David A. Randall at the Department of Atmospheric Science at Colorado State University. Similar implementations exist, but their description was the most helpful.

- A description of sphere discretization: [Finite Differences on the Sphere](http://kiwi.atmos.colostate.edu/group/dave/at604pdf/Chapter_12.pdf), David A. Randall, revised December 7, 2013.

- G. R. Stuhne and W. R. Peltier. “[New Icosahedral Grid-Point Discretizations of the Shallow Water Equations on the Sphere](http://www.atmosp.physics.utoronto.ca/people/amit/refs/stuhne99.pdf)”. Department of Physics, University of Toronto, Toronto, Ontario, Canada. Received April 14, 1998; revised September 9, 1998.
