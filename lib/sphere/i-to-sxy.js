'use strict';

module.exports = function (i, d) {

  if(i === 0){
    return 'NORTH'
  }else

  if(i === 1){
    return 'SOUTH'
  }

  else {

    let l = i - 2,
        x_lim = d * 2,
        y_lim = d;

    let s = Math.floor( l / (x_lim * y_lim)),
        x = Math.floor( (l - s * x_lim * y_lim) / x_lim),
        y = (l - s * x_lim * y_lim - x * x_lim);

    return [s, x, y];

  }

};