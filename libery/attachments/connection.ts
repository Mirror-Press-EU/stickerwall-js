import ConnectionUtilitys from './conection.utils';

import Shapes from '../base/shapes';
import Attachment from './attachment';
import DefaultPin from '../base/pin';
import AttachmentAnker from './anker';

export default class PinConnection extends Shapes {
  attachments:any = { from:null, dest:null };

  // --- Defaults ---
  constructor( pinA:DefaultPin, ankerPosA:string, pinB:DefaultPin, ankerPosB:string ) {

    super( );

    this._extAdd( "attach-connection-shape" );
    this._shapeType = "attach-connection";

    this.attachments = {
      from: new Attachment( pinA, ankerPosA ),
      dest: new Attachment( pinB, ankerPosB )
    };
    
    // Generate Line and store...
    this.setDisplayNode(
      ConnectionUtilitys.shape.generateLine( )
    );

    this.bindEvents( );

    this.syncAnkerPos( );

  }

  bindEvents( ) : void {
    let pinConScope = this;

    [ this.attachments.from, this.attachments.dest ].forEach(
      (curAttach:Attachment) => {
        let node:any = curAttach.getPin( ).getDisplayNode( );

        node.on(
          'dragend', ()=> pinConScope.syncAnkerPos( )
        );
      }
    );
  }

  syncAnkerPos( ) : void {
    ConnectionUtilitys.shape.updateLine(
      this.getDisplayNode( ),
      this.attachments.from,
      this.attachments.dest
    );
  }

  public override serializeToJSON( ) {
    let attach = this.attachments;

    return super.serializeToJSON( {
      from: attach.from.serializeToJSON( ),
      dest: attach.dest.serializeToJSON( )
    } );
  }
}