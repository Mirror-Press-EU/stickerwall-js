import Konva from "konva";
import AttachmentAnker from "../attachments/anker";
import DefaultPin from "./pin";
import PinUtilitys from './pin.utils';

export default class AttachOverlay extends Konva.Group {
  _targetPinScope:DefaultPin;
  _ankerButtons:any = { };
  _modeConfigs:any = {
    isReady: false,

    onChoosenChangedCallback: null,
    choosenButtons: [ ]
  }

  constructor( initWidth:number, initHeight:number, targetPinScope:DefaultPin ) {
    super( {
      x: 0, y: 0,
      width: initWidth, height: initHeight,
      visible: false
    } );

    this._targetPinScope = targetPinScope;

    PinUtilitys.anker.getAllPosValues( ).forEach(
      (curPos:any) => this._addAnkerBotton( curPos )
    );

    //this._addAnkerBotton( "topright" );

    //this.performStart( (a,b,c) => console.log( a, b, c ) );
  }

  calibrateButton( targetButton:Konva.Shape, ankerKey:string ) : void {
    targetButton.setPosition(
      this._calculatePosition( ankerKey )
    );
  }
  calibrateAllButtons( ) : void {
    for (let ankerKey in this._ankerButtons) {
      this.calibrateButton(
        this._ankerButtons[ ankerKey ].shape,
        ankerKey
      );
    }
  }

  _calculatePosition( targetAnker:string ) : any {
    let pinWidth:number = this._targetPinScope._width;
    let pinHeight:number = this._targetPinScope._width;

    // Simple Positons
    let targetPos:any = PinUtilitys.anker.getCornerOffsetPos(
      targetAnker,
      pinWidth, pinHeight
    )
    
    let paddingPos:any = PinUtilitys.anker.getPaddindCornerPos(
      targetAnker, 16,
      targetPos
    );

    return paddingPos;
  }

  _onAnkerBottonClicked(
    ankerStr:string,
    newBtnCheckState:boolean,
    targetButton:Konva.Shape,
    isTriggerEvent:boolean = true
  ) : void {
    this._setButtonState( ankerStr, newBtnCheckState, targetButton );

    if (isTriggerEvent)
      this._modeConfigs.onChoosenChangedCallback( this, ankerStr, newBtnCheckState, targetButton );
  }
  
  _addAnkerBotton( ankerPosStr:string ) : void {
    let scope = this;

    if (!this._ankerButtons[ ankerPosStr ]) {
      let newAnkerButton = new Konva.Circle( {
        x: 0, y: 0,
        radius: 16,
        fill: 'rgba( 255, 160, 160, 0.25 )',
        stroke: 'rgb( 255, 160, 160 )',
        strokeWidth: 2,
      } );

      this.calibrateButton( newAnkerButton, ankerPosStr );

      let newBtnCheckState:boolean = false;
      newAnkerButton.on(
        "mouseover",
        ()=> newAnkerButton.fill(
          "rgba( 255, 160, 160, " + (!newBtnCheckState ? ".5" : ".75") + " )"
        )
      );
      newAnkerButton.on(
        "mouseout",
        ()=> newAnkerButton.fill(
          "rgba( 255, 160, 160, " + (!newBtnCheckState ? ".25" : ".75") + " )"
        )
      );

      newAnkerButton.on( "click", _=> {
        newBtnCheckState = this._modeConfigs.choosenButtons.indexOf( ankerPosStr ) === -1;

        scope._onAnkerBottonClicked( ankerPosStr, newBtnCheckState, newAnkerButton );
      } );

      this.add( newAnkerButton );
      // Sammel alle Buttons
      this._ankerButtons[ ankerPosStr ] = {
        shape: newAnkerButton,
        anker: ankerPosStr
      };
    }
  }

  _setButtonState( ankerStr:string, newState:boolean, targetButton:Konva.Shape ) {

    // Update Memory
    if (newState) this._modeConfigs.choosenButtons.push( ankerStr );
    else {
      let targetIndex = this._modeConfigs.choosenButtons.indexOf( ankerStr );
      this._modeConfigs.choosenButtons.splice( targetIndex, 1 );
    }

    // Update Check Styling
    targetButton.fill(
      "rgba( 255, 160, 160, " + (newState ? ".75" : ".5") + " )"
    );

  }

  _setAllButtonStates( newState:boolean ) : void {
    PinUtilitys.anker.getAllPosValues( ).forEach(
      (curPos:string) => this._setButtonState( curPos, newState, this._ankerButtons[ curPos ] )
    );
  }

  performStart( onChoosenChangedCallback:Function ) : void {
    this.visible( true );

    this._modeConfigs = {
      isReady: true,

      choosenButtons: [ ],
      onChoosenChangedCallback
    };

    this.calibrateAllButtons( );
  }

  performFinish( ) {
    this.visible( false );

    this._modeConfigs = {
      isReady: false,
      onChoosenChangedCallback: null
    }
  }
}