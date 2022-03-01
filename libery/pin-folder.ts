import PinLinkQoute from "./pins/link-qoute";
import PinNotice from "./pins/notice";

import CustomEvtHndl from "./custom-event-handle";
import CustomEvtUtils from "./custom-event-handle.utils";

const EVENT_KEYS = [ "onFocusChanged", "onValueChanged", "onEditorModeChanged", "onKeyActions", "onMouseActions", "onShapePushed" ];

export default class PinFolder {
  _pins = { };
  _attachments = [ ];
  _events = { };
  _displayMode;

  constructor( ) {
    this.defineEvents( EVENT_KEYS );
  }
  

 /*| ___________
--*| --- ADD ---
--*/

  onPinNodeClicked( targetPin ) {
    if (this._displayMode)
      if (!this._displayMode.eventIsAllowed( "onFocusChanged" ))
        return;

    let newState = targetPin.toggleSelected( );
    this._triggerPinEvent( targetPin, "onFocusChanged", newState );
  }

  addPinNode( pinInstanceObj ) {
    let scope = this;
    let pinID = pinInstanceObj.getID( );

    if (!this._pins[ pinID ]) {
      // --- Events and Handling ---
      //pinInstanceObj.getDisplayNode( ).on( 'dragend', _=> this.startMoveAnimation( pinInstanceObj ) );
      //this._pinToolbar.observePinNode( pinInstanceObj ) // @TODO: PinToolbar
      pinInstanceObj.addEventListener(

        "click",
        _=> scope.onPinNodeClicked( pinInstanceObj )

      ).addEventListener(

        "onEditorModeChanged",
        (newState, a, b, pinScope ) => {
          if (newState) pinScope._ankerOverlay.performStart(

            (attOverlayScope, targetPos, newState) => {
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

    return this;
  }
  
  addAttachment( newAttachment ) {
    this._attachments.push( newAttachment );
  }

  
 /*| ______________
--*| --- Getter ---
--*/

  getPin( pinID ) {
    if (typeof pinID !== "string") pinID = pinID._dataIdentifyer;
    return this._pins[ pinID ];
  }

  getAllPins( ) {
    let pinList = [];
    for (let id in this._pins)
      pinList.push( this._pins[ id ] );

    return pinList;
  }

  getPinsMap( ) { return this._pins; }
  getPinCount( ) {
    return this.getAllPins( ).length;
  }

  getNextRandomID( prefix ) {
    let idIndex = 0;
    while (this.getPin( prefix + idIndex )) idIndex ++;

    return prefix + idIndex;
  }

  getAttachmentList( ) { return this._attachments; }

  getAttachmentsFromPin( searchValue ) {
    let resultList = [ ];
    if (searchValue instanceof Pin) searchValue = searchValue.getID;

    if (this._pins[ searchValue ]) {
      this._attachments.forEach( (curAttach) => {
        if (curAttach.getPin( )) {
          resultList.push( curAttach );
        }
      } );
    }

    return resultList;
  }


 /*| ___________
--*| --- Remove ---
--*/

  removePinNode( targetPin ) {

  }
  
  removeAttachment( targetAttachment ) {

  }


 /*| ___________________
--*| --- (Ex-/Im-)port ---
--*/

  loadPinsFromJsonList ( pinJsonObj ) {
    let scope = this;

    if (pinJsonObj.length !== undefined) {
      pinJsonObj.forEach( (curNodeData) => {
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

  loadAttachmentsFromJsonList ( attJsonObj ) {
    let scope = this;

    if (attJsonObj.length !== undefined) {

      attJsonObj.forEach( (curAtta) => {
        switch (curAtta.type.toLowerCase( )) {
          case "connection":
            break;
        }
      } );

    }
  }

  loadFromJSON( jsonObj ) {
    let pins = jsonObj.nodes;
    let atta = jsonObj.attachments

    if (jsonObj.nodes)
      this.loadPinsFromJsonList( pins );

    if (jsonObj.attachments)
      this.loadAttachmentsFromJsonList( atta );
  }

  exportToJSON( ) {
    let resultObj = { nodes:[], attachments:[] };

    if (this.pinFolder !== null) {
      this.pinFolder.getAllPins( ).forEach(
        (curPin) => resultObj.nodes.push( curPin.serializeToJSON( ) )
      );
  
      this.pinFolder.getAttachmentList( ).forEach(
        (curAttach) => resultObj.attachments.push( curAttach.serializeToJSON( ) )
      );
    } else console.error( "Fehler beim exportieren!" );
    

    return JSON.stringify(resultObj) ;
  }


  /*| ______________________
 --*| --- Dynamic Events ---
 --*/

  defineEvents( newEventKeys ) {
    CustomEvtUtils.prototype.defineEvents( this, newEventKeys );
  }

  addEventListener( targetEvtName, callFn ) {
    let targetEvtHndlr = this._events[ targetEvtName ];
    if (targetEvtHndlr) targetEvtHndlr.add( callFn );

    return this;
  }

  _triggerEvent( targetEvtName, param1, param2 ) {
    let targetEvtHndlr = this._events[ targetEvtName ];
    if (targetEvtHndlr)
      targetEvtHndlr.trigger( param1, param2 );
  }

  _triggerPinEvent( targetPin, eventNameStr, param1, param2 ) {
    if (typeof targetPin === "string") targetPin = this.getPin( targetPin );

    targetPin._triggerEvent( eventNameStr, param1, param2 );
  }

  _triggerAllPinsEvent( eventNameStr, param1, param2 ) {
    this.getAllPins( ).forEach(
      (curPin) => this._triggerPinEvent( curPin, eventNameStr, param1, param2 )
    );
  }



  /*| ______________________
 --*| --- Display Methods ---
 --*/

  startDisplayMode( newDisplayMode ) {
    if (this._displayMode) this._displayMode.cancle( );

    if (newDisplayMode.instanceOf( "SimpleDisplayMode" )) {
      this._displayMode = newDisplayMode;
      newDisplayMode.start( );
      
      this._triggerAllPinsEvent( "onEditorModeChanged", true );
    }
  }

  cancleDisplayMode( ) {
    this._displayMode.cancle( );
    this._displayMode = null;
    
    this._triggerAllPinsEvent( "onEditorModeChanged", false );
  }

  clearPinFocus( ) {
    this.getAllPins( ).forEach(
      (curPin) => curPin.setFocus( false )
    );
  }

  setPinFocus( targetPin, newState ) {
    this.clearPinFocus( );

    if (newState)
      targetPin.setFocus( true );
  }
}