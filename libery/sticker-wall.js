import PinFolder from './pin-folder';
import PinLinkQoute from './pins/link-qoute';
import PinNotice from './pins/notice';
import DefaultPin from './base/pin';
import CanvasDrawer from './can-drawer';

const EVENT_KEYS = [ "onScopeChanged", "onValueChanged", "onEditorModeChanged", "onKeyActions", "onMouseActions", "onShapePushed" ];

export default class StickerWallManager {
  _dropAnimation = null;
  _pressedKeyMapping = { };
  _canDrawer;
  _loadedFolder;
  _pinToolbar;

  constructor( ) {
    this.defineEvents( EVENT_KEYS );

    this.prepareCanvas( );

    //this.toolbox;

    //this.loadFromJSON( );
  }


 /*| ____________
--*| --- INIT ---
--*/

  initKonvaCan( ) {
    let scope = this;

    // Add PinEditToolbox  
    /*let toolboxActCalls = {
      editActionFn: ( selPin, cUpEvt ) => {
        let quoteDialog = scope.getElement( [ 'dialogs', 'modifyPinQoute', 'container' ] );
        quoteDialog.fillFormular( "MODIFY", selPin.values );
        quoteDialog.open( );
      },
      removedActionFn: (selPin) => scope.pinFolder.removePin( selPin ),
    };
    this._pinToolbar = new PinToolbar( toolboxActCalls );*/

    // Add
    this.initDropAnimation( );
  }

  // --- Init Canvas ---
  prepareCanvas( ) {
    this._canDrawer = new CanvasDrawer( "canvas-display", this._pressedKeyMapping );
    this.initDropAnimation( );
  }

  initDropAnimation( ) {
    this._dropAnimation = {
      ticker: null,
      targetShape: new Konva.Circle({ radius: 64, fill: 'rgba(0,0,196,.25)', opacity: 0 }),
    };

    this._dropAnimation.targetShape.hide( );
    this._canDrawer.drawOnBackground( this._dropAnimation.targetShape );
  }


  // --- Bindings ---
  _bindAllEvents( ) {
    window.onkeyup = (e) => this.pressedKeyMapping[e.keyCode] = false;
    window.onkeydown = (e) => this.pressedKeyMapping[e.keyCode] = true;
  }


  /*| ______________
 --*| --- GETTER ---
 --*/

  getCanDrawer( ) {
    return this._canDrawer;
  }

  getPinFolder( ) {
    return this._loadedFolder;
  }

  getNextRandomID( prefix ) {
    return this._loadedFolder.getNextRandomID( prefix );
  }


 /*| ____________________
--*| --- EVENT HANDLE ---
--*/

  defineEvents( newEventKeys ) {
    if (typeof { } === "object" && !(newEventKeys instanceof Array))
    this._events = Object.assign( this._events, newEventKeys );
  }

  onGuiKeyDown( ) { this._pressedKeyMapping[e.keyCode] = true; }
  onGuiKeyUp( ) { this._pressedKeyMapping[e.keyCode] = false; }

  startDropAnimation( targetPin ) {
    let pM = this;
    let targetPinCenterPos = this._canDrawer._stage.getRelativePointerPosition( ); // targetPin.getCenterPosition( );
    let animation = this._dropAnimation;

    if (animation.ticker) animation.ticker.stop( );

    animation.targetShape.scale({ x: 0, y: 0 });
    animation.targetShape.setPosition( targetPinCenterPos );
    animation.targetShape.show( );

    let tickCount = 0;
    animation.ticker = new Konva.Animation( (frame) => {
      //let scale = Math.sin((frame.time * 2 * Math.PI) / 2000) + 0.001;
      let scale = tickCount / 25;
      animation.targetShape.scale({ x: scale, y: scale });
      animation.targetShape.setOpacity( 0.02 * (100 - (2 * tickCount)) );

      if (tickCount > 50) {
        animation.targetShape.hide( );
        animation.ticker.stop( )
        tickCount = 0;
      } else tickCount++;
    }, this._canDrawer._backgroundLayer );
    
    animation.ticker.start( )
  }


 /*| ___________
--*| --- ADD ---
--*/

  addPinNode( newPin ) {
    let scope = this;

    if (!this._loadedFolder)
      return console.warn( "Pin cannot added to, without loaded PinWall! First create or open a PinWall Project!" );
    
    // Bindings
    newPin.bindAllEvents( {
      'dragstart': _=> {
        newPin._blueprint.setOpacity( 1.0 );
        newPin._container.setOpacity( 0.87 );
      },
      'dragend': _=> {
        newPin._blueprint.setOpacity( 0.0 );
        newPin._container.setOpacity( 1.0 );
        scope.startDropAnimation( newPin );
      },
      'mouseover': _=> document.body.style.cursor = 'pointer',
      'mouseout': _=> document.body.style.cursor = 'default'
    } );
    
    // Storage
    this._loadedFolder.addPinNode( newPin );

    // Drawing
    this._canDrawer.drawPin( newPin.getDisplayNode( ) );
  }

  addAttachments( newAttach, ankerDirectionList ) {
    this._loadedFolder.addAttachment( newAttach, ankerDirectionList );
  }


 /*| ______________
--*| --- CREATE ---
--*/

  deployNewFolder( ) {
    this._loadedFolder = new PinFolder( );
  }

  createPinNode( x, y, id ) {
    let newNode = new Pin(
      x, y, id
    )

    this.addPinNode( newNode );
    return newNode;
  }
  
  createPinLinkQuote( x, y, id, cover, title, text ) {
    let newNode = new PinLinkQoute(
      x, y, id,
      cover, title, text
    );

    this.addPinNode( newNode );
    return newNode;
  }
  createPinNotice( x, y, id, title, text ) {
    let newNode = new PinNotice(
      x, y, id,
      title, text
    )

    this.addPinNode( newNode );
    return newNode;
  }


 /*| _____________
--*| --- Storage ---
--*/

  loadFromJSON( serialJsonData ) {
    let jsonObj = (typeof serialJsonData === "string")
      ? JSON.parse( serialJsonData ) : serialJsonData;
      
    this._loadedFolder = new PinFolder( ).loadFromJSON( jsonObj );
  }

  exportFolderToJSON( ) {
    return this._loadedFolder.exportToJSON( );
  }


 /*| _______________
--*| --- Display ---
--*/

  setDisplayMode( ) { }
  setDisplayZoom( newZoomFloat ) { // .25 (25%) -> 1.75 (175%)

  }
}