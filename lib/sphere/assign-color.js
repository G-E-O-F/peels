(function(module){

  var _ = require('lodash');

  module.exports = function(field, color){
    var Sphere = this,
        d = Sphere._divisions;

    var n0i = Sphere.linearIndex(field._sxy);

    _.each(Sphere._geometryMap[n0i], function(vi, fi){
      Sphere._geometry.faces[parseInt(fi)].vertexColors[vi] = color;
    });

    Sphere._geometry.colorsNeedUpdate = true;

  };

}(module));