import Konva from 'konva';
import Pin from './base/pin';

export default class CanvasDrawer {
  _element:any = null;

  _stage:Konva.Stage = null;
  _backgroundLayer:Konva.Layer = new Konva.Layer( );
  _attachmentLayer:Konva.Layer = new Konva.Layer( );
  _pinLayer:Konva.Layer = new Konva.Layer( );
  _overLayer:Konva.Layer = new Konva.Layer( );

  _pressedKeyMapping:any;
  _displayMode:any = {
    mode: "default",
    collection: {
      "default": (obj:any) => obj,
      "attaching": (obj:any) => obj,
      "cleaning": (obj:any) => obj,
    }
  }
  eventHandle = { onWheelZoom: (newScale:number, newPos:any)=> { } };

  constructor( canvasDomIdStr:string, pressedKeyMapping:any ) {
    this._pressedKeyMapping = pressedKeyMapping;
    this._element = document.getElementById( canvasDomIdStr );
    this._stage = new Konva.Stage({
      container: canvasDomIdStr,   // id of container <div>
      width: window.innerWidth,
      height: window.innerHeight,
      draggable: true,
    });
    
    this._stage.add(
      this._attachmentLayer, this._pinLayer, this._overLayer
    );

    this._bindAllEvents( );
  }

  _bindAllEvents( ) {
    var scaleBy = 1.05;
    let stage = this._stage;
    
    stage.on('wheel', (e:any) => {
      if (this._pressedKeyMapping['a']) return;

      // stop default scrolling
      e.evt.preventDefault();

      var oldScale:number = stage.scaleX( );
      var pointer:any = stage.getPointerPosition( );

      var mousePointTo = {
        x: (pointer.x - stage.x( )) / oldScale,
        y: (pointer.y - stage.y( )) / oldScale
      };

      // how to scale? Zoom in? Or zoom out?
      let direction:number = e.evt.deltaY > 0 ? 1.25 : -1.25;

      // when we zoom on trackpad, e.evt.ctrlKey is true
      // in that case lets revert direction
      if (e.evt.ctrlKey)
        direction = -direction;

      var newScale:number = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      if (newScale === 1.75 && oldScale === 1.75) return;
      else if (newScale === 0.05 && oldScale === 0.05) return;
      else if (newScale > 1.75) newScale = 1.75;
      else if (newScale < 0.05) newScale = 0.05;

      stage.scale({ x: newScale, y: newScale });

      var newPos:any = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      stage.position(newPos);

      let shortDisplayScaleStr:string = newScale.toFixed( 2 );
      let shortDisplayScale:number = Number.parseFloat( shortDisplayScaleStr );
      
      this.eventHandle.onWheelZoom( shortDisplayScale, newPos );
    });
  }

  addEventListener( evtName:string, callbackFn:Function ) {
    this._element.addEventListener( evtName, callbackFn );
  }

  drawOnBackground( node:any ) {
    this._pinLayer.add( node );

    return this;
  }

  drawPin( pinInstanceNode:any ) {
    let checkIsAppendet = this._pinLayer.getChildren( ).indexOf( pinInstanceNode ) >= 0;

    if (!checkIsAppendet)
      this._pinLayer.add( pinInstanceNode );

    return this;
  }

  drawAttachment( pinConnectionNode:any ) {
    this._attachmentLayer.add( pinConnectionNode.getDisplayNode( ) );

    return this;
  }

  drawOnOverlay( node:any ) {
    this._pinLayer.add( node );

    return this;
  }

  setZoom( zoomValue:number ) {
    let stage = this._stage;
    let newPos = {
      x: 0 - (stage.width( ) * (zoomValue -1)) /2,
      y: 0 - (stage.height( ) * (zoomValue -1) /2),
    };
    
    stage.scale({ x: zoomValue, y: zoomValue });
    stage.position( newPos );
  }
}