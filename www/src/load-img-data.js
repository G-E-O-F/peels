export default function (asset, ready) {

  var img    = document.createElement('img'),
      canvas = document.createElement('canvas'),
      ctx    = canvas.getContext('2d');

  img.addEventListener('load', function (e) {

    canvas.width  = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    ready.call(null, {
      imageData: ctx.getImageData(0, 0, canvas.width, canvas.height).data,
      imageWidth: img.width,
      imageHeight: img.height
    });

    document.body.removeChild(img);

  });

  img.style.position = 'fixed';
  img.style.left     = '110vw';
  img.style.top      = '110vh';

  document.body.appendChild(img);

  img.src = asset;

}