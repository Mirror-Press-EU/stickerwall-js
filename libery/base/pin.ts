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
  protected _dataIdentifyer:string;
  protected _height:number = 0;
  protected _width:number = 0;

  protected _container:any/*Konva.Group*/ = null;
  protected _blueprint:any/*Konva.Rect*/ = null;
  protected _ankerOverlay:AttachOverlay = null;
  protected _background:any/*Konva.Rect*/ = null;

  protected _contentShapes:Konva.Shape[] = [ ];

  protected pinType:string;
  protected _guiFocus:boolean = false;
  protected values:any = { };

  public events:any = { };

  constructor( posX:number, posY:number, dataIdentifyer:string=null ) {
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
      'click', () => this.triggerEvent(
        "onFocus", this, true
      )
    )
  }

  protected _addShape( newShape:any, isRelativ:boolean=false ) : any {
    if (!newShape) console.warn( "First Param (KonvaNodeShape) can not null!" );
    else if (this._container) {
      PinUtilitys.basic.addAttachmentsToCanvasNode( newShape, this );

      if (!isRelativ) this._contentShapes.push( newShape );
      /*if (this._container != newShape) */this._container.add( newShape );
    }

    return newShape;
  }

  protected defineEvents( newEventKeys:any ) : void {
    CustomEvtUtils.prototype.defineEvents( this, newEventKeys );
  }

  public addEventListener( targetEvtName:string, callFn:Function ) : Pin {
    let targetEvtHndlr = this.events[ targetEvtName ];
    if (targetEvtHndlr) targetEvtHndlr.add( callFn );

    return this;
  }

  public triggerEvent( targetEvtName:string, param1:any = null, param2:any = null, param3:any = null ) : void {
    let targetEvtHndlr = this.events[ targetEvtName ];
    if (targetEvtHndlr)
      targetEvtHndlr.trigger( param1, param2, param3, this );
  }

  public getAllEventListeners( ) {
    return this.events;
  }

  protected bindDefaultEvents( ) : void {
    let scope = this;

    //CustomEvtUtils.prototype.mappingEvtsToCstmEvts( this, [ "dragstart", "dragend", "mouseover", "mouseout", "click" ] );
    [ "dragstart", "dragend", "mouseover", "mouseout", "click" ].forEach(
      (curEvtName) => scope._container.on(
        curEvtName,
        (a:any, b:any, c:any) => { scope.triggerEvent( curEvtName, a, b, c ); return true; }
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

  public bindAllEvents( evtFunctionMapping:any ) : Pin {
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

  protected drawBasics( beforeFn:Function, afterFn:Function ) : void {
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

    this.triggerEvent( "onFinishDrawing", this );
  }

  protected initValues( initMappedValuesObj:any ) : void {
    this.values = Object.assign( this.values, initMappedValuesObj );
  }

  protected updateValue( key:string, value:any, callUpdate:boolean=true ) : void {
    if (this.values[ key ] !== undefined) {
      this.values[ key ] = value;

      if (callUpdate) this.triggerEvent(
        "onValueChanged", { key, value }, this
      );
    }
  }
  protected updateValues( keyValueMapping:any ) : void {
    for (let k in keyValueMapping) {
      this.updateValue( k, keyValueMapping[ k ], false );
    }

    this.triggerEvent( "onValueChanged", keyValueMapping, this );
  }

  protected afterDrawCalculates( ) : void {
    this._blueprint.setHeight( this.getChildrenHeight( ) );
  }

  protected updateSize( ) : void { 
    this._height = this.getChildrenHeight( );
    this._width = this.getChildrenWidth( );

    let h = this._height + 24;
    let w = this._width;

    const bPO = 8;
    this._blueprint.setWidth( w + ( 2*bPO ) );
    this._blueprint.setHeight( h + ( 2*bPO ) );

    this.triggerEvent(
      "onSizesChanged", // EvtName
      { h, w }, // New ParamValues
      this // PinScope
    );
  }

  public getDisplayNode( ) : any {
    return this._container;
  }
  public getPosition( guiUpdated=false ) : any {
    let nodeContainer:any = this.getDisplayNode( );
    return (guiUpdated || nodeContainer == null)
      ? { x: this.values.x, y: this.values.y }
      : nodeContainer.getPosition( );
  }
  public getCenterPosition( ) : any {
    let pos = this.getPosition( );
    let centerOffset = { x: this.getChildrenHeight( ) /2, y: this.getChildrenWidth( ) /2 };

    return {
      x: (pos.x + centerOffset.x),
      y: (pos.y + centerOffset.y)
    }
  }
  public getChildrenHeight( ) : number { 
    return this._contentShapes.reduce( (resHeight, curChildNode) => {
      let curHeight = curChildNode.getPosition( ).y + curChildNode.height( );

      if (resHeight < curHeight) resHeight = curHeight;
      return resHeight;
    }, 0 );
  }
  public getChildrenWidth( ) : number {
    return this._contentShapes.reduce( (resWidth, curChildNode) => {
      let curWidth = curChildNode.getPosition( ).x + curChildNode.width( );

      if (resWidth < curWidth) resWidth = curWidth;
      return resWidth;
    }, 0 );
  }

  public getID( ) : string { return this._dataIdentifyer; }
  public getHeight( ) : number { return this._height; }
  public getWidth( ) : number { return this._width; }

  public isSelected( ) : boolean { return this._guiFocus; }

  public setFocus( newState:boolean ) : void {
    this._guiFocus = newState;
    //this._triggerEvent( "onFocus", newState, this );
  }
  public toggleSelected( ) : boolean {
    this._guiFocus = !this._guiFocus;
    return this._guiFocus;
  }

  public serializeToJSON( valuesObj={ } ) : any {
    let vPos = this._container.getPosition( );
    let defaultValues = { x: vPos.x, y: vPos.y }
    
    return {
      id: this._dataIdentifyer,
      type: this.pinType,
      values: Object.assign( defaultValues, valuesObj )
    };
  }

  public fromSerialized( valuesObj:any, callback:Function=()=>{} ) : Pin {

    if (this._dataIdentifyer
    &&  this._dataIdentifyer.toUpperCase( ) !== 'UNKNOWN'
    &&  this._dataIdentifyer === valuesObj.id
    ) return null;

    if (valuesObj.id && valuesObj.type && valuesObj.values) {
      this._dataIdentifyer = valuesObj.id;
      this.setDisplayValues( valuesObj.values );
    }

    if (callback) callback( );

    return this;
  }

  // --- Display Methods ---
  
  public _displayBlueprint( newState:boolean ) : void {
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
  public setDisplayValues( attrValues:any ) : void {
    this._dataIdentifyer = attrValues.id;
    this.pinType = attrValues.type;
    this.values = attrValues.values;

    this.updateValues( attrValues );
  }

  public getAttachOverlay( ) : AttachOverlay {
    return this._ankerOverlay;
  }
}