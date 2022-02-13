import DefaultPin from './pins/pin';

const EVENT_KEYS = [ "onScopeChanged", "onValueChanged", "onUpdated", "onEditorModeChanged" ];

export default class PinFolderManager {
  _nodes = [ ];
  _attachments = [ ];
  _events = { };

  constructor( ) {
    this.prepareCanvas( );
    this.defineEvents( EVENT_KEYS );
  }


 /*| ____________
--*| --- INIT ---
--*/

  prepareCanvas( ) { }


 /*| ____________________
--*| --- EVENT HANDLE ---
--*/

  defineEvents( newEventKeys ) {
    if (typeof { } === "object" && !(newEventKeys instanceof Array))
    this._events = Object.assign( this._events, newEventKeys );
  }


 /*| ___________
--*| --- ADD ---
--*/

  addPinNode( newPin ) {
    newPin.bindAllEvents( {
      'dragstart': _=> {
        newPin._blueprint.setOpacity( 1.0 );
        newPin._container.setOpacity( 0.87 );
      },
      'dragend': _=> {
        newPin._blueprint.setOpacity( 0.0 );
        newPin._container.setOpacity( 1.0 );
      },
      'mouseover': _=> document.body.style.cursor = 'pointer',
      'mouseout': _=> document.body.style.cursor = 'default'
    } );
    
    this._nodes.add( newPin );
  }

  addAttachments( newAttach, ankerDirectionList ) {
    ankerDirectionList.forEach(
      (curAnker) => curAnker.ownerPin.addAttachment( newAttach )
    );

    this._attachments.push( newAttach );
  }


 /*| ______________
--*| --- CREATE ---
--*/

  createPinNode( serialJson ) {
    this.addPinNode( new Pin(
      serialJson.values.x, serialJson.valuesy, serialJson.id
    ) );
  }


 /*| _____________
--*| --- Store ---
--*/

  loadFromJSON( ) { }
  exportToJSON( ) { }


 /*| _______________
--*| --- Display ---
--*/

  setDisplayMode( ) { }
  setDisplayZoom( newZoomFloat ) { // .25 (25%) -> 1.75 (175%)

  }
}