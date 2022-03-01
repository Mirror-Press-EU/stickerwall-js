import CustomEvtHndl from "./custom-event-handle";

export default {
  prototype: {
    defineEvents: (targetClassScope, newEventKeys) => {
      if (targetClassScope._events === undefined
      ||  targetClassScope._events !== "object"
      ) targetClassScope._events = { };
        
      if (typeof newEventKeys === "object") {
        if (newEventKeys instanceof Array) {
  
          newEventKeys.forEach(
            (curKey) => targetClassScope._events[curKey] = new CustomEvtHndl( )
          );
  
        } else targetClassScope._events = Object.assign( targetClassScope._events, newEventKeys );
      }
    },

    mappingEvtsToCstmEvts( targetClassScope, newEventKeys, targetShape=false ) {
      if (!targetShape) targetShape = targetClassScope._container;

      newEventKeys.forEach(
        (curEvtName) => targetShape.on(
          curEvtName,
          (a, b, c) => targetClassScope._triggerEvent( curEvtName, a, b, c )
        )
      );
    }
  }
}