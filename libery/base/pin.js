import Konva from 'konva';

import PinUtilitys from './pin.utils';
import Instandable from '../instandable';
import CostumEvtHndl from '../costum-event-handle';
import AttachOverlay from './attach-overlay';
//import PinAnkerOverlay from '';

const EVENT_KEYS = [ "onSizesChanged", "onScopeChanged", "onValueChanged", "onFinishDrawing", "onEditorModeChanged" ];

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

  _contentShapes = [ ];

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
    
    this._dataIdentifyer = dataIdentifyer;
    this._height = 0;
    this._width = 256;
    this._posX = posX;
    this._posY = posY;
  }

  _addShape( newShape, isRelativ=false ) {
    if (!newShape) console.warn( "Param is Null!!" );
    else if (this._container) {
      PinUtilitys.basic.addAttachmentsToCanvasNode( newShape, this );

      if (!isRelativ) this._contentShapes.push( newShape );
      if (this._container != newShape) this._container.add( newShape );
    }

    return newShape;
  }

  defineEvents( newEventKeys ) {
    if (typeof newEventKeys === "object") {
      if (newEventKeys instanceof Array) {

        newEventKeys.forEach(
          (curKey) => this._events[curKey] = new CostumEvtHndl( )
        );

      } else this._events = Object.assign( this._events, newEventKeys );
    }
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
    let scope = this;

    this.addEventListener( "onFinishDrawing", (w, h) =>
      scope.updateSize( )
    );

    this.addEventListener( "onEditorModeChanged", (newState, folderScope) => {
      if (newState) {
        scope._ankerOverlay.performStart(
          (a,b,c) => console.log( a, b, c )
        );
      } else scope._ankerOverlay.performFinish( );
    }
      
    );

    this.addEventListener( "onValueChanged", _=>
      scope.updateSize( )
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

    this._container = this._addShape(
      new Konva.Group( {
        x: this.posX, y: this.posY,
        draggable: true
      } ),
      true
    );
    this._blueprint = this._addShape(
      new Konva.Line( {
        points: [ 0, 0 ],
        stroke: 'blue', strokeWidth: 2, lineJoin: 'round', dash: [ 4, 6 ],
        opacity: 0.0
      } ),
      true
    );

    this._height = this.getChildrenHeight( );
    this._width = this.getChildrenWidth( );

    if (afterFn instanceof Function) afterFn( );

    this._ankerOverlay = this._addShape(
      new AttachOverlay( this._width, this._height, this )
    );
    this.addEventListener(
      "onSizesChanged", _=> this._ankerOverlay.calibrateAllButtons( )
    );

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
    this._height = this.getChildrenHeight( );
    this._width = this.getChildrenWidth( );

    let h = this._height + 16;
    let w = this._width;

    const bPO = 8;
    this._blueprint.setPoints([
    //  X       Y
      -bPO,   -bPO,   // Left/Top (start)
    w +bPO,   -bPO,   // Rechts/Top
    w +bPO, h +bPO*2, // Rechts/Bottom
      -bPO, h +bPO*2, // Left/Bottom
      -bPO,   -bPO    // Left/Top (end)
    ]);

    this._triggerEvent(
      "onSizesChanged", // EvtName
      { h, w }, // New ParamValues
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
    return this._contentShapes.reduce( (resHeight, curChildNode) => {
      let curHeight = curChildNode.getPosition( ).y + curChildNode.height( );

      if (resHeight < curHeight) resHeight = curHeight;
      return resHeight;
    }, 0 );
  }
  getChildrenWidth( ) {
    return this._contentShapes.reduce( (resWidth, curChildNode) => {
      let curWidth = curChildNode.getPosition( ).x + curChildNode.width( );

      if (resWidth < curWidth) resWidth = curWidth;
      return resWidth;
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