import Pin from "../base/pin";

export default class PinNotice extends Pin {
  _title:string;
  _text:string;

  constructor(
    posX:number = 0,
    posY:number = 0,
    dataIdentifyer:string = null,
    valuesObj:any = { title:null, text:null }
    ) {
    super( posX, posY, dataIdentifyer );

    this.initValues( valuesObj );

    //this.drawAllSprites( );

    //this.updateSize( );
  }
} 