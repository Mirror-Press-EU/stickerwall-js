export default class CostumZoomBar {
  _controlls = { };
  _canDrawer;

  constructor( controllsMapping, canDrawer ) {
    this._controlls = controllsMapping;
    this._canDrawer = canDrawer;

    let zoomBarContainer = controllsMapping.container;
    let zoomBarResetZoomButton = controllsMapping.displayResetZoomButton;
    let zoomBarValueSlider = controllsMapping.slider;

    if (zoomBarContainer
    && zoomBarResetZoomButton
    && zoomBarValueSlider
    ) {
      controllsMapping.instance = this;

      canDrawer.eventHandle.onWheelZoom = ( newScale, newPos ) => {
        if (zoomBarContainer.classList.contains( "is-open" )) {
          zoomBarContainer.classList.remove( "is-open" );
          zoomBarResetZoomButton.root.classList.remove( "mdc-button--raised" );
        }

        zoomBarContainer.querySelector( ".costum-zoom-bar--b-text" ).innerText = parseInt(newScale *100) + "%";
      };

      zoomBarResetZoomButton.root.addEventListener( 'click', _=> {
        if (zoomBarContainer.classList.contains( "is-open" )) {
          
          zoomBarContainer.querySelector( ".costum-zoom-bar--b-text" ).innerText = "100%";
          zoomBarValueSlider.setValue( 100 );

          canDrawer.setZoom( 1.00 );
        }

        zoomBarContainer.classList.toggle( "is-open" );
        zoomBarResetZoomButton.root.classList.toggle( "mdc-button--raised" );
      } );

      canDrawer.addEventListener( 'click',  _=> {
        zoomBarContainer.classList.remove( "is-open" );
        zoomBarResetZoomButton.root.classList.remove( "mdc-button--raised" );
      } );

      let onSliderChangeHandle = (event) => {
        let targetInput = event.target.querySelector( "input" );
        let targetTextDisplay = zoomBarContainer.querySelector( ".costum-zoom-bar--b-text" );

        if (targetTextDisplay
        &&  targetInput && targetInput.value !== undefined
        ) {
          let zoomValStr = targetInput.value;
          let zoomVal = Number( (zoomValStr.length === 2)
            ? "0." + zoomValStr
            : "1." + zoomValStr.substr( 1 )
          );
          canDrawer.setZoom( zoomVal );
          targetTextDisplay.innerText = zoomValStr + "%";
        }
      }
      'click, dragend, touchend, touchmove'.split(', ')
      .forEach(
        (evtName) => zoomBarContainer.addEventListener( evtName, onSliderChangeHandle )
      );
    }
  }
}