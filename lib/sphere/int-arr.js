const uint8Max  = parseInt('11111111', 2),
      uint16Max = parseInt('1111111111111111', 2),
      uint32Max = parseInt('11111111111111111111111111111111', 2);

function _smallestIntArr(max, size) {

  if (max <= uint8Max) return new Uint8Array(size);
  if (max <= uint16Max) return new Uint16Array(size);
  if (max <= uint32Max) return new Uint32Array(size);

  console.warn('Indices are too large for a typed array buffer.');
  return new Array(size);

}

module.exports = _smallestIntArr;