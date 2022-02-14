import PinFolder from './pin-folder';
import DefaultPin from './pins/pin';

const EVENT_KEYS = [ "onScopeChanged", "onValueChanged", "onEditorModeChanged", "onKeyActions", "onMouseActions", "onShapePushed" ];

export default class StickerWallManager {
  _loadedFolder;

  constructor( ) {
    this.prepareCanvas( );
    this.defineEvents( EVENT_KEYS );

    this.loadFromJSON( );
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
    
    this._loadedFolder.addPinNode( newPin );
  }

  addAttachments( newAttach, ankerDirectionList ) {
    this._loadedFolder.addAttachment( newAttach );
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
--*| --- Storing ---
--*/

  loadFromJSON( serialJsonData ) {
    let jsonObj = (typeof serialJsonData === "string")
      ? JSON.parse( serialJsonData ) : serialJsonData;
      
    this._loadedFolder = new PinFolder( ).loadFromJSON( serialJsonData );
  }
  exportFolderToJSON( ) {
    return this._loadedFolder.exportToJSON( );
  }


 /*| _______________
--*| --- Display ---
--*/

  setDisplayMode( ) { }
  setDisplayZoom( newZoomFloat ) { // .25 (25%) -> 1.75 (175%)

  }
}