import PinFolder from './pin-folder';
import PinLinkQoute from './pins/link-qoute';
import PinNotice from './pins/notice';
import DefaultPin from './base/pin';
import CanvasDrawer from './can-drawer';

const EVENT_KEYS = [ "onScopeChanged", "onValueChanged", "onEditorModeChanged", "onKeyActions", "onMouseActions", "onShapePushed" ];

export default class StickerWallManager {
  _pressedKeyMapping = { };
  _canDrawer;
  
  _loadedFolder;

  constructor( ) {
    this.defineEvents( EVENT_KEYS );

    this.prepareCanvas( );

    //this.toolbox;

    //this.loadFromJSON( );
  }


 /*| ____________
--*| --- INIT ---
--*/

  // --- Init Canvas ---
  prepareCanvas( ) {
    this._canDrawer = new CanvasDrawer( "canvas-display", this._pressedKeyMapping );
  }


 /*| ____________________
--*| --- EVENT HANDLE ---
--*/

  defineEvents( newEventKeys ) {
    if (typeof { } === "object" && !(newEventKeys instanceof Array))
    this._events = Object.assign( this._events, newEventKeys );
  }

  onGuiKeyDown( ) { this._pressedKeyMapping[e.keyCode] = true; }
  onGuiKeyUp( ) { this._pressedKeyMapping[e.keyCode] = false; }


 /*| ___________
--*| --- ADD ---
--*/

  addPinNode( newPin ) {
    // Bindings
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
    
    // Storage
    this._loadedFolder.addPinNode( newPin );

    // Drawing
    this._canDrawer.drawPin( newPin.getDisplayNode( ) );
  }

  addAttachments( newAttach, ankerDirectionList ) {
    this._loadedFolder.addAttachment( newAttach, ankerDirectionList );
  }


 /*| ______________
--*| --- CREATE ---
--*/

  deployNewFolder( ) {
    this._loadedFolder = new PinFolder( );
  }

  createPinNode( x, y, id ) {
    this.addPinNode( new Pin(
      x, y, id
    ) );
  }
  
  createPinLinkQuote( x, y, id, cover, title, text ) {
    this.addPinNode( new PinLinkQoute(
      x, y, id,
      cover, title, text
    ) );
  }
  createPinNotice( x, y, id, title, text ) {
    this.addPinNode( new PinNotice(
      x, y, id,
      title, text
    ) );
  }


 /*| _____________
--*| --- Storage ---
--*/

  loadFromJSON( serialJsonData ) {
    let jsonObj = (typeof serialJsonData === "string")
      ? JSON.parse( serialJsonData ) : serialJsonData;
      
    this._loadedFolder = new PinFolder( ).loadFromJSON( jsonObj );
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