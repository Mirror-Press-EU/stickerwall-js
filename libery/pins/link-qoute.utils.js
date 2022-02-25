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
  },
  decoration: {
    icon: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZD0iTTAgMGgyNHYyNEgwVjB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTcuMTcgMTdjLjUxIDAgLjk4LS4yOSAxLjItLjc0bDEuNDItMi44NGMuMTQtLjI4LjIxLS41OC4yMS0uODlWOGMwLS41NS0uNDUtMS0xLTFINWMtLjU1IDAtMSAuNDUtMSAxdjRjMCAuNTUuNDUgMSAxIDFoMmwtMS4wMyAyLjA2Yy0uNDUuODkuMiAxLjk0IDEuMiAxLjk0em0xMCAwYy41MSAwIC45OC0uMjkgMS4yLS43NGwxLjQyLTIuODRjLjE0LS4yOC4yMS0uNTguMjEtLjg5VjhjMC0uNTUtLjQ1LTEtMS0xaC00Yy0uNTUgMC0xIC40NS0xIDF2NGMwIC41NS40NSAxIDEgMWgybC0xLjAzIDIuMDZjLS40NS44OS4yIDEuOTQgMS4yIDEuOTR6Ii8+PC9zdmc+"
  }
};