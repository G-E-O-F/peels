var centroid = require('./positions').centroid;

function getInterfieldTriangles() {

  var n         = this._Fields.length,
      triangles = new Uint32Array((2 * n - 4) * 3);

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

  var n         = this.interfieldTriangles.length,
      centroids = new Float64Array(2 * n / 3);

  for (let i = 0, j = 0; i < n; i += 3) {

    let c = centroid(
      this._Fields[this.interfieldTriangles[i + 0]].position,
      this._Fields[this.interfieldTriangles[i + 1]].position,
      this._Fields[this.interfieldTriangles[i + 2]].position
    );

    centroids[j + 0] = c.φ;
    centroids[j + 1] = c.λ;

    j += 2;

  }

  return centroids;

}

module.exports = {
  getInterfieldTriangles,
  getInterfieldCentroids
};