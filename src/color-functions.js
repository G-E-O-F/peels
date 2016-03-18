const toF = 1 / 225;

export default function(){

  return {
    r: toF * 235,
    g: toF * 246,
    b: toF * 247
  }

}

export const highlightIcosahedron = function(){

  var d = this._parent._divisions,
      sxy = this._sxy,
      onEdge = (
        this._i < 2 ||
        (sxy[1] + sxy[2] + 1) % d === 0 ||
        (sxy[1] + 1) % d === 0 ||
        sxy[2] === 0
      );
  if( onEdge ){
    return {
      r: toF * 134,
      g: toF * 171,
      b: toF * 165
    }
  }else{
    return {
      r: toF * 0,
      g: toF * 108,
      b: toF * 127
    }
  }

};

export const useRGB = function(){

  return {
    r: toF * this.data.r,
    g: toF * this.data.g,
    b: toF * this.data.b
  }

};