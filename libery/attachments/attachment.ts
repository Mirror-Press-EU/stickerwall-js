import CustomEvtHndl from "../custom-event-handle";
import CustomEvtUtils from "../custom-event-handle.utils";
const EVENT_KEYS = [ "onPinFocus", "onValueChanged", "onEditorModeChanged" ];

import PinUtilitys from '../base/pin.utils';
import DefaultPin from '../base/pin';
import AttachmentAnker from './anker';
import Instandable from '../instandable';

/*
 *  Verbindet PIN & POS & ATTACHMENTS
 */
export default class Attachment extends Instandable {
  _targetPin:DefaultPin = null;
  _ankerPos:any = null;

  _events:any = { };

  constructor( targetPin:DefaultPin, ankerPos:string ) {
    super( );
    this._extAdd( "attachment" );
    this.defineEvents( EVENT_KEYS );

    this.addAnker( targetPin, ankerPos );
  }

  defineEvents( newEventKeys:string[] ) : void {
    CustomEvtUtils.prototype.defineEvents( this, newEventKeys );
  }

  addAnker( targetPin:DefaultPin, ankerObj:any ) : void {
    if (targetPin && ankerObj) {
      this._targetPin = targetPin;
      this._ankerPos = ankerObj;
    }
  }

  getPin( ) :any/*DefaultPin*/ {
    return this._targetPin;
  }

  getAnker( ) : AttachmentAnker {
    return this._ankerPos;
  }

  serializeToJSON( ) {
    return {
      pinID: this._targetPin.getID( ),
      pos: this._ankerPos.serializeToJSON( )
    };
  }

}