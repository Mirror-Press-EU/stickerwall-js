import Konva from "konva";
import AttachmentAnker from "../attachments/anker";
import PinUtilitys from './pin.utils';

export default class AttachOverlay extends Konva.Group {
  _targetPinScope;
  _ankerButtons = { };
  _modeConfigs = {
    isReady: false,

    onChoosenChangedCallback: null,
    choosenButtons: [ ]
  }

  constructor( initWidth, initHeight, targetPinScope ) {
    super( {
      x: 0, y: 0,
      width: initWidth, height: initHeight,
      visible: false
    } );

    this._targetPinScope = targetPinScope;

    PinUtilitys.anker.getAllPos( ).forEach(
      (curPos) => this._addAnkerBotton( curPos )
    );

    //this._addAnkerBotton( "topright" );

    //this.performStart( (a,b,c) => console.log( a, b, c ) );
  }

  calibrateButton( targetButton, ankerKey ) {
    targetButton.setPosition(
      this._calculatePosition( ankerKey )
    );
  }
  calibrateAllButtons( ) {
    for (let ankerKey in this._ankerButtons) {
      this.calibrateButton(
        this._ankerButtons[ ankerKey ].shape,
        ankerKey
      );
    }
  }

  _calculatePosition( targetAnker ) {
    // Simple Positons
    let targetPos = PinUtilitys.anker.getCornerPos(
      this._targetPinScope,
      targetAnker
    )
    
    let paddingPos = PinUtilitys.anker.getPaddindCornerPos(
      targetAnker, 16,
      targetPos
    );

    return paddingPos;
  }

  _onAnkerBottonClicked( ankerStr, newBtnCheckState, targetButton ) {

    // Update Memory
    if (newBtnCheckState) this._modeConfigs.choosenButtons.push( ankerStr );
    else {
      let targetIndex = this._modeConfigs.choosenButtons.indexOf( ankerStr );
      this._modeConfigs.choosenButtons.splice( targetIndex, 1 );
    }

    // Update Check Styling
    targetButton.fill(
      "rgba( 255, 160, 160, " + (newBtnCheckState ? ".75" : ".5") + " )"
    );

    /*if (newCheckState) {
      this._modeConfigs.choosenButtons.push( ankerStr );
    } else {
      let targetIndex = this._modeConfigs.choosenButtons.indexOf( ankerStr );
      this._modeConfigs.choosenButtons.slice( targetIndex, 1 );
    }*/

    this._modeConfigs.onChoosenChangedCallback( ankerStr, newBtnCheckState, targetButton );
  }
  
  _addAnkerBotton( ankerPosStr ) {
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

      let newBtnCheckState = false;
      newAnkerButton.on(
        "mouseover",
        _=> newAnkerButton.fill(
          "rgba( 255, 160, 160, " + (!newBtnCheckState ? ".5" : ".75") + " )"
        )
      );
      newAnkerButton.on(
        "mouseout",
        _=> newAnkerButton.fill(
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

  performStart( onChoosenChangedCallback ) {
    this.setVisible( true );

    this._modeConfigs = {
      isReady: true,

      choosenButtons: [ ],
      onChoosenChangedCallback
    };

    this.calibrateAllButtons( );
  }

  performFinish( ) {
    this.setVisible( false );

    this._modeConfigs = {
      isReady: false,
      onChoosenChangedCallback: null
    }
  }
}