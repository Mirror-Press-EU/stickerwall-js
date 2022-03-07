import SimpleDisplayMode from "./simple-display-mode";

const __TYPE__ = "ConnectDisplayMode";
export default class ConnectDisplayMode extends SimpleDisplayMode {

  constructor( onFinishedFn:Function ) {
    super( onFinishedFn, "CONNECT", 2 );
    this._extAdd( __TYPE__ );
  }
  
}