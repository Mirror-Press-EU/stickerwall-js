import Konva from 'konva';

import PinUtilitys from './pin.utils';
import Instandable from '../instandable';
import CostumEvtHndl from '../costum-event-handle';
//import PinAnkerOverlay from '';

const EVENT_KEYS = [ "onScopeChanged", "onValueChanged", "onFinishDrawing", "onEditorModeChanged" ];

export default class Pin extends Instandable {
  _dataIdentifyer = null;
  _height = 0;
  _width = 0;
  _posX = 0;
  _posY = 0;

  _container = null;
  _blueprint = null;
  _ankerOverlay = null;
  _background = null;

  pinType;
  values = { };
  _attachments = [ ];

  _events = { };

  constructor( posX, posY, dataIdentifyer ) {
    super( );
    this._extAdd( "pin-base" );
    this.defineEvents( EVENT_KEYS );

    if (!posX) posX = 0;
    if (!posY) posY = 0;
    if (!dataIdentifyer) dataIdentifyer = "UNKNOWN";
    
    this.initValues( { x:posX, y:posY } );

    this.bindDefaultEvents( );
    this.drawBasics( );
    
    this._dataIdentifyer = dataIdentifyer;
    this._height = 0;
    this._width = 256;
    this._posX = posX;
    this._posY = posY;
  }

  defineEvents( newEventKeys ) {
    if (typeof { } === "object" && !(newEventKeys instanceof Array))
    this._events = Object.assign( this._events, newEventKeys );
  }

  addEventListener( targetEvtName, callFn ) {
    let targetEvtHndlr = this._events[ targetEvtName ];
    if (targetEvtHndlr) targetEvtHndlr.add( callFn );

    return this;
  }

  _triggerEvent( targetEvtName, param1, param2 ) {
    let targetEvtHndlr = this._events[ targetEvtName ];
    if (targetEvtHndlr)
      targetEvtHndlr.trigger( param1, param2 );
  }

  bindDefaultEvents( ) {
    this.addEventListener( "onFinishDrawing", (w, h) =>
      this.updateParentSize( w, h )
    );

    this.addEventListener( "onSizesChanged", _=>
      this.updateSize( )
    );
  }

  bindAllEvents( evtFunctionMapping ) {
    for (let curEvtName in evtFunctionMapping) {
      let curEvtFn = evtFunctionMapping[ curEvtName ];

      if (curEvtFn instanceof Function) {
        let targetNodeShape;
        switch (curEvtName.toLocaleLowerCase( )) {
          case "dragstart":
          case "dragend":
          case "mouseover":
          case "mouseout":
            targetNodeShape = this._container;
            break;
          default:
            targetNodeShape = null;
        }

        if (targetNodeShape) targetNodeShape.on( curEvtName, curEvtFn );
      }
    }
  }

  drawBasics( beforeFn, afterFn ) {
    if (beforeFn instanceof Function) beforeFn( );

    this._container = PinUtilitys.basic.addAttachmentsToCanvasNode(
      new Konva.Group(
        { x: this.posX, y: this.posY, draggable: true }
      ),
      this
    );
    this._blueprint = PinUtilitys.basic.addAttachmentsToCanvasNode(
      new Konva.Line( {
        points: [ 0, 0 ],
        stroke: 'blue', strokeWidth: 2, lineJoin: 'round', dash: [ 4, 6 ],
        opacity: 0.0
      } ),
      this
    );
    //this._ankerOverlay = new PinAnkerOverlay( );

    this._container.add(
      this._blueprint,
      //this._ankerOverlay
    );

    if (afterFn instanceof Function) afterFn( );

    this._triggerEvent( "onSizesChanged", this );
    this._triggerEvent( "onFinishDrawing", this );
  }

  initValues( initMappedValuesObj ) {
    this.values = Object.assign( this.values, initMappedValuesObj );
  }

  updateValue( key, value, callUpdate=true ) {
    if (this.values[ key ] !== undefined) {
      this.values[ key ] = value;

      if (callUpdate) this._triggerEvent(
        "onValueChanged", { key, value }, this
      );
    }
  }
  updateValues( keyValueMapping ) {
    for (let k in keyValueMapping) {
      this.updateValue( k, keyValueMapping[ k ], false );
    }

    this._triggerEvent( "onValueChanged", keyValueMapping, this );
  }

  afterDrawCalculates( ) {
    this._blueprint.setHeight( this.getChildrenHeight( ) );
  }

  updateSize( ) { 
    let pinHeight = this.getChildrenHeight( );
    let pinWidth = this.getChildrenWidth( );

    this._height = pinHeight;
    this._width = pinWidth;

    const bPO = 8;
    this._blueprint.setPoints([
      -bPO, -bPO,
      pinWidth +bPO, -bPO,
      pinWidth +bPO, pinHeight +bPO,
      -bPO, pinHeight +bPO,
      -bPO, -bPO
    ]);

    this._triggerEvent(
      "onSizesChanged", // EvtName
      { pinHeight, pinWidth }, // New ParamValues
      this // PinScope
    );
  }

  getDisplayNode( ) {
    return this._container;
  }
  getPosition( ) {
    return this._container.getPosition( );
  }
  getCenterPosition( ) {
    let pos = this.getPosition( );
    let centerOffset = { x: this.getChildrenHeight( ) /2, y: this.getChildrenWidth( ) /2 };

    return {
      x: (pos.x + centerOffset.x),
      y: (pos.y + centerOffset.y)
    }
  }
  getChildrenHeight( ) { 
    return this._container.getChildren( ).reduce( (resHeight, curChildNode) => {
      let curHeight = curChildNode.getPosition( ).y + curChildNode.height( );

      if (resHeight < curHeight) resHeight = curHeight;
      return resHeight;
    }, 0 );
  }
  getChildrenWidth( ) {
    return this._container.getChildren( ).reduce( (resWidth, curChildNode) => {
      let curWidth = curChildNode.getPosition( ).x + curChildNode.width( );

      if (resWidth < curWidth) resWidth = curWidth;

      //return resWidth;
    }, 0 );
  }

  getID( ) { return this._dataIdentifyer; }
  getHeight( ) { return this._height; }
  getWidth( ) { return this._width; }

  serializeToJSON( valuesObj={ } ) {
    let vPos = this._container.getPosition( );
    let defaultValues = { x: vPos.x, y: vPos.y }
    
    return {
      id: this._dataIdentifyer,
      type: this.pinType,
      values: Object.assign( defaultValues, valuesObj )
    };
  }

  fromSerialized( valuesObj ) {
    if (valuesObj.id && valuesObj.type && valuesObj.values) {
      this._dataIdentifyer = valuesObj.id;
      this.pinType = valuesObj.type;
      this.values = valuesObj.values;
    }

    return this;
  }
}