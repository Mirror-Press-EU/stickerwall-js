import Pin from "../base/pin";

export default class PinNotice extends Pin {
  _title:string;
  _text:string;

  constructor( posX:number, posY:number, dataIdentifyer:string, title:string, text:string ) {
    super( posX, posY, dataIdentifyer );

    this._title = title;
    this._text = text;
  }
} 