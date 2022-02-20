import Instandable from './instandable';

export default class CostumEvtHndl extends Instandable {
  _callbacks = [ ];
  constructor( defaultCallbackList ) {
    super( );

    if (defaultCallbackList instanceof Function)
      this.add( defaultCallbackList );
    if (defaultCallbackList instanceof Array)
      this._callbacks = defaultCallbackList;
    else if (defaultCallbackList != null)
      console.warn( "CostumEvtHndl Constructor require a Function/Array<Function> as first Parameter (CallbackFunction)" );
  }
  add( callFn ) {
    if (callFn instanceof Function)
      this._callbacks.push( callFn );
    else
      console.warn( "AddEventListener require a Function as first Parameter (CallbackFunction)" );
  }

  trigger( param1, param2 ) {
    if (this._callbacks) this._callbacks.forEach(
      (curCall) => curCall( param1, param2 )
    );
  }
}