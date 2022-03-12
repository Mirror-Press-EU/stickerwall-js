import Konva from 'konva';

import CustomEvtHndl from "../custom-event-handle";
import CustomEvtUtils from "../custom-event-handle.utils";

import PinUtilitys from './pin.utils';
import __DEFAULT_CONFIG__ from './pin.config';

import Instandable from '../instandable';
import AttachOverlay from './attach-overlay';
//import PinAnkerOverlay from '';


const EVENT_KEYS = [
  // Shape Events
  'mouseover', 'mouseout', 'click', 'onFocus', 'onMoving','onMoved',

  // Business Events
  "onSizesChanged", "onFocus", "onValueChanged", "onFinishDrawing", "onEditorModeChanged"
];

export default class Pin extends Instandable {
  _dataIdentifyer:string = "UNKNOW";
  _height:number = 0;
  _width:number = 0;

  _container:any/*Konva.Group*/ = null;
  _blueprint:any/*Konva.Rect*/ = null;
  _ankerOverlay:AttachOverlay = null;
  _background:any/*Konva.Rect*/ = null;

  _contentShapes:Konva.Shape[] = [ ];

  pinType:string;
  _guiFocus:boolean = false;
  values:any = { };

  _events:any = { };

  constructor( posX:number, posY:number, dataIdentifyer:string ) {
    super( );
    this._extAdd( "pin-base" );
    this.defineEvents( EVENT_KEYS );

    if (!posX) posX = 0;
    if (!posY) posY = 0;
    if (!dataIdentifyer) {
      dataIdentifyer = "UNKNOWN";
      console.warn( `Warn in PinBase Init, "${dataIdentifyer}" is not a valide dataID!` );
    }
    
    this.initValues( { x:posX, y:posY } );
    
    this._dataIdentifyer = dataIdentifyer;
    this._height = 0;
    this._width = 256;

    this.addEventListener(
      'click', () => this._triggerEvent(
        "onFocus", this, true
      )
    )
  }

  _addShape( newShape:any, isRelativ:boolean=false ) : any {
    if (!newShape) console.warn( "First Param (KonvaNodeShape) can not null!" );
    else if (this._container) {
      PinUtilitys.basic.addAttachmentsToCanvasNode( newShape, this );

      if (!isRelativ) this._contentShapes.push( newShape );
      /*if (this._container != newShape) */this._container.add( newShape );
    }

    return newShape;
  }

  defineEvents( newEventKeys:any ) {
    CustomEvtUtils.prototype.defineEvents( this, newEventKeys );
  }

  addEventListener( targetEvtName:string, callFn:Function ) {
    let targetEvtHndlr = this._events[ targetEvtName ];
    if (targetEvtHndlr) targetEvtHndlr.add( callFn );

    return this;
  }

  _triggerEvent(
  targetEvtName:string,
  param1:any = null,
  param2:any = null,
  param3:any = null
  ) {
    let targetEvtHndlr = this._events[ targetEvtName ];
    if (targetEvtHndlr)
      targetEvtHndlr.trigger( param1, param2, param3, this );
  }

  bindDefaultEvents( ) : void {
    let scope = this;

    //CustomEvtUtils.prototype.mappingEvtsToCstmEvts( this, [ "dragstart", "dragend", "mouseover", "mouseout", "click" ] );
    [ "dragstart", "dragend", "mouseover", "mouseout", "click" ].forEach(
      (curEvtName) => scope._container.on(
        curEvtName,
        (a:any, b:any, c:any) => { scope._triggerEvent( curEvtName, a, b, c ); return true; }
      )
    );

    this.addEventListener( "onFinishDrawing", (w:number, h:number) =>
      scope.updateSize( )
    );

    this.addEventListener( "onValueChanged", ()=> {
      scope.updateSize( );
    } );

    this.addEventListener( "dragend", ()=> {
      let newPos = scope.getPosition( true );
      scope.values.x = newPos.x;
      scope.values.y = newPos.y;
    } );
  }

  bindAllEvents( evtFunctionMapping:any ) : Pin {
    for (let curEvtName in evtFunctionMapping) {
      let curEvtFnList:any = evtFunctionMapping[ curEvtName ];

      if (curEvtFnList instanceof Function) curEvtFnList = [ curEvtFnList ];

      if (curEvtFnList instanceof Array) {
        curEvtFnList.forEach(
          (curEvtCllbck:Function) => this.addEventListener(
            curEvtName, (evt1:any, evt2:any, evt3:any) => curEvtCllbck( evt1, evt2, evt3 )
          )
        );
      } 

        // @ToDo All Callbacks Mapping to this._events
        /*switch (curEvtName.toLocaleLowerCase( )) {
          case "dragstart":
          case "dragend":
          case "mouseover":
          case "mouseout":
          case "click":
            targetNodeShape = this._container;
            break;
          default:
            targetNodeShape = null;
        }

        // @ToDo Handle all Events to Class EventHandle
        if (targetNodeShape) targetNodeShape.on(
          curEvtName,
          (evt1:any, evt2:any) => curEvtFn( evt1, this )
        );*/
    }

    return this;
  }

  drawBasics( beforeFn:Function, afterFn:Function ) : void {
    if (beforeFn instanceof Function) beforeFn( );

    let pinPos = this.getPosition( );
    this._container = this._addShape(
      new Konva.Group( {
        x: pinPos.x, y: pinPos.y,
        draggable: true
      } ),
      true
    );
    this._blueprint = this._addShape(
      new Konva.Rect( {
        x: -8, y: -8,
        cornerRadius: 16,
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

    this.bindDefaultEvents( );

    this.addEventListener(
      "onSizesChanged", ()=> this._ankerOverlay.calibrateAllButtons( )
    );

    this._triggerEvent( "onFinishDrawing", this );
  }

  initValues( initMappedValuesObj:any ) : void {
    this.values = Object.assign( this.values, initMappedValuesObj );
  }

  updateValue( key:string, value:any, callUpdate:boolean=true ) {
    if (this.values[ key ] !== undefined) {
      this.values[ key ] = value;

      if (callUpdate) this._triggerEvent(
        "onValueChanged", { key, value }, this
      );
    }
  }
  updateValues( keyValueMapping:any ) {
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

    let h = this._height + 24;
    let w = this._width;

    const bPO = 8;
    this._blueprint.setWidth( w + ( 2*bPO ) );
    this._blueprint.setHeight( h + ( 2*bPO ) );

    this._triggerEvent(
      "onSizesChanged", // EvtName
      { h, w }, // New ParamValues
      this // PinScope
    );
  }

  getDisplayNode( ) {
    return this._container;
  }
  getPosition( guiUpdated=false ) {
    return (guiUpdated)
      ? this.getDisplayNode( ).getPosition( )
      : { x: this.values.x, y: this.values.y };
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

  isSelected( ) { return this._guiFocus; }

  setFocus( newState:boolean ) {
    this._guiFocus = newState;
    //this._triggerEvent( "onFocus", newState, this );
  }
  toggleSelected( ) {
    this._guiFocus = !this._guiFocus;
    return this._guiFocus;
  }

  serializeToJSON( valuesObj={ } ) {
    let vPos = this._container.getPosition( );
    let defaultValues = { x: vPos.x, y: vPos.y }
    
    return {
      id: this._dataIdentifyer,
      type: this.pinType,
      values: Object.assign( defaultValues, valuesObj )
    };
  }

  fromSerialized( valuesObj:any ) {
    if (valuesObj.id && valuesObj.type && valuesObj.values) {
      this._dataIdentifyer = valuesObj.id;
      this.pinType = valuesObj.type;
      this.values = valuesObj.values;
    }

    return this;
  }

  // --- Display Methods ---
  
  _displayBlueprint( newState:boolean ) {
    let blueprintOpacity = "0.0";
    let containerOpacity = __DEFAULT_CONFIG__.styles.opacity.default;

    if (newState) {
      blueprintOpacity = __DEFAULT_CONFIG__.styles.opacity.default;
      containerOpacity = __DEFAULT_CONFIG__.styles.opacity.glasses;
    }
    
    this._blueprint.setOpacity( blueprintOpacity );
    this._container.setOpacity( containerOpacity );
  }

  // BasePin has no Attributes...
  // @Override
  setDisplayValues( attrValues:any ) : void { }
}