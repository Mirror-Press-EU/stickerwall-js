import CanvasDrawer from "../libery/can-drawer";

export default class CostumZoomBar {
  _controlls:any = { };
  _canDrawer:CanvasDrawer;

  constructor( controllsMapping:any, canDrawer:CanvasDrawer ) {
    this._controlls = controllsMapping;
    this._canDrawer = canDrawer;

    let zoomBarContainer:any = controllsMapping.container;
    let zoomBarResetZoomButton:any = controllsMapping.displayResetZoomButton;
    let zoomBarValueSlider:any = controllsMapping.slider;

    if (zoomBarContainer
    && zoomBarResetZoomButton
    && zoomBarValueSlider
    ) {
      controllsMapping.instance = this;

      canDrawer.eventHandle.onWheelZoom = ( newScale:number, newPos:number ) => {
        if (zoomBarContainer.classList.contains( "is-open" )) {
          zoomBarContainer.classList.remove( "is-open" );
          zoomBarResetZoomButton.root.classList.remove( "mdc-button--raised" );
        }

        zoomBarContainer.querySelector( ".costum-zoom-bar--b-text" ).innerText = (newScale * 100) + "%";
      };

      zoomBarResetZoomButton.root.addEventListener( 'click', ()=> {
        if (zoomBarContainer.classList.contains( "is-open" )) {
          
          zoomBarContainer.querySelector( ".costum-zoom-bar--b-text" ).innerText = "100%";
          zoomBarValueSlider.setValue( 100 );

          canDrawer.setZoom( 1.00 );
        }

        zoomBarContainer.classList.toggle( "is-open" );
        zoomBarResetZoomButton.root.classList.toggle( "mdc-button--raised" );
      } );

      canDrawer.addEventListener( 'click',  ()=> {
        zoomBarContainer.classList.remove( "is-open" );
        zoomBarResetZoomButton.root.classList.remove( "mdc-button--raised" );
      } );

      let onSliderChangeHandle = (event:any) => {
        let targetInput:HTMLInputElement = event.target.querySelector( "input" );
        let targetTextDisplay:HTMLElement = zoomBarContainer.querySelector( ".costum-zoom-bar--b-text" );

        if (targetTextDisplay
        &&  targetInput && targetInput.value !== undefined
        ) {
          let zoomValStr:string = targetInput.value;
          let zoomVal:number = Number( (zoomValStr.length === 2)
            ? "0." + zoomValStr
            : "1." + zoomValStr.substr( 1 )
          );
          canDrawer.setZoom( zoomVal );
          targetTextDisplay.innerText = zoomValStr + "%";
        }
      };

      ['click', 'dragend', 'touchend', 'touchmove'].forEach(
        (evtName:string) => zoomBarContainer.addEventListener(
          evtName, onSliderChangeHandle
        )
      );
    }
  }
}