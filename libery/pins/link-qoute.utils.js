export default {
  getZoomValueFromImageSize( domImg, dispW, dispH ) {
    let defaultZoom = 1.00;

    if (domImg.width > dispW *1.125) {
      defaultZoom /= domImg.width / dispW;
    }

    if (domImg.height * defaultZoom < dispH) {
      defaultZoom = 1.00 / (domImg.width / dispW);
    }

    return defaultZoom;
  },
  fetchImage( imgUrl, callback ) {
    let coverImage = new Image( );
    coverImage.onload = (evt) => callback( coverImage, true );
    coverImage.src = imgUrl;
    /*fetch( imgUrl ).then(
      resp => callback( resp.blob, true )
    ).catch(
      err => callback( err, false )
    );*/
  }
};