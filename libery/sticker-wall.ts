import Konva from 'konva';

import CustomEvtHndl from "./custom-event-handle";
import CustomEvtUtils from "./custom-event-handle.utils";

import PinFolder from './pin-folder';
import PinLinkQoute from './pins/link-qoute';
import PinNotice from './pins/notice';
import DefaultPin from './base/pin';
import CanvasDrawer from './can-drawer';
import PinConnection from './attachments/connection';
import AttachmentAnker from './attachments/anker';
import Pin from './base/pin';
import SimpleDisplayMode from './display-modes/simple-display-mode';

const EVENT_KEYS = [ "onFocusChanged", "onValueChanged", "onEditorModeChanged", "onKeyActions", "onMouseActions", "onShapePushed" ];

export default class StickerWallManager {
  _dropAnimation:any = null;
  _pressedKeyMapping:any = { };
  _canDrawer:CanvasDrawer;
  _loadedFolder:PinFolder;
  _pinToolbar:any;

  constructor( ) {
    this.defineEvents( EVENT_KEYS );

    this.prepareCanvas( );

    //this.toolbox;

    //this.loadFromJSON( );
  }


 /*| ____________
--*| --- INIT ---
--*/

  initKonvaCan( ) : void {
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
  prepareCanvas( ) : void {
    this._canDrawer = new CanvasDrawer( "canvas-display", this._pressedKeyMapping );
    this.initDropAnimation( );
  }

  initDropAnimation( ) : void {
    this._dropAnimation = {
      ticker: null,
      targetShape: new Konva.Circle({ radius: 64, fill: 'rgba(0,0,196,.25)', opacity: 0 }),
    };

    this._dropAnimation.targetShape.hide( );
    this._canDrawer.drawOnBackground( this._dropAnimation.targetShape );
  }


  // --- Bindings ---
  _bindAllEvents( ) : void {
    window.onkeyup = (e:any) => this._pressedKeyMapping[e.keyCode] = false;
    window.onkeydown = (e:any) => this._pressedKeyMapping[e.keyCode] = true;
  }


  /*| ______________
 --*| --- GETTER ---
 --*/

  getCanDrawer( ) : CanvasDrawer {
    return this._canDrawer;
  }

  getPinFolder( ) : PinFolder {
    return this._loadedFolder;
  }

  getNextRandomID( prefix:any ) : number {
    return this._loadedFolder.getNextRandomID( prefix );
  }


 /*| ____________________
--*| --- EVENT HANDLE ---
--*/

  defineEvents( newEventKeys:any ) : void {
    CustomEvtUtils.prototype.defineEvents( this, newEventKeys );
  }

  /*onGuiKeyDown( ) { this._pressedKeyMapping[e.keyCode] = true; }
  onGuiKeyUp( ) { this._pressedKeyMapping[e.keyCode] = false; }*/

  startDropAnimation( targetPin:DefaultPin ) :void {
    let pM:StickerWallManager = this;
    let targetPinCenterPos:any = this._canDrawer._stage.getRelativePointerPosition( ); // targetPin.getCenterPosition( );
    let animation:any = this._dropAnimation;

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
    
    animation.ticker.start( );
  }


 /*| ___________
--*| --- ADD ---
--*/

  addPinNode( newPin:DefaultPin ) : void {
    let scope = this;

    if (!this._loadedFolder)
      return console.warn( "Pin cannot added to, without loaded PinWall! First create or open a PinWall Project!" );
    
    // Bindings
    newPin.bindAllEvents( {
      'dragstart': ()=> {
        newPin._blueprint.setOpacity( 1.0 );
        newPin._container.setOpacity( 0.87 );
      },
      'dragend': ()=> {
        newPin._blueprint.setOpacity( 0.0 );
        newPin._container.setOpacity( 1.0 );
        scope.startDropAnimation( newPin );
      },
      'mouseover': ()=> document.body.style.cursor = 'pointer',
      'mouseout': ()=> document.body.style.cursor = 'default'
    } );
    
    // Storage
    this._loadedFolder.addPinNode( newPin );

    // Drawing
    this._canDrawer.drawPin( newPin.getDisplayNode( ) );
  }

  addAttachment( newAttach:any ) : void {
    this._loadedFolder.addAttachment( newAttach );
    this._canDrawer.drawAttachment( newAttach );
  }

  attachPinConnection( pinInfoA:any, pinInfoB:any ) : void {
    this.addAttachment(
      new PinConnection(
        pinInfoA.pin,
        new AttachmentAnker( pinInfoA.anker ),

        pinInfoB.pin,
        new AttachmentAnker( pinInfoB.anker ),
      )
    );
  }


 /*| ______________
--*| --- CREATE ---
--*/

  deployNewFolder( ) : void {
    this._loadedFolder = new PinFolder( );
  }

  createPinNode( x:number, y:number, id:string ) : DefaultPin {
    let newNode = new DefaultPin(
      x, y, id
    )

    this.addPinNode( newNode );
    return newNode;
  }
  
  createPinLinkQuote(
    x:number,
    y:number,
    id:string,
    cover:string,
    title:string,
    text:string
  ) : PinLinkQoute {
    let newNode = new PinLinkQoute(
      x, y, id,
      { cover, title, text, sourceLogo:null }
    );

    this.addPinNode( newNode );
    return newNode;
  }
  createPinNotice(
    x:number,
    y:number,
    id:string,
    title:string,
    text:string
  ) : PinNotice {
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

  loadFromJSON( serialJsonData:string ) : void {
    let jsonObj:any = /*(typeof serialJsonData === "string")
      ? */JSON.parse( serialJsonData )/* : serialJsonData*/;
    
    let loadingFolder:PinFolder = new PinFolder( );
    loadingFolder.loadFromJSON( jsonObj );

    this._loadedFolder = loadingFolder;
  }

  exportFolderToJSON( ) {
    return this._loadedFolder.exportToJSON( );
  }


 /*| _______________
--*| --- Display ---
--*/
  startDisplayMode( newDisplayMode:SimpleDisplayMode /*modeNameStr, newState, onFinishedFunction*/ ) {
    this._loadedFolder.startDisplayMode( newDisplayMode /*modeNameStr, newState, onFinishedFunction*/ );
  }
  cancleDisplayMode( ) {
    this._loadedFolder.cancleDisplayMode( );
  }
  setDisplayZoom( newZoomFloat:number ) { // .25 (25%) -> 1.75 (175%)

  }
}