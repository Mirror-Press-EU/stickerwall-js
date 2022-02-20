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

  validatePositionString( posStr ) {
    return this.getKeys( ).indexOf( posStr ) >= 0;
  }

  setPosition( posStr ) {
    posStr = posStr.toLowerCase( );

    if (this.validatePositionString( posStr ))
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