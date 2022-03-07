import AttachmentAnker from "../attachments/anker";
import AttachOverlay from "../base/attach-overlay";
import DefaultPin from "../base/pin";
import Instandable from "../instandable";

const __TYPE__ = "SimpleDisplayMode";
export default class SimpleDisplayMode extends Instandable {
  
  _modeName:string;
  _onFinishedFn:Function = ()=> { };
  _choosenPins:any = { };
  _index:number = 0;
  _requiredCount:number;

  constructor( onFinishedFn:Function, modeName:string = "BASIC", requiredCount:number ) {
    super( );
    this._extAdd( __TYPE__ );

    this._modeName = modeName;
    this._onFinishedFn = onFinishedFn;
    this._requiredCount = requiredCount;
  }

  addPinPos( targetPin:DefaultPin, ankerPos:AttachmentAnker ) : void {
    this._choosenPins[ targetPin.getID( ) ] = {
      pin: targetPin,
      anker: ankerPos,
      index: this._index
    };

    this._index++;
  }

  removePinPos( pinID:string ) : void {
    delete this._choosenPins[ pinID ];
  }

  getAllChoosenPins( ) : any/*DefaultPin*/ {
    let resultList:any/*DefaultPin*/[] = [ ];

    for (let curPinID in this._choosenPins)
      resultList.push( this._choosenPins[ curPinID ] );

    return resultList;
  }

  getSortedList( ) : any/*DefaultPin*/ {
    return this.getAllChoosenPins( ).sort(
      (chooseInfoA:any, chooseInfoB:any) => chooseInfoA.index - chooseInfoB.index
    )
  }

  getAnkerCount( ) : number {
    let count:number = 0;

    for (let i in this._choosenPins)
      count++;

    return count;
  }

  onDisplayModeValueChanged( targetPinAttachOver:AttachOverlay, pos:AttachmentAnker, newState:boolean ) : void {
    let targetPin:DefaultPin = targetPinAttachOver._targetPinScope;
    let targetPinID:string = targetPin.getID( );
    let targetSlot:DefaultPin = this._choosenPins[ targetPinID ];

    if (targetSlot === undefined && newState)
      this.addPinPos( targetPin, pos );
    else this.removePinPos( targetPinID );

    if (this.getAnkerCount( ) >= this._requiredCount) 
      this._finished( );
  }

  start( ) : void {
    document.body.classList.add( "custom-can-display--display-mode---open" );

    this._choosenPins = { };
    this._index = 0;
  }

  _finished( ) : void {
    this._onFinishedFn(
      this._modeName,
      this.getSortedList( )
    );

    this.cancle( );
  }

  cancle( ) : void {
    document.body.classList.remove( "custom-can-display--display-mode---open" );
  }
}