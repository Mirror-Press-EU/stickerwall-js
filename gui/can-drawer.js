import Konva from 'konva';

export default class CanvasDrawer {
  _element = null;
  _stage = null;
  _backgroundLayer = new Konva.Layer( );
  _connectionLayer = new Konva.Layer( );
  _pinLayer = new Konva.Layer( );
  _overLayer = new Konva.Layer( );
  _pressedKeyMapping;
  _displayMode = {
    mode: "default",
    collection: {
      "default": (obj) => obj,
      "attaching": (obj) => obj,
      "cleaning": (obj) => obj,
    }
  }
  eventHandle = { onWheelZoom: _=> { } };

  constructor( canvasDomIdStr, pressedKeyMapping ) {
    this._pressedKeyMapping = pressedKeyMapping;
    this._element = document.getElementById( canvasDomIdStr );
    this._stage = new Konva.Stage({
      container: canvasDomIdStr,   // id of container <div>
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    this._stage.add(
      this._connectionLayer, this._pinLayer, this._overLayer
    );

    this._bindAllEvents( );
  }

  _bindAllEvents( ) {
    var scaleBy = 1.05;
    let stage = this._stage;
    
    stage.on('wheel', (e) => {
      if (this._pressedKeyMapping['a']) return;

      // stop default scrolling
      e.evt.preventDefault();

      var oldScale = stage.scaleX();
      var pointer = stage.getPointerPosition();

      var mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      // how to scale? Zoom in? Or zoom out?
      let direction = e.evt.deltaY > 0 ? 1 : -1;

      // when we zoom on trackpad, e.evt.ctrlKey is true
      // in that case lets revert direction
      if (e.evt.ctrlKey) direction = -direction;

      var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
      if (newScale === 1.75 && oldScale === 1.75) return;
      else if (newScale === 0.05 && oldScale === 0.05) return;
      else if (newScale > 1.75) newScale = 1.75;
      else if (newScale < 0.05) newScale = 0.05;

      stage.scale({ x: newScale, y: newScale });

      var newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      stage.position(newPos);
      this.eventHandle.onWheelZoom( newScale, newPos );
    });
  }

  addEventListener( evtName, callbackFn ) {
    this._element.addEventListener( evtName, callbackFn );
  }

  drawOnBackground( node ) {
    this._pinLayer.add( node );

    return this;
  }

  drawPin( pinInstanceNode ) {
    this._pinLayer.add( pinInstanceNode );

    return this;
  }

  drawPinConnection( pinConnectionNode ) {
    this._connectionLayer.add( pinConnectionNode );

    return this;
  }

  drawOnOverlay( node ) {
    this._pinLayer.add( node );

    return this;
  }

  setZoom( zoomValue ) {
    let stage = this._stage;
    let newPos = {
      x: 0 - (stage.width( ) * (zoomValue -1)) /2,
      y: 0 - (stage.height( ) * (zoomValue -1) /2),
    };
    
    stage.scale({ x: zoomValue, y: zoomValue });
    stage.position( newPos );
  }
}