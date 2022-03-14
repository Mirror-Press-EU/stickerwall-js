import AttachmentAnker from "../attachments/anker";
import DefaultPin from "./pin";

const _utils_:any = {
  basic: {
    addAttachmentsToCanvasNode: ( pinNodeObj:any, pinInstanceScope:DefaultPin ) => {
      if (!pinNodeObj) console.log( "Null Parameter nicht vorgesehen!" );

      return Object.assign( pinNodeObj, {
        pinInstance: pinInstanceScope,
        getPinId: ()=> _utils_.prototype.pinInstance.pinID
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

    getPosValue( posKey:string ) : any {
      return this.positions[ posKey ];
    },

    validatePositionString( posStr:string ) : boolean {
      return this.getAllPosValues( ).indexOf( posStr ) >= 0;
    },

    getAllPosKeys( ) : string[] {
      let resultList = [ ];

      for (let k in this.positions) resultList.push( k );

      return resultList;
    },
    getAllPosValues( ) : string[] {
      let resultList = [ ];
      for (let k in this.positions)
        resultList.push( this.positions[ k ] );

      return resultList;
    },
    getCornerOffsetPos( ankerPosKey:string, w:number, h:number ) : any {
      let POS:any = this.positions;
      let returnPos:any = { x:0, y:0 };

      ankerPosKey = ankerPosKey.toUpperCase( );
      
      if (!ankerPosKey.includes( POS.top )) returnPos.y += h / 2; // Wenn nicht Top ist dann ist mitte...
      if (ankerPosKey.includes( POS.bottom )) returnPos.y += h / 2; // Wenn Bottom ist dann unten (2x die hälfte)
    
      if (!ankerPosKey.includes( POS.left )) returnPos.x += w / 2; // Wenn nicht Left ist dann ist mitte...
      if (ankerPosKey.includes( POS.right )) returnPos.x += w / 2; // Wenn Right ist dann unten (2x die hälfte)

      return returnPos;
    },
    getCornerPos(
      pinInstance:DefaultPin,
      ankerPos:string="center"
    ) : any {
      let POS:any = this.positions;
      let returnPos:any = pinInstance.getPosition( );
    
      let pinWidth:number = pinInstance.getWidth( );
      let pinHeight:number = pinInstance.getHeight( );

      let offsetPos:any = this.getCornerOffsetPos( ankerPos, pinWidth, pinHeight );
    
      return this.addPos( returnPos, offsetPos );
    },
    getPaddindCornerPos(
      ankerPosKey:string="center",
      paddingValue:number=0,
      defaultPos:any={x:0, y:0}
    ) : any {
      let POS:any = this.positions;

      if (isNaN(defaultPos.x) || isNaN(defaultPos.y)) defaultPos = { x:0, y:0 };
    
      let returnPos:any = {
        x: 0 - paddingValue, //Links
        y: 0 - paddingValue  //Oben
      };
    
      if (!ankerPosKey.includes( POS.top )) returnPos.y = 0; // Wenn nicht Top ist dann ist mitte...
      if (ankerPosKey.includes( POS.bottom )) returnPos.y += paddingValue; // Wenn Bottom ist dann unten
    
      if (!ankerPosKey.includes( POS.left )) returnPos.x = 0; // Wenn nicht Left ist dann ist mitte...
      if (ankerPosKey.includes( POS.right )) returnPos.x += paddingValue; // Wenn Right ist dann unten
    
      return this.addPos( defaultPos, returnPos );
    },
    addPos( pos1:any, pos2:any ) : any {
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
      
      "view": {
        "pos": { "x":0, "y":0 },
        "scroll": "1.0"
      }
    }`
  }
}

export default _utils_;