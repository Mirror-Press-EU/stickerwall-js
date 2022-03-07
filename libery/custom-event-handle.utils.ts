import Konva from "konva";
import DefaultPin from "./base/pin";
import CustomEvtHndl from "./custom-event-handle";

const _utils_:any = {
  prototype: {
    defineEvent: (targetClassScope:DefaultPin, newEventKey:string) => {
      targetClassScope._events[newEventKey] = new CustomEvtHndl( )
    },
    defineEvents: (targetClassScope:DefaultPin, newEventKeys:any) => {
      if (typeof newEventKeys === "object") {
        if (newEventKeys instanceof Array) {
  
          newEventKeys.forEach(
            (curKey) => _utils_.prototype.defineEvent( targetClassScope, curKey )
          );
  
        } else targetClassScope._events = Object.assign( targetClassScope._events, newEventKeys );
      }
    },

    mappingEvtsToCstmEvts(
    targetClassScope:DefaultPin,
    newEventKeys:string[],
    targetShape:any=null
    ) {

      if (!targetShape) targetShape = targetClassScope._container;

      newEventKeys.forEach( (curEvtName:string) => {
        if (typeof targetShape.on === "function") targetShape.on(
          curEvtName,
          (a:any, b:any, c:any) => targetClassScope._triggerEvent( curEvtName, a, b, c )
        )
        } );

    }
  }
}

export default _utils_;