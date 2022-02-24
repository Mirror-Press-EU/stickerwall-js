
const EVENT_KEYS = [ "onScopeChanged", "onValueChanged", "onEditorModeChanged" ];

import PinUtilitys from '../base/pin.utils';
import BasisPin from '../base/pin';
import AttachmentAnker from './anker';
import Instandable from '../instandable';
import CostumEvtHndl from '../costum-event-handle';

/*
 *  Verbindet PIN & POS & ATTACHMENTS
 */
export default class Attachment extends Instandable {
  _targetPin = null;
  _ankerPos = null;

  _events = { };

  constructor( targetPin, ankerPos ) {
    super( );
    this._extAdd( "attachment" );
    this.defineEvents( EVENT_KEYS );

    if (typeof ankerPos === "object" && ankerPos.pos)
      ankerPos = ankerPos.pos;

    this.addAnker( targetPin, ankerPos );
  }

  defineEvents( newEventKeys ) {
    if (typeof newEventKeys === "object") {
      if (newEventKeys instanceof Array) {

        newEventKeys.forEach(
          (curKey) => this._events[curKey] = new CostumEvtHndl( )
        );

      } else this._events = Object.assign( this._events, newEventKeys );
    }
  }

  addAnker( targetPin, ankerObj ) {
    if (targetPin && ankerObj) {
      this._targetPin = targetPin;
      this._ankerPos = ankerObj;
    }
  }
  getPin( ) { return this._targetPin; }
  getAnker( ) { return this._ankerPos; }

  serializeToJSON( ) {
    return {
      pinID: this._targetPin.getID( ),
      pos: this._ankerPos.serializeToJSON( )
    };
  }

}