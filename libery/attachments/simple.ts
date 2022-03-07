import DefaultPin from '../base/pin';
import AttachmentAnker from './anker';
import Instandable from '../instandable';

/*
 *  Verbindet PIN & POS & ATTACHMENTS
 */
export default class Attachment extends Instandable {

  _targetPin:DefaultPin = null;
  _ankerPos:AttachmentAnker = null;

  constructor( targetPin:DefaultPin, ankerPos:any ) {
    
    super( );
    this._extAdd( "attachment" );

    if (typeof ankerPos === "object" && ankerPos.pos)
      ankerPos = ankerPos.pos;

    this.addAnker( targetPin, ankerPos );

  }

  addAnker( targetPin:DefaultPin, ankerObj:AttachmentAnker ) : void {

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