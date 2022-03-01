import { MDCDialog } from '@material/dialog';

export default class BaseModifyDialog extends MDCDialog {
  _pinManager = null;
  _attrList = [ ];
  _attrValues = { };
  _elements = { buttons:{ apply:null } };
  _resultInstance = null;
  _mode = null;
  _allowedEvents = [ ];

  constructor( containerDomEl, pinAttrKeyList, dialogMdlMapping, pinMangerScope ) {
    super( containerDomEl );

    this._pinManager = pinMangerScope;

    this._declareElements( dialogMdlMapping );
    this._declareFormValues( pinAttrKeyList );

    this.initNewValues( );
    this._bindActionEvent( );
  }

  _declareElements( dialogMdlMapping ) {
    if (dialogMdlMapping) {
      dialogMdlMapping.container = this;
      
      this._elements = Object.assign( this._elements,
        dialogMdlMapping
      );
    }
  }

  _declareFormValues( pinAttrKeyList ) {
    this._attrList = pinAttrKeyList;

    pinAttrKeyList.forEach(
      (curAttrKey) => this._attrValues[ curAttrKey ] = null
    );
  }

  _bindActionEvent( ) {
    let oldScope = this;
    let btns = this._elements.buttons;
    if (btns) {

      let applyBtn = btns.apply;
      if (applyBtn) applyBtn.root.addEventListener(
        "click", _=> { oldScope.applyFormular( ); }
      )

    }
  }

  fillFormular( newMode, initValues ) {
    newMode = newMode.toUpperCase( );
    this._mode = newMode;

    if (newMode === "CREATE") this.initNewValues( );
    else if (newMode === "MODIFY" && initValues !== null) this._setFormularValues( initValues );
  }

  applyFormular( ) {
    let attrValues = this._getFormularValues( );
    let targetPin = this._resultInstance;

    if (this._validateFormular( attrValues )
    &&  targetPin != null
    ) {
      this._applyToStage( attrValues )
      
      if (this._mode === "CREATE") {
        targetPin._dataIdentifyer = this._pinManager.getNextRandomID( "q" );
        this._pinManager.addPinNode( targetPin );
      }

      this._elements.container.close( );
    } else alert("lol");
  }

  cleanFormular( ) {
    this._clearFormularFields( );
    this._attrValues = { };
    this._declareFormValues( this._attrList );
  }

  eventIsAllowed( targetEventName ) {
    return this._allowedEvents.indexOf( targetEventName ) >= 0;
  }
  
  // Override Methode
  initNewValues( ) { }
  _getFormularValues( ) { }
  _setFormularValues( initValues ) { }
  _validateFormular( attrValues ) { }
  _applyToStage( attrValues ) { }
  _clearFormularFields( ) { }
}