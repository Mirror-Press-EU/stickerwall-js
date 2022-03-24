import PinLinkQoute from "./pins/link-qoute";
import PinNotice from "./pins/notice";

import CustomEvtHndl from "./custom-event-handle";
import CustomEvtUtils from "./custom-event-handle.utils";
import DefaultPin from "./base/pin";
import Attachment from "./attachments/attachment";
import SimpleDisplayMode from "./display-modes/simple-display-mode";
import AttachOverlay from "./base/attach-overlay";
import Pin from "./base/pin";

const EVENT_KEYS = [ "onPinFocus", "onValueChanged", "onEditorModeChanged", "onKeyActions", "onMouseActions", "onShapePushed" ];

export default class PinFolder {

  protected _pins:any = { };
  protected _attachments:Attachment[] = [ ];
  protected _displayMode:any;
  protected  _curSelectedPin:Pin = null;
  
  public events:any = { };

  constructor( ) {
    this.defineEvents( EVENT_KEYS );
  }
  

 /*| ___________
--*| --- ADD ---
--*/

  onPinNodeClicked( clickEvt:any, targetPin:DefaultPin ) : void {
    // @ToDo better and generic implementation
    /*if (this._displayMode)
      if (!this._displayMode.eventIsAllowed( "onPinFocus" ))
        return;*/

    this._triggerEvent( 'onPinClick', clickEvt, targetPin );

    let newState:boolean = targetPin.toggleSelected( );
    let oldSelPin:Pin = this._curSelectedPin;

    let isSameIns:boolean = targetPin === oldSelPin;
    let targetNewState:boolean = (isSameIns) ? !targetPin.isSelected( ) : true;

    if (!isSameIns && this._curSelectedPin) {
      this._curSelectedPin._displayBlueprint( false );
      this._curSelectedPin = null;
    }
    
    if (targetNewState) {
      this._curSelectedPin = targetPin;
      this._triggerPinEvent( targetPin, "onPinFocus", newState, oldSelPin );
    }
    
    // Set new States
    targetPin._displayBlueprint( targetNewState );
  }

  addPinNode( pinInstanceObj:DefaultPin, eventMappingObj:any={} ) : void {

    let scope = this;
    let pinID = pinInstanceObj.getID( );

    if (!this._pins[ pinID ]) {
      // --- Events and Handling ---
      //this._pinToolbar.observePinNode( pinInstanceObj ) // @TODO: PinToolbar
      pinInstanceObj/*.addEventListener(

        "click",
        ()=> scope.onPinNodeClicked( pinInstanceObj )

      )*/.addEventListener(

        "onEditorModeChanged", (newState:boolean, a:any, b:any, pinScope:DefaultPin ) => {
          let targetAttachOverlay = pinScope.getAttachOverlay( );
          if (newState)
            targetAttachOverlay.performStart(
              (attOverlayScope:AttachOverlay, targetPos:any, newState:boolean) => {
                if (scope._displayMode) scope._displayMode.onDisplayModeValueChanged( attOverlayScope, targetPos, newState );
              }
            );
          else
            targetAttachOverlay.performFinish( );
        }

      ).bindAllEvents( {
        'click':       (p1:any)=>  this.onPinNodeClicked( p1, pinInstanceObj ),
        'mouseover':   (p1:any)=>  this._triggerEvent( 'onPinMouseover', p1, pinInstanceObj ),
        'mouseout':    (p1:any)=>  this._triggerEvent( 'onPinMouseout',  p1, pinInstanceObj ),

        'onMoving':    (p1:any, p2:any, tPin:Pin)=>  this._triggerEvent( 'onPinMoving',    p1, tPin ),
        'onMoved':     (p1:any, p2:any, tPin:Pin)=>  this._triggerEvent( 'onPinMoved',     p1, tPin ),
      }).bindAllEvents( eventMappingObj );

      pinInstanceObj.updatePos( );

      // --- Storage ---
      this._pins[ pinID ] = pinInstanceObj;
    } else console.log( "ID Kollision! Fehler bei Key Regestrierung!" );
    
  }
  
  addAttachment( newAttachment:Attachment ) : void {
    this._attachments.push( newAttachment );
  }

  
 /*| ______________
--*| --- Getter ---
--*/

  getPin( pinID:string ) : any/*DefaultPin*/ {
    return this._pins[ pinID ];
  }

  getAllPins( ) : any/*DefaultPin*/[] {
    let pinList:any/*DefaultPin*/[] = [];

    for (let id in this._pins)
      pinList.push( this._pins[ id ] );

    return pinList;
  }

  getPinsMap( ) : any { return this._pins; }
  getPinCount( ) : number {
    return this.getAllPins( ).length;
  }

  getNextRandomID( prefix:string="" ) {
    let idIndex:number = 0;
    while (this.getPin( prefix + idIndex )) idIndex ++;

    return prefix + idIndex;
  }

  getAttachmentList( ) : Attachment[] { return this._attachments; }

  getAttachmentsFromPinID( targetPinID:string ) : any/*Attachment*/[] {
    let resultList:any/*Attachment*/[] = [ ];

    if (this._pins[ targetPinID ]) {
      this._attachments.forEach( (curAttach) => {
        if (curAttach.getPin( )) {
          resultList.push( curAttach );
        }
      } );
    }

    return resultList;
  }

  getAttachmentsFromPin( targetPin:DefaultPin ) : any/*Attachment*/[] {
    return this.getAttachmentsFromPinID( targetPin.getID( ) );
  }

  getSelectedPin( ) : Pin {
    return this._curSelectedPin;
  }


 /*| ___________
--*| --- Remove ---
--*/

  removePinNode( targetPin:DefaultPin ) : void {

  }
  
  removeAttachment( targetAttachment:Attachment ) : void {

  }


 /*| ___________________
--*| --- (Ex-/Im-)port ---
--*/

  loadPinsFromJsonList ( pinJsonObj:any ) : void {
    let scope = this;

    if (pinJsonObj.length !== undefined) {
      pinJsonObj.forEach( (curNodeData:any) => {
        let newNode = null;

        switch (curNodeData.type.toLowerCase( )) {
          case "link-qoute": newNode = new PinLinkQoute( ); break;
          case "notice": newNode = new PinNotice( ); break;
        }

        if (newNode) {
          newNode.fromSerialized( curNodeData );
          scope.addPinNode( newNode );
        } else console.warn( "Error in Pin serialized routine..." );
      } );
    }
  }

  loadAttachmentsFromJsonList ( attJsonObj:any ) : void {
    if (attJsonObj.length !== undefined) {

      attJsonObj.forEach( (curAtta:any) => {
        switch (curAtta.type.toLowerCase( )) {
          case "connection":
            break;
        }
      } );

    }
  }

  loadFromJSON( jsonObj:any ) : void {
    let pins = jsonObj.nodes;
    let atta = jsonObj.attachments

    if (jsonObj.nodes) this.loadPinsFromJsonList( pins );
    if (jsonObj.attachments) this.loadAttachmentsFromJsonList( atta );
  }

  exportToJSON( ) : string {
    let resultObj:any = { nodes:[], attachments:[] };

    this.getAllPins( ).forEach(
      (curPin) => resultObj.nodes.push( curPin.serializeToJSON( ) )
    );

    this.getAttachmentList( ).forEach(
      (curAttach) => resultObj.attachments.push( curAttach.serializeToJSON( ) )
    );
    
    return JSON.stringify(resultObj) ;
  }


  /*| ______________________
 --*| --- Dynamic Events ---
 --*/

  defineEvents( newEventKeys:any ) : PinFolder {
    CustomEvtUtils.prototype.defineEvents( this, newEventKeys );

    return this;
  }

  addEventListener( targetEvtName:string, callFn:Function ) : PinFolder {
    let targetEvtHndlr = this.events[ targetEvtName ];
    if (targetEvtHndlr) targetEvtHndlr.add( callFn );

    return this;
  }

  _triggerEvent( targetEvtName:string, param1:any = null, param2:any = null ) : void {
    let targetEvtHndlr = this.events[ targetEvtName ];
    if (targetEvtHndlr)
      targetEvtHndlr.trigger( param1, param2 );
  }

  _triggerPinEvent( targetPin:DefaultPin, eventNameStr:string, param1:any = null, param2:any = null ) : void {
    /*if (typeof targetPin === "string") targetPin = this.getPin( targetPin );*/

    targetPin.triggerEvent( eventNameStr, param1, param2 );
  }

  _triggerAllPinsEvent( eventNameStr:string, param1:any = null, param2:any = null ) : void {
    this.getAllPins( ).forEach(
      (curPin:DefaultPin) => this._triggerPinEvent( curPin, eventNameStr, param1, param2 )
    );
  }

  cleanUpEvents( ) : void {
    let allEvtListeners:any = this.events;

    for (let evtListenerKey in allEvtListeners) {
      let evtListener:CustomEvtHndl = allEvtListeners[ evtListenerKey ];

      if (!evtListener && evtListener instanceof CustomEvtHndl)
        evtListener.cleanUp( );
    }
  }


  /*| ______________________
 --*| --- Display Methods ---
 --*/

  startDisplayMode( newDisplayMode:any ) : void {
    if (this._displayMode) this._displayMode.cancle( );

    if (newDisplayMode.instanceOf( "SimpleDisplayMode" )) {
      this._displayMode = newDisplayMode;
      newDisplayMode.start( );
      
      this._triggerAllPinsEvent( "onEditorModeChanged", true );
    }
  }

  cancleDisplayMode( ) : void {
    this._displayMode.cancle( );
    this._displayMode = null;
    
    this._triggerAllPinsEvent( "onEditorModeChanged", false );
  }

  clearPinFocus( ) : void {
    this.getAllPins( ).forEach(
      (curPin:DefaultPin) => curPin.setFocus( false )
    );
  }

  setPinFocus( targetPin:DefaultPin, newState:boolean ) : void {
    this.clearPinFocus( );

    if (newState)
      targetPin.setFocus( true );
  }

  pinIsDefined( targetPin:any ) : boolean {
    return this._pins[ targetPin.getID( ) ] !== undefined
  }
}