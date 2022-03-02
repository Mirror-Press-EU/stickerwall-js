import PinLinkQoute from "./pins/link-qoute";
import PinNotice from "./pins/notice";

import CustomEvtHndl from "./custom-event-handle";
import CustomEvtUtils from "./custom-event-handle.utils";
import DefaultPin from "./base/pin";
import Attachment from "./attachments/attachment";
import SimpleDisplayMode from "./display-modes/simple-display-mode";
import AttachOverlay from "./base/attach-overlay";

const EVENT_KEYS = [ "onFocusChanged", "onValueChanged", "onEditorModeChanged", "onKeyActions", "onMouseActions", "onShapePushed" ];

export default class PinFolder {
  _pins:any = { };
  _attachments:Attachment[] = [ ];
  _events:any = { };
  _displayMode:any;

  constructor( ) {
    this.defineEvents( EVENT_KEYS );
  }
  

 /*| ___________
--*| --- ADD ---
--*/

  onPinNodeClicked( targetPin:DefaultPin ) : void {
    if (this._displayMode)
      if (!this._displayMode.eventIsAllowed( "onFocusChanged" ))
        return;

    let newState = targetPin.toggleSelected( );
    this._triggerPinEvent( targetPin, "onFocusChanged", newState );
  }

  addPinNode( pinInstanceObj:DefaultPin ) : void {

    let scope = this;
    let pinID = pinInstanceObj.getID( );

    if (!this._pins[ pinID ]) {
      // --- Events and Handling ---
      //pinInstanceObj.getDisplayNode( ).on( 'dragend', _=> this.startMoveAnimation( pinInstanceObj ) );
      //this._pinToolbar.observePinNode( pinInstanceObj ) // @TODO: PinToolbar
      pinInstanceObj.addEventListener(

        "click",
        ()=> scope.onPinNodeClicked( pinInstanceObj )

      ).addEventListener(

        "onEditorModeChanged",
        (newState:boolean, a:any, b:any, pinScope:DefaultPin ) => {
          if (newState) pinScope._ankerOverlay.performStart(

            (attOverlayScope:AttachOverlay, targetPos:any, newState:boolean) => {
              if (scope._displayMode) scope._displayMode.onDisplayModeValueChanged( attOverlayScope, targetPos, newState );
            }

          );
          else pinInstanceObj._ankerOverlay.performFinish( );
        }

      )/*.addEventListener(

        "onFocusChanged",
        (targetPin, newState) => scope.setPinFocus( targetPin, newState )

      )*/;

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
          newNode.fromSerialized( pinJsonObj );
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
    let targetEvtHndlr = this._events[ targetEvtName ];
    if (targetEvtHndlr) targetEvtHndlr.add( callFn );

    return this;
  }

  _triggerEvent(
  targetEvtName:string,
  param1:any = null,
  param2:any = null
  ) : void {
    let targetEvtHndlr = this._events[ targetEvtName ];
    if (targetEvtHndlr)
      targetEvtHndlr.trigger( param1, param2 );
  }

  _triggerPinEvent(
  targetPin:DefaultPin,
  eventNameStr:string,
  param1:any = null,
  param2:any = null
  ) : void {
    /*if (typeof targetPin === "string") targetPin = this.getPin( targetPin );*/

    targetPin._triggerEvent( eventNameStr, param1, param2 );
  }

  _triggerAllPinsEvent(
  eventNameStr:string,
  param1:any = null,
  param2:any = null
  ) : void {
    this.getAllPins( ).forEach(
      (curPin:DefaultPin) => this._triggerPinEvent( curPin, eventNameStr, param1, param2 )
    );
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
}