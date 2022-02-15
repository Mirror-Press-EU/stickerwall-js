import PinLinkQoute from "./pins/link-qoute";
import PinNotice from "./pins/notice";

const EVENT_KEYS = [ "onScopeChanged", "onValueChanged", "onEditorModeChanged", "onKeyActions", "onMouseActions", "onShapePushed" ];

export default class PinFolder {
  _pins = { };
  _attachments = [ ];
  _events = { };

  constructor( canDrawerInstance ) {
    this.defineEvents( EVENT_KEYS );
  }
  

 /*| ___________
--*| --- ADD ---
--*/

  addPinNode( pinInstanceObj ) {
    let pinID = pinInstanceObj.getID( );

    if (!this._pins[ pinID ]) {
      // Events and Handling
      pinInstanceObj.getDisplayNode( ).on( 'dragend', _=> this.startMoveAnimation( pinInstanceObj ) );
      //this._pinToolbar.observePinNode( pinInstanceObj ) // @TODO: PinToolbar

      // Storage
      this._pins[ pinID ] = pinInstanceObj;
    } else console.log( "ID Kollision! Fehler bei Key Regestrierung!" );

    return this;
  }
  
  addAttachment( newAttachment, ankerDirectionList ) {
    ankerDirectionList.forEach(
      (curAnker) => curAnker.ownerPin.addAttachment( newAttach )
    );

    this._attachments.push( newAttachment );
  }

  
 /*| ______________
--*| --- Getter ---
--*/

  getAllPins( ) {
    let pinList = [];
    for (let id in this._pins)
      pinList.push( this._pins[ id ] );

    return pinList;
  }

  getPin( pinID ) {
    if (typeof pinID !== "string") pinID = pinID._dataIdentifyer;
    return this._pins[ pinID ];
  }

  getNextRandomID( prefix ) {
    let idIndex = 0;
    while (this.getPin( prefix + idIndex )) idIndex ++;

    return prefix + idIndex;
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
          scope.pinFolder.addPin( newNode );
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
    if (typeof { } === "object" && !(newEventKeys instanceof Array))
    this._events = Object.assign( this._events, newEventKeys );
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
}