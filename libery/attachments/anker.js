import PinUtils from "../base/pin.utils";
import Instandable from "../instandable";

const POS_MAPPING = {
  top: 'TOP', topRight: 'TOP-RIGHT',
  right: 'RIGHT', rightBottom: 'RIGHT-BOTTOM',
  bottom: 'BOTTOM', bottomLeft: 'BOTTOM-LEFT',
  left: 'LEFT', leftTop: 'LEFT-TOP',
  center: 'CENTER'
};

export default class AttachmentAnker extends Instandable {
  _position = POS_MAPPING.center;

  constructor( position ) {
    super( );
    this._extAdd( "attachment-anker" );

    this.setPosition( position );
  }

  getPositionMapping( ) { return POS_MAPPING; }

  getKeys( ) {
    let resultKeys = [ ];
    
    for (let key in this.getPositionMapping( ))
      resultKeys.push( key );

    return resultKeys;
  }

  getPosKey( ) {
    return this._position;
  }

  setPosition( posStr ) {
    posStr = posStr.toUpperCase( );

    if (PinUtils.anker.validatePositionString( posStr ))
      this._position = posStr;
  }

  equals( posStr ) {
    return this._position.toUpperCase( ) === posStr;
  }

  serializeToJSON( ) {
    return {
      type: "attachment-anker",
      value: this._position
    }
  }
}