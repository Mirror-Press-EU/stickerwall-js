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

const EVENT_KEYS:string[] = [ 'onValueChanged', 'onEditorModeChanged', 'onKeyActions', 'onMouseActions' ];
const EVENT_NODES_KEYS:string[] = [ 'onPinClick', 'onPinFocusChanged', 'onPinValueChanged' ];

export default class StickerWallManager {
  _dropAnimation:any = null;
  _pressedKeyMapping:any = { };
  _canDrawer:CanvasDrawer;
  _loadedFolder:PinFolder;
  _pinToolbar:any;
  _events:any = { };

  constructor( ) {
    this.defineEvents( EVENT_KEYS );
    this.defineEvents( EVENT_NODES_KEYS );

    this.addDefaultEventHandles( );

    this.prepareCanvas( );

    //this.toolbox;

    //this.loadFromJSON( );
  }


 /*| ____________
--*| --- INIT ---
--*/

  //#region
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

  //#region --- Init Canvas ---
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
  //#endregion --- Init Canvas ---

  //#region --- Bindings ---
  _bindAllEvents( ) : void {
    window.onkeyup = (e:any) => this._pressedKeyMapping[e.keyCode] = false;
    window.onkeydown = (e:any) => this._pressedKeyMapping[e.keyCode] = true;
  }

  private addDefaultEventHandles( ) : void {
    if (this._loadedFolder) {
      [ 'onPinMouseover', 'onPinMouseout', 'onPinClick', 'onPinFocus', 'onPinMoving', 'onPinMoved' ].forEach(

        (curEvtName:string) => this._loadedFolder.addEventListener(
          curEvtName, (p1:any, targetPin:Pin) => this._triggerEvent( curEvtName, p1, targetPin)
        )

      );
    }
      /*this._loadedFolder
      .addEventListener( )
      'mouseover': (p1:any, p2:any)=>  this._triggerEvent( 'mouseover', p1, p2 ),
      'mouseout': (p1:any, p2:any)=>  this._triggerEvent( 'mouseout', p1, p2 ),
      'click': (p1:any, p2:any)=>  this._triggerEvent( 'click', p1, p2 ),
      'focus': (p1:any, p2:any)=>  this._triggerEvent( 'focus', p1, p2 ),
      'moving': (p1:any, p2:any)=>  this._triggerEvent( 'moving', p1, p2 ),
      'moved': (p1:any, p2:any)=>  this._triggerEvent( 'moved', p1, p2 ),*/
  }
  //#endregion --- Bindings ---

  //#endregion

  /*| ______________
 --*| --- GETTER ---
 --*/

//#region 
  getCanDrawer( ) : CanvasDrawer {
    return this._canDrawer;
  }

  getPinFolder( ) : PinFolder {
    return this._loadedFolder;
  }

  getNextRandomID( prefix:any ) : string {
    return this._loadedFolder.getNextRandomID( prefix );
  }
//#endregion

 /*| ____________________
--*| --- EVENT HANDLE ---
--*/

//#region 

  defineEvent( newEventKey:string ) {
    this._events[newEventKey] = new CustomEvtHndl( )
  }

  defineEvents( newEventKeys:any ) {
    let scope = this;
    if (typeof newEventKeys === "object") {
      if (newEventKeys instanceof Array) {

        newEventKeys.forEach(
          (curKey:string) => scope.defineEvent( curKey )
        );

      } else scope._events = Object.assign( scope._events, newEventKeys );
    }
  }

  addEventListener( targetEvtName:string, callFn:Function ) : StickerWallManager {
    let targetEvtHndlr = this._events[ targetEvtName ];
    if (targetEvtHndlr) targetEvtHndlr.add( callFn );

    return this;
  }

  _triggerEvent( targetEvtName:string, param1:any = null, param2:any = null ) : void {
    let targetEvtHndlr = this._events[ targetEvtName ];

    if (targetEvtHndlr)
      targetEvtHndlr.trigger( param1, param2 );
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
    animation.ticker = new Konva.Animation( (frame:any) => {
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
//#endregion

 /*| ___________
--*| --- ADD ---
--*/

//#region 
  addPinNode( newPin:DefaultPin, eventMappingObj:any={} ) : void {
    let scope = this;

    if (!this._loadedFolder)
      return console.warn( "Pin cannot added to, without loaded PinWall! First create or open a PinWall Project!" );
    
    // Storage
    if (!this._loadedFolder.pinIsDefined( newPin ))
      this._loadedFolder.addPinNode( newPin, eventMappingObj );
    /*else
      return console.warn( "Pin cannot add to Canvas, the Node is declare before...!" );*/

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
        pinInfoA.anker,

        pinInfoB.pin,
        pinInfoB.anker,
      )
    );
  }
//#endregion

 /*| ______________
--*| --- CREATE ---
--*/

  deployNewFolder( newPinFolder:PinFolder=null, cleanUpFolderEvents:boolean=false, eventMappingObj:any={} ) : void {
    if (!newPinFolder)
      newPinFolder = new PinFolder( );

    this._loadedFolder = newPinFolder;
    
    if (cleanUpFolderEvents) 
      newPinFolder.cleanUpEvents( );

    newPinFolder.getAllPins( ).forEach(
      (curPin) => this.addPinNode( curPin, eventMappingObj )
    );
    newPinFolder.getAttachmentList( ).forEach(
      (curAttach) => this.addAttachment( curAttach )
    );

    this._loadedFolder.addEventListener(
      'dragstart', (targetPin:any)=> {
        debugger;
        targetPin._blueprint.setOpacity( 1.0 );
        targetPin._container.setOpacity( 0.87 );
      }
    ).addEventListener(
      'dragend', (targetPin:any)=> {
        debugger;
        targetPin._blueprint.setOpacity( 0.0 );
        targetPin._container.setOpacity( 1.0 );
        targetPin.startDropAnimation( targetPin );
      },
    ).addEventListener(
      'mouseover', ()=> document.body.style.cursor = 'pointer'
    ).addEventListener(
      'mouseout', ()=> document.body.style.cursor = 'default'
    );
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
      { title, text }
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

    this.deployNewFolder( loadingFolder );
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