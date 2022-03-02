import Instandable from './instandable';

export default class CustomEvtHndl extends Instandable {
  _callbacks:Function[] = [ ];

  constructor( defaultCallbackList:any=null ) {
    super( );

    if (defaultCallbackList instanceof Function) this.add( defaultCallbackList );
    if (defaultCallbackList instanceof Array) this._callbacks = defaultCallbackList;
    else if (defaultCallbackList != null)
      console.warn( "CustomEvtHndl Constructor require a Function/Array<Function> as first Parameter (CallbackFunction)" );
  }

  add( callFn:Function ) : void {
    if (callFn instanceof Function)
      this._callbacks.push( callFn );
    else
      console.warn( "AddEventListener require a Function as first Parameter (CallbackFunction)" );
  }

  trigger( param1:any, param2:any, param3:any, param4:any ) : void {
    if (this._callbacks) this._callbacks.forEach(
      (curCall) => curCall( param1, param2, param3, param4 )
    );
  }
}