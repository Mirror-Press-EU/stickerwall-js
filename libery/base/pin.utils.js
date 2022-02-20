export default {
  basic: {
    addAttachmentsToCanvasNode: ( pinNodeObj, pinInstanceScope ) => {
      if (!pinNodeObj) console.log( "Null Parameter nicht vorgesehen!" );

      return Object.assign( pinNodeObj, {
        pinInstance: pinInstanceScope,
        getPinId: _=> this.pinInstance.pinID
      } );
    }
  },
  anker: {
    positions: {
      top: 'TOP', topRight: 'TOP-RIGHT',
      right: 'RIGHT', rightBottom: 'RIGHT-BOTTOM',
      bottom: 'BOTTOM', bottomLeft: 'BOTTOM-LEFT',
      left: 'LEFT', leftTop: 'LEFT-TOP',
      center: 'CENTER'
    },
    getAllPos( ) {
      let resultList = [ ]
      for (let p in this.positions) resultList.push( p );
      return resultList;
    },
    getCornerOffsetPos( ankerPosKey, w, h ) {
      let POS = this.positions;
      let returnPos = { x:0, y:0 };

      ankerPosKey = ankerPosKey.toUpperCase( );
      
      if (!ankerPosKey.includes( POS.top )) returnPos.y += h / 2; // Wenn nicht Top ist dann ist mitte...
      if (ankerPosKey.includes( POS.bottom )) returnPos.y += h / 2; // Wenn Bottom ist dann unten (2x die hälfte)
    
      if (!ankerPosKey.includes( POS.left )) returnPos.x += w / 2; // Wenn nicht Left ist dann ist mitte...
      if (ankerPosKey.includes( POS.right )) returnPos.x += w / 2; // Wenn Right ist dann unten (2x die hälfte)

      return returnPos;
    },
    getCornerPos( pinInstance, ankerPos ) {
      let POS = this.positions;
      let ankerPosKey;

      if (typeof ankerPos === "string") ankerPosKey = ankerPos.toUpperCase( );
      else if (ankerPos.instanceOf( "attachment-anker" )) ankerPosKey = ankerPos.getPosKey( ).toUpperCase( );
      else ankerPosKey = allPos.center;

      let returnPos = pinInstance.getPosition( );
    
      let pinWidth = pinInstance.getWidth( );
      let pinHeight = pinInstance.getHeight( );

      let finalReturnPos = this.getCornerOffsetPos( ankerPos, pinWidth, pinHeight );
    
      return finalReturnPos;
    },
    getPaddindCornerPos( ankerPos, paddingValue, defaultPos=null) {
      let POS = this.positions;
      let ankerPosKey;

      if (typeof ankerPos === "string") ankerPosKey = ankerPos;
      else if (ankerPos.instanceOf( "attachment-anker" )) ankerPosKey = ankerPos.getPosKey( );
      else ankerPosKey = allPos.center;

      if (isNaN(defaultPos.x) || isNaN(defaultPos.y)) defaultPos = { x:0, y:0 };
    
      let returnPos = {
        x: 0 - paddingValue, //Links
        y: 0 - paddingValue  //Oben
      };
    
      if (!ankerPosKey.includes( POS.top )) returnPos.y = 0; // Wenn nicht Top ist dann ist mitte...
      if (ankerPosKey.includes( POS.bottom )) returnPos.y += paddingValue; // Wenn Bottom ist dann unten
    
      if (!ankerPosKey.includes( POS.left )) returnPos.x = 0; // Wenn nicht Left ist dann ist mitte...
      if (ankerPosKey.includes( POS.right )) returnPos.x += paddingValue; // Wenn Right ist dann unten
    
      return this.addPos( defaultPos, returnPos );
    },
    addPos( pos1, pos2 ) {
      return {
        x: pos1.x + pos2.x,
        y: pos1.y + pos2.y
      };
    }
  },

  // Test
  testValues: {
    loadJson: `{
      "nodes": [{
        "id": "t1",
        "type": "link-qoute",
        "values": {
          "x": 0, "y": 0,
          "title": "t1",
          "text": "t11"
        }
      }, {
        "id": "t2",
        "type": "link-qoute",
        "values": {
          "x": 0, "y": 300,
          "title": "t2",
          "text": "t22"
        }
      }],

      "attachments": [{
        "type": "connection",
        "values": {
          "from": {
            "pinID": "t1",
            "pos": {
              "type": "attachment-anker",
              "value": "BOTTOM"
            }
          },
          "dest": {
            "pinID": "t2",
            "pos": {
              "type": "attachment-anker",
              "value": "TOP"
            }
          } 
        }
      }],
      
      view: {
        pos: { x:0, y:0 },
        scroll: 1.0
      }
    }`
  }
}