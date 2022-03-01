import PinUtilitys from '../pin-utilitys';
import BasisPin from '../pin';
import AttachmentAnker from './anker';
import Instandable from '../../instandable';

/*
 *  Verbindet PIN & POS & ATTACHMENTS
 */
export default class Attachment extends Instandable {

  _targetPin = null;
  _ankerPos = null;

  constructor( targetPin, ankerPos ) {
    super( );
    this._extAdd( "attachment" );

    if (typeof ankerPos === "object" && ankerPos.pos)
      ankerPos = ankerPos.pos;

    this.addAnker( targetPin, ankerPos );
  }

  addAnker( targetPin, ankerObj ) {
    if (targetPin && ankerObj) {
      this._targetPin = targetPin;
      this._ankerPos = ankerObj;
    }
  }

  /*addListOfAnkers( ankerList ) {
    ankerList.forEach(
      (curAnker) => this.addAnker( curAnker )
    );
  }*/

  getPin( ) { return this._targetPin; }
  //getAnkerList( ) { return this._ankerPosList; }
  getAnker( ) { return this._ankerPos; }

  serializeToJSON( ) {
    return {
      pinID: this._targetPin.getID( ),
      pos: this._ankerPos.serializeToJSON( )
    };
  }

}