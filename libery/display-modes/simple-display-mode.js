import Instandable from "../instandable";

const __TYPE__ = "SimpleDisplayMode";
export default class SimpleDisplayMode extends Instandable {
  
  _modeName = null;
  _onFinishedFn = _=> { };
  _choosenPins = { };
  _index = 0;
  _requiredCount;

  constructor( onFinishedFn, modeName = "BASIC", requiredCount ) {
    super( );
    this._extAdd( __TYPE__ );

    this._modeName = modeName;
    this._onFinishedFn = onFinishedFn;
    this._requiredCount = requiredCount;
  }

  addPinPos( targetPin, ankerPos ) {
    this._choosenPins[ targetPin.getID( ) ] = {
      pin: targetPin,
      anker: ankerPos,
      index: this._index
    };

    this._index++;
  }

  removePinPos( pinID ) {
    delete this._choosenPins[ pinID ];
  }

  getAllChoosenPins( ) {
    let resultList = [ ];

    for (let curPinID in this._choosenPins)
      resultList.push( this._choosenPins[ curPinID ] );

    return resultList;
  }

  getSortedList( ) {
    return this.getAllChoosenPins( ).sort(
      (chooseInfoA, chooseInfoB) => chooseInfoA.index - chooseInfoB.index
    )
  }

  getAnkerCount( ) {
    let count = 0;

    for (let i in this._choosenPins)
      count++;

    return count;
  }

  onDisplayModeValueChanged( targetPinAttachOver, pos, newState ) {
    let targetPin = targetPinAttachOver.pinInstance;
    let targetPinID = targetPin.getID( );
    let targetSlot = this._choosenPins[ targetPinID ];

    if (targetSlot === undefined && newState)
      this.addPinPos( targetPin, pos );
    else this.removePinPos( targetPin );

    if (this.getAnkerCount( ) >= this._requiredCount) 
      this._finished( );
  }

  start( ) {
    document.body.classList.add( "custom-can-display--display-mode---open" );

    this._choosenPins = { };
    this._index = 0;

    //this._triggerAllPinsEvent( "onEditorModeChanged", true );
  }

  _finished( ) {
    this._onFinishedFn(
      this._modeName,
      this.getSortedList( )
    );
    //this._triggerAllPinsEvent( "onEditorModeChanged", false );

    this.cancle( );
  }

  cancle( ) {
    document.body.classList.remove( "custom-can-display--display-mode---open" );
    //this._triggerAllPinsEvent( "onEditorModeChanged", false );
  }
}