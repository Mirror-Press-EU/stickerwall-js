import Konva from "konva";

import PinUtilitys from '../base/pin.utils';

import _CONFIG_ from './connection.config';

let uScope = {
  shape: {
    generateLine( posA={ x:0, y:0 }, posB={ x:0, y:0 } ) {
      return new Konva.Line({
        points: [ posA.x, posA.y, posB.x, posB.y ],
        stroke: 'gray', strokeWidth: 3, lineJoin: 'round',
        dash: [3, 9],
      });
    },
    updateLine( konvaLineShape, fromAttach, destAttach ) {
      if (!fromAttach.instanceOf( "attachment" )
      ||  !destAttach.instanceOf( "attachment" )
      ) console.error( "Attachment-Instance required" );
      
      let fromPos = uScope.anker.calulateAnkerPos( fromAttach );
      let destPos = uScope.anker.calulateAnkerPos( destAttach );

      if (isNaN(fromPos.x)
      ||  isNaN(fromPos.y)
      ||  isNaN(destPos.x)
      ||  isNaN(destPos.y)
      ) console.error( "Not valide position in Connection-Anker-Position calulation routine!" );
      
      konvaLineShape.setPoints( [ fromPos.x, fromPos.y, destPos.x, destPos.y ] );
    }
  },
  anker: {
    calulateAnkerPos( attachment ) {
      let anker = attachment.getAnker( );
      let nodePos = PinUtilitys.anker.getCornerPos( attachment.getPin( ), anker );
      let ankerPosXY = PinUtilitys.anker.getPaddindCornerPos( anker, _CONFIG_.anker.padding, nodePos ); // Erweitere alles mit einem Padding

      return ankerPosXY;
    }
  }
};

export default uScope;