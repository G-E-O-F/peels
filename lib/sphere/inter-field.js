var centroid = require('./positions').centroid,
    intArr = require('./int-arr');

function getInterfieldTriangles() {

  var n          = this._Fields.length,
      triangles  = intArr(n - 1, (2 * n - 4) * 3);

  for (let f = 0; f < n; f += 1) {

    let field = this._Fields[f];

    if (f > 1) { // not North or South

      var n1i = field._adjacentFields[0]._i,
          n2i = field._adjacentFields[1]._i,
          n3i = field._adjacentFields[2]._i,
          f1  = f * 2 - 4,
          f2  = f * 2 - 3;

      triangles[f1 * 3 + 0] = n2i;
      triangles[f1 * 3 + 1] = n1i;
      triangles[f1 * 3 + 2] = f;

      triangles[f2 * 3 + 0] = n3i;
      triangles[f2 * 3 + 1] = n2i;
      triangles[f2 * 3 + 2] = f;

    }

  }

  return triangles;

}

function getInterfieldCentroids() {

  var n         = this._interfieldTriangles.length / 3,
      centroids = new Float64Array(2 * n);

  for (let v = 0; v < n; v += 1) {

    let c = centroid(
      this._Fields[this._interfieldTriangles[3 * v + 0]].position,
      this._Fields[this._interfieldTriangles[3 * v + 1]].position,
      this._Fields[this._interfieldTriangles[3 * v + 2]].position
    );

    centroids[2 * v + 0] = c.φ;
    centroids[2 * v + 1] = c.λ;

  }

  return centroids;

}

function _faceIndex(i, a1, a2) {

  var ts = this._interfieldTriangles,
      f1 = i * 2 - 4,
      f2 = i * 2 - 3;

  if (
    (ts[f1 * 3 + 1] === a1 || ts[f1 * 3 + 1] === a2) &&
    (ts[f1 * 3 + 0] === a1 || ts[f1 * 3 + 0] === a2)
  ) {
    return f1;
  }

  if (
    (ts[f2 * 3 + 1] === a1 || ts[f2 * 3 + 1] === a2) &&
    (ts[f2 * 3 + 0] === a1 || ts[f2 * 3 + 0] === a2)
  ) {
    return f2;
  }

  return -1;

}

function _getTriangleIndex(fi1, fi2, fi3) {

  var c;

  c = _faceIndex.call(this, fi1, fi2, fi3);

  if (c >= 0) return c;

  c = _faceIndex.call(this, fi2, fi1, fi3);

  if (c >= 0) return c;

  c = _faceIndex.call(this, fi3, fi1, fi2);

  if (c >= 0) return c;

  throw new Error(`Could not find triangle index for faces: ${fi1}, ${fi2}, ${fi3}`);

}

function getInterfieldIndices(){

  var n          = this._Fields.length,
      indices    = intArr(this._interfieldTriangles.length / 3, 6 * n);

  for (let f = 0; f < n; f += 1) {

    let field = this._Fields[f],
        sides = field._adjacentFields.length;

    for (let s = 0; s < sides; s += 1) {

      let a1 = field.adjacent(s)._i,
          a2 = field.adjacent((s + 1) % sides)._i;

      indices[ 6 * f + s ] = _getTriangleIndex.call(this, field._i, a1, a2);

    }

  }

  return indices;

}

module.exports = {
  getInterfieldTriangles,
  getInterfieldCentroids,
  getInterfieldIndices
};