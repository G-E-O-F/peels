<img src="https://rawgit.com/G-E-O-F/peels/www/docs/assets/geof8.min.svg" height="80" title="GEOF.core" style="margin-right: 20px;"/>
<img src="https://rawgit.com/G-E-O-F/peels/www/docs/assets/geof-peels.svg" height="80" title="GEOF.core.peels"/>

[![Build Status](https://travis-ci.org/G-E-O-F/peels.svg)](https://travis-ci.org/G-E-O-F/peels)

A configurable spherical geodesic grid data model designed for simulations.

The literature extolling the virtues of spherical geodesic grids as data models for simulations of 2½D spherical phenomena like oceanography and climate is enormous (see references below), but the algorithms for those simulations are often written for research-oriented platforms, making accessibility and portability a problem.

**Peels** is the first attempt at a JavaScript implementation of the spherical geodesic grid data model for use in browsers or Node. While it was developed as the first component of [GEOF](http://github.com/G-E-O-F), Peels has no gaming-specific functionality and should be useful for other goals as well.

## Usage

Peels is still in development; bear in mind the API is likely to change in the near future.

Peels is not yet hosted on npm. To install, run `npm install --save G-E-O-F/peels`, then `var Sphere = require('peels')` in the modules that need it.

Creating a sphere is as easy as `var sphere = new Sphere();`.

### `Sphere`

The constructor takes an `options` argument.

#### `options.divisions`

When constructing a sphere, you can specify its resolution by passing `divisions: [integer]` in the constructor's options. ‘Divisions’ is the number of times the edges of the sphere's initial icosahedron will be divided. This metric is directly (exponentially) related to the model’s memory consumption.

In the body of research on spherical geodesic grids, resolution is usually described in terms of ‘level’ of division, where each level yields 2<sup><i>n</i></sup> fields along each edge. `divisions` is not this metric; each increment of `divisions` yields <i>n</i> + 1 fields along each edge, allowing much finer control of the sphere's resolution.

## References

- Peels is largely based on the [Spherical Geodesic Grids technique](http://kiwi.atmos.colostate.edu/BUGS/geodesic/) described by Todd D. Ringler, Ross P. Heikes, and David A. Randall at the Department of Atmospheric Science at Colorado State University. Similar implementations exist, but their description was the most helpful.

- 