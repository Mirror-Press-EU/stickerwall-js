import Konva from "konva";
import DefaultPin from "./base/pin";
import CustomEvtHndl from "./custom-event-handle";

const _utils_:any = {
  prototype: {
    defineEvent: (targetClassScope:DefaultPin, newEventKey:string) => {
      targetClassScope.events[newEventKey] = new CustomEvtHndl( )
    },
    defineEvents: (targetClassScope:DefaultPin, newEventKeys:any) => {
      if (typeof newEventKeys === "object") {
        if (newEventKeys instanceof Array) {
  
          newEventKeys.forEach(
            (curKey) => _utils_.prototype.defineEvent( targetClassScope, curKey )
          );
  
        } else targetClassScope.events = Object.assign( targetClassScope.events, newEventKeys );
      }
    },

    mappingEvtsToCstmEvts( targetClassScope:DefaultPin, newEventKeys:string[], targetShape:any=null ) {

      if (!targetShape) targetShape = targetClassScope.getDisplayNode( );

      if (typeof targetShape.on === 'function')
        newEventKeys.forEach(
          (curEvtName:string) => targetShape.on(
            curEvtName, (a:any, b:any, c:any) => targetClassScope.triggerEvent( curEvtName, a, b, c )
          )
        );

    }
  }
}

export default _utils_;