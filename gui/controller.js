const MDCInit = ( MDCClass, cssQueryStr ) => {
  let resultMap = {
    get( key ) {
      return this[key];
    }
  };
  
  [... document.querySelectorAll( cssQueryStr )].map( (domEl) => {
    let domID = domEl.getAttribute( "id" );

    if (!domID) {
      let childIdEl = domEl.querySelector( '[id]' );
      if (childIdEl) domID = childIdEl.getAttribute( "id" )
    }

    let instance = new MDCClass( domEl );
    if (domID) resultMap[ domID ] = instance;
  } );

  return resultMap;
};

import { MDCRipple } from '@material/ripple';
import { MDCTextField } from '@material/textfield';
import { MDCSlider } from '@material/slider';

import StickerWallManager from '../libery/sticker-wall';

export default class Controller {
  stickerWall;

  constructor( ) {
    this.stickerWall = new StickerWallManager( );
    
    //const app_list = MDCInit( MDCList, '.mdc-list' );
    const app_buttons = MDCInit( MDCRipple, '.mdc-button' );
    const app_textFields = MDCInit( MDCTextField, '.mdc-text-field' );
    const app_slider = MDCInit( MDCSlider, '.mdc-slider' );

    // Default "Empty here" Splash Screen

    // Test Init
    this.stickerWall.deployNewFolder( );
    this.stickerWall.createPinNotice( 100, 100, "test", "test-title", "test text... test text... test text... test text... " );
    //this.stickerWall.loadFolderFromLocalStorage( );
  }

  /*| _____________
 --*| --- Storage ---
 --*/

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


  /*| ____________________
 --*| --- EVENT HANDLE ---
 --*/

  bindButtonsEvents( ) {

    // --- GUI-Module ---
    this.bindZoomBar( );
    this.bindToolBox( );

    // --- Buttons ---
    this.bindSaveButton( )

    // --- Open Dialogs ---
    this.bindCreateQouteButton( );
    this.bindCreateConnection( );
  }

  bindZoomBar( ) {
    let zoomBarControllMapping = this.getElement( [ 'sidebar', 'zoom' ] );

    if (zoomBarControllMapping) this.setElement(
      [ 'sidebar', 'zoom', 'instance' ],
      new CostumZoomBar( zoomBarControllMapping, this.canDrawer )
    );
  }

  bindSaveButton( ) {
    let canDisplay = this.getElement( [ 'canvasDisplay' ] );
    let saveFolderButton = this.getElement( [ 'saveFolderButton' ] );

    if (saveFolderButton && canDisplay) {
      saveFolderButton.root.addEventListener(
        'click', _=> {
          saveFolderButton.root.classList.remove( "changed" );
          localStorage.setItem( 'folder', this.exportToJSON( ) );
        }
      );
      canDisplay.addEventListener(
        'click', _=> saveFolderButton.root.classList.add( "changed" )
      );
    }
  }

  bindToolBox( ) {
    let openToolBoxButton = this.getElement( [ 'toolbox', 'openButton' ] );
    
    if (openToolBoxButton) openToolBoxButton.root.addEventListener(
      "click", ( evt ) => this.onOpenUtilityListClicked( evt )
    );
  }

  bindCreateQouteButton( ) {
    let createQouteButton = this.getElement( [ 'toolbox', 'createButtons', 'qoute' ] );
    let modQouteDialog = this.getElement([ 'dialogs', 'modifyPinQoute', 'container' ]);

    if (modQouteDialog && createQouteButton) createQouteButton.root.addEventListener(
      "click", ( evt ) => this.onCreateQouteButtonClicked( evt )
    );
  }

  bindCreateConnection( ) {
    let createConnectionButton = this.getElement( [ 'toolbox', 'createButtons', 'connection' ] );

    if (createConnectionButton
    &&  this.pinFolder.getPinCount( ) > 0
    ) {
      this.pinFolder.onEditorModeChanged( "onEditorModeChanged", "ATTACHING", this ); // Wechsel alle Pins in den Attaching Mode
    }
  }
}