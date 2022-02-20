const getEl = (collection, stringID) => collection[ stringID ];
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
import QuoteModifyDialog from './mdl/dialogs/qoute-modify-dialogs';
import CostumZoomBar from './zoom-bar';

export default class Controller {
  controlls;
  stickerWall;

  constructor( ) {
    this.stickerWall = new StickerWallManager( );
    
    this.initGui( );

    // Default "Empty here" Splash Screen

    // Test Init
    this.stickerWall.deployNewFolder( );
    //this.stickerWall.createPinNotice( 100, 100, "test", "test-title", "test text... test text... test text... test text... " );
    //this.stickerWall.loadFolderFromLocalStorage( );
  }


  /*| ____________
 --*| --- Init ---
 --*/

  initAllDialogs( ) {
    /*[ this.controlls.qouteDialog, this.controlls.noticeDialog ]*/

    this.controlls.dialogs.modifyPinQoute.container = new QuoteModifyDialog(
      document.getElementById( 'dialog--mod-pin-qoute' ),
      [ "title", "text" ], this.controlls.dialogs.modifyPinQoute,
      this.stickerWall
    );
  }

  initGui( ) {
    //const app_list = MDCInit( MDCList, '.mdc-list' );
    const app_buttons = MDCInit( MDCRipple, '.mdc-button' );
    const app_textFields = MDCInit( MDCTextField, '.mdc-text-field' );
    const app_slider = MDCInit( MDCSlider, '.mdc-slider' );

    this.controlls = {
      collection: { app_buttons, app_textFields, app_slider },

      canvasDisplay: document.getElementById( "canvas-display" ),
      saveFolderButton: getEl( app_buttons, 'save-folder' ),
      
      // --- FORM FIELDS ---
      
      // --- OVERLAYS ---
      // Tool Buttons
      sidebar: {
        zoom: {
          instance: null,
          container: document.getElementById( 'ui-zoom-bar' ),
          slider: getEl( app_slider, 'ui-zoom-bar--value-slider' ),
          displayResetZoomButton: getEl( app_buttons, 'ui-zoom-bar--button' )
        }
      },
      toolbox: {
        container: document.getElementById( "utility-list" ),
        openButton: getEl( app_buttons, 'open-utility-list' ),
        createButtons: {
          qoute: getEl( app_buttons, 'dialog--mod-pin-qoute--open' ),
          notice: getEl( app_buttons, 'dialog--mod-pin-notice--open' ),
          connection: getEl( app_buttons, 'display-mode--add-connection--open' ),
        }
      },

      dialogs: {
  
        modifyPinQoute: {
          container: null,
          fields: {
            title: getEl( app_textFields, 'dialog--mod-pin-qoute--v-title' ),
            text: getEl( app_textFields, 'dialog--mod-pin-qoute--v-text' )
          },
          buttons: {
            apply: getEl( app_buttons, 'dialog--mod-pin-qoute--apply' )
          }
        },

        modifyPinNotice: {
          container: null,
          fields: { text: null },
          buttons: { apply: null }
        }
        
      },

      getElement: ( attrPathList, callback ) => {
        if (!callback) callback = (el)=> el;
        let resultEl = this.controlls;
      
        attrPathList.forEach( (curAttrKey) => {
          if (resultEl !== null)
            resultEl = (resultEl[ curAttrKey ])
              ? resultEl[ curAttrKey ]
              : null; 
        } );
      
        return callback( resultEl );
      }, setElement: ( attrPathList, newValue, callback ) => {
        if (!callback) callback = (el)=> el;
        let resultEl = this.controlls.getElement( attrPathList );
    
        resultEl = newValue;
        return callback( resultEl );
      }
    };

    this.stickerWall.initKonvaCan( );

    this.initAllDialogs( );
    this.bindButtonsEvents( );
  }

  /*| _______________
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
    let zoomBarControllMapping = this.controlls.getElement( [ 'sidebar', 'zoom' ] );

    if (zoomBarControllMapping && this.stickerWall) this.controlls.setElement(
      [ 'sidebar', 'zoom', 'instance' ], // Path to Target Value
      new CostumZoomBar(
        zoomBarControllMapping,
        this.stickerWall.getCanDrawer( )
      )
    );
  }

  bindSaveButton( ) {
    let canDisplay = this.controlls.getElement( [ 'canvasDisplay' ] );
    let saveFolderButton = this.controlls.getElement( [ 'saveFolderButton' ] );

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
    let openToolBoxButton = this.controlls.getElement( [ 'toolbox', 'openButton' ] );
    
    if (openToolBoxButton) openToolBoxButton.root.addEventListener(
      "click", ( evt ) => this.onOpenUtilityListClicked( evt )
    );
  }

  onOpenUtilityListClicked( ) {
    let utilityList = this.controlls.getElement( [ 'toolbox', 'container' ] );
    let openUtilityListButton = this.controlls.getElement( [ 'toolbox', 'openButton' ] );

    if (utilityList && openUtilityListButton) {
      if (utilityList.classList.contains( "hide" )) {
        openUtilityListButton.root.classList.add( "is-open" );
        utilityList.classList.remove( "hide" );
      } else {
        this.closeUtilityList( );
      }
    }
  }

  closeUtilityList( ) {
    let utilityList = this.controlls.getElement( [ 'toolbox', 'container' ] );
    let openUtilityListButton = this.controlls.getElement( [ 'toolbox', 'openButton' ] );

    if (utilityList && openUtilityListButton) {
      openUtilityListButton.root.classList.remove( "is-open" );
      utilityList.classList.add( "hide" );
    }
  }

  onCreateQouteButtonClicked( evt ) {
    this.closeUtilityList( );
    let quoteDialog = this.controlls.getElement( [ 'dialogs', 'modifyPinQoute', 'container' ] );
    quoteDialog.fillFormular( "CREATE" );
    quoteDialog.open( );
  }

  bindCreateQouteButton( ) {
    let createQouteButton = this.controlls.getElement( [ 'toolbox', 'createButtons', 'qoute' ] );
    let modQouteDialog = this.controlls.getElement([ 'dialogs', 'modifyPinQoute', 'container' ]);

    if (modQouteDialog && createQouteButton) createQouteButton.root.addEventListener(
      "click", ( evt ) => this.onCreateQouteButtonClicked( evt )
    );
  }

  onEditorModeFinished(a, b, c) {
    console.log(a, b, c);
  }

  bindCreateConnection( ) {
    let createConnectionButton = this.controlls.getElement( [ 'toolbox', 'createButtons', 'connection' ] );

    if (createConnectionButton)
      createConnectionButton.root.addEventListener( "click", _=> {
        let targetPinFolder = this.stickerWall.getPinFolder( );
        if (targetPinFolder.getPinCount( ) >= 2)
          this.stickerWall.setDisplayMode(
            "ATTACHING", true, (a, b, c)=> {
              this.onEditorModeFinished( a, b, c )
            }
          ); // Wechsel alle Pins in den Attaching Mode
        else alert( "Not enough Pins to add a Connection!" );
      });
  }
}