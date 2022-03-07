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
  _position:string = POS_MAPPING.center;

  constructor( position:string="center" ) {

    super( );
    this._extAdd( "attachment-anker" );

    this.setPosition( position );

  }

  getPositionMapping( ) : any {
    return POS_MAPPING;
  }

  getKeys( ) : string[] {

    let resultKeys:string[] = [ ];
    
    for (let key in this.getPositionMapping( ))
      resultKeys.push( key );

    return resultKeys;

  }

  getPosKey( ) : string {
    return this._position;
  }

  setPosition( posStr:string ) : void {
    posStr = posStr.toUpperCase( );

    if (PinUtils.anker.validatePositionString( posStr ))
      this._position = posStr;
  }

  equals( posStr:string ) : boolean {
    return this._position.toUpperCase( ) === posStr;
  }

  serializeToJSON( ) : any {
    return {
      type: "attachment-anker",
      value: this._position
    }
  }
}