export default class Controller {
  stickerWall;

  constructor( ) {
    this.stickerWall = new StickerWallManager( );

    // Default "Empty here" Splash Screen
  }

  loadFolderFromLocalStorage( ) {
    let localStorageJsonStr = localStorage.getItem( 'folder' );
    if (localStorageJsonStr) {

      let localStorageJson = JSON.parse( localStorageJsonStr )
      if (localStorageJson) {

        if (localStorageJson.nodes) {
          this.stickerWall.loadFromJSON( localStorageJson );
        }
      }
    }
  }
}