import ConnectionUtilitys from './conection.utils';

import Shapes from '../base/shapes';
import Attachment from './attachment';

export default class PinConnection extends Shapes {
  attachments = { from:null, dest:null };

  // --- Defaults ---
  constructor( pinA, ankerPosA, pinB, ankerPosB ) {
    super( );
    this._extAdd( "attach-connection-shape" );
    this._shapeType = "attach-connection";

    if (!pinA.instanceOf( "pin-base" )
    ||  !pinB.instanceOf( "pin-base" )
    ||  !ankerPosA.instanceOf( "attachment-anker" )
    ||  !ankerPosB.instanceOf( "attachment-anker" )
    ) console.error( "PinConnection constructor requier 2 Pin & 2 Attachment-Anker Parameters!" );

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

  bindEvents( ) {
    let pinConScope = this;

    [ this.attachments.from, this.attachments.dest ]
    .forEach( function (curAttach) {
      let node = curAttach.getPin( ).getDisplayNode( );
      node/*.on('dragstart', function( ) {
        // Start Animation Thread and execute .syncAnkerPos( )
      })*/.on(
        'dragend', _=> pinConScope.syncAnkerPos( )
      );
    });
  }

  syncAnkerPos( ) {
    ConnectionUtilitys.shape.updateLine(
      this.getDisplayNode( ),
      this.attachments.from,
      this.attachments.dest
    );
  }

  serializeToJSON( ) {
    let attach = this.attachments;

    return super.serializeToJSON( {
      from: attach.from.serializeToJSON( ),
      dest: attach.dest.serializeToJSON( )
    } );
  }
}