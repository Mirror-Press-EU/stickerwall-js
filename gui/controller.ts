const getEl = (collection:any, stringID:string) => collection[ stringID ];
const MDCInit = ( MDCClass:any, cssQueryStr:string ) => {
  let resultMap:any = {
    get( key:string ) {
      return this[key];
    }
  };
  
  let allResults = document.querySelectorAll( cssQueryStr );

  for (let iRes:number=0; iRes < allResults.length; iRes++) {
    let domEl:any = allResults[ iRes ];
    let domID:string = domEl.getAttribute( 'id' );

    if (!domID) {
      let childIdEl = domEl.querySelector( '[id]' );
      if (childIdEl) domID = childIdEl.getAttribute( 'id' )
    }

    let instance:any = new MDCClass( domEl );
    if (domID) resultMap[ domID ] = instance;
  };

  return resultMap;
};

import { MDCRipple } from '@material/ripple';
import { MDCTextField } from '@material/textfield';
import { MDCSlider } from '@material/slider';

import StickerWallManager from '../libery/sticker-wall';
import QuoteModifyDialog from './mdl/dialogs/qoute-modify-dialogs';
import CostumZoomBar from './zoom-bar';
import PinConnection from '../libery/attachments/connection';
import ConnectDisplayMode from '../libery/display-modes/connect-display-mode';

export default class Controller {
  controlls:any;
  stickerWall:StickerWallManager;

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

  initAllDialogs( ) : void {
    /*[ this.controlls.qouteDialog, this.controlls.noticeDialog ]*/
    let QuoteModifyDialogEl:any = document.getElementById( 'dialog--mod-pin-qoute' );

    this.controlls.dialogs.modifyPinQoute.container = new QuoteModifyDialog(
      QuoteModifyDialogEl,
      [ "title", "text" ], this.controlls.dialogs.modifyPinQoute,
      this.stickerWall
    );
  }

  initGui( ) : void {
    //const app_list = MDCInit( MDCList, '.mdc-list' );
    const app_buttons = MDCInit( MDCRipple, '.mdc-button' );
    const app_textFields = MDCInit( MDCTextField, '.mdc-text-field' );
    const app_slider = MDCInit( MDCSlider, '.mdc-slider' );

    this.controlls = {
      collection: { app_buttons, app_textFields, app_slider },

      canvasDisplay: document.getElementById( "canvas-display" ),
      canvasImagePattern: document.getElementById( "can-dis-img-pattern"),
      saveFolderButton: getEl( app_buttons, 'save-folder' ),
      cancleDisplayMode: getEl( app_buttons, 'display-mode-cancle' ),
      
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

      getElement: ( attrPathList:any, callback:Function ) => {
        if (!callback) callback = (el:HTMLElement) => el;
        let resultEl:any = this.controlls;
      
        attrPathList.forEach( (curAttrKey:string) => {
          if (resultEl !== null)
            resultEl = (resultEl[ curAttrKey ])
              ? resultEl[ curAttrKey ]
              : null; 
        } );
      
        return callback( resultEl );
      },
      setElement: ( attrPathList:any, newValue:any, callback:Function ) => {
        if (!callback) callback = (el:HTMLElement) => el;
        let resultEl:any = this.controlls.getElement( attrPathList );
    
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

  loadFolderFromLocalStorage( ) : void {
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

  bindButtonsEvents( ) : void {

    // --- GUI-Module ---
    this.bindZoomBar( );
    this.bindToolBox( );

    // --- Buttons ---
    this.bindSaveButton( );
    this.bindCancleDisplayModeButton( );

    // --- Open Dialogs ---
    this.bindCreateQouteButton( );
    this.bindCreateConnectionButton( );
  }

  bindZoomBar( ) : void {
    let zoomBarControllMapping:any = this.controlls.getElement( [ 'sidebar', 'zoom' ] );

    if (zoomBarControllMapping && this.stickerWall) this.controlls.setElement(
      [ 'sidebar', 'zoom', 'instance' ], // Path to Target Value
      new CostumZoomBar(
        zoomBarControllMapping,
        this.stickerWall.getCanDrawer( )
      )
    );
  }

  bindCancleDisplayModeButton( ) : void {
    let scope:Controller = this;
    let cancleDisplayMode = this.controlls.getElement( [ 'cancleDisplayMode' ] );

    if (cancleDisplayMode) 
      cancleDisplayMode.root.addEventListener(
        'click', ()=> scope.stickerWall.cancleDisplayMode( )
      )
  }

  bindSaveButton( ) {
    let canDisplay = this.controlls.getElement( [ 'canvasDisplay' ] );
    let saveFolderButton = this.controlls.getElement( [ 'saveFolderButton' ] );

    if (saveFolderButton && canDisplay) {
      saveFolderButton.root.addEventListener(
        'click', ()=> {
          saveFolderButton.root.classList.remove( "changed" );
          //localStorage.setItem( 'folder', this.stickerWall.exportToJSON( ) ); // @ToDo: Export to JSON
        }
      );
      canDisplay.addEventListener(
        'click', ()=> saveFolderButton.root.classList.add( "changed" )
      );
    }
  }

  bindToolBox( ) {
    let openToolBoxButton = this.controlls.getElement( [ 'toolbox', 'openButton' ] );
    
    if (openToolBoxButton) openToolBoxButton.root.addEventListener(
      "click", ()=> this.onOpenUtilityListClicked( )
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

  onCreateQouteButtonClicked( ) {
    this.closeUtilityList( );
    let quoteDialog = this.controlls.getElement( [ 'dialogs', 'modifyPinQoute', 'container' ] );
    quoteDialog.fillFormular( "CREATE" );
    quoteDialog.open( );
  }

  bindCreateQouteButton( ) {
    let createQouteButton = this.controlls.getElement( [ 'toolbox', 'createButtons', 'qoute' ] );
    let modQouteDialog = this.controlls.getElement([ 'dialogs', 'modifyPinQoute', 'container' ]);

    if (modQouteDialog && createQouteButton) createQouteButton.root.addEventListener(
      "click", ()=> this.onCreateQouteButtonClicked( )
    );
  }

  onEditorModeFinished(modeNameStr:string, choosenAnkerList:any) {
    console.log(modeNameStr, choosenAnkerList);

    switch (modeNameStr) {
      case "CONNECT":
        let pinInfoA = choosenAnkerList[0], pinInfoB = choosenAnkerList[1];
        this.stickerWall.attachPinConnection( pinInfoA, pinInfoB );
        break;
    }

    this.stickerWall.cancleDisplayMode( );
  }

  bindCreateConnectionButton( ) {
    let createConnectionButton = this.controlls.getElement( [ 'toolbox', 'createButtons', 'connection' ] );

    if (createConnectionButton)
      createConnectionButton.root.addEventListener( "click", ()=> {
        let targetPinFolder = this.stickerWall.getPinFolder( );

        if (targetPinFolder.getPinCount( ) >= 2)
          this.stickerWall.startDisplayMode(

            new ConnectDisplayMode(
              (mode:any, ankerInfo:any) => this.onEditorModeFinished( mode, ankerInfo )
            )
            
          ); // Wechsel alle Pins in den Attaching Mode
        else alert( "Not enough Pins to add a Connection!" );

      });
  }
}