import { MDCDialog } from '@material/dialog';
import DefaultPin from '../../../libery/base/pin';
import SimpleDisplayMode from '../../../libery/display-modes/simple-display-mode';
import StickerWallManager from '../../../libery/sticker-wall';

export default class BaseModifyDialog extends MDCDialog {
  protected _pinManager:StickerWallManager;
  protected _resultInstance:DefaultPin;
  protected _mode:string;

  protected _attrList:string[] = [ ];
  protected _attrValues:any = { };
  protected _elements:any = { buttons:{ apply:null } };
  protected _allowedEvents:string[] = [ ];

  constructor( containerDomEl:HTMLElement, pinAttrKeyList:any, dialogMdlMapping:any, pinMangerScope:StickerWallManager ) {
    super( containerDomEl );

    this._pinManager = pinMangerScope;

    this._declareElements( dialogMdlMapping );
    this._declareFormValues( pinAttrKeyList );

    this.initNewValues( );
    this._bindActionEvent( );
  }

  _declareElements( dialogMdlMapping:any ) : void {
    if (dialogMdlMapping) {
      dialogMdlMapping.container = this;
      
      this._elements = Object.assign( this._elements,
        dialogMdlMapping
      );
    }
  }

  _declareFormValues( pinAttrKeyList:string[] ) : void {
    this._attrList = pinAttrKeyList;

    pinAttrKeyList.forEach(
      (curAttrKey) => this._attrValues[ curAttrKey ] = null
    );
  }

  _bindActionEvent( ) : void {
    let oldScope:BaseModifyDialog = this;
    let btns:any = this._elements.buttons;
    if (btns) {

      let applyBtn:any = btns.apply;
      if (applyBtn) applyBtn.root.addEventListener(
        "click", ()=> oldScope.applyFormular( )
      )

    }
  }

  fillFormular( newMode:string, initValues:any ) : void {
    newMode = newMode.toUpperCase( );
    this._mode = newMode;

    if (newMode === "CREATE") this.initNewValues( );
    else if (newMode === "MODIFY" && initValues !== null) this._setFormularValues( initValues );
  }

  applyFormular( ) : void {
    let attrValues:any = this._getFormularValues( );
    let targetPin:DefaultPin = this._resultInstance;

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

  cleanFormular( ) : void {
    this._clearFormularFields( );
    this._attrValues = { };
    this._declareFormValues( this._attrList );
  }

  eventIsAllowed( targetEventName:string ) : boolean {
    return this._allowedEvents.indexOf( targetEventName ) >= 0;
  }
  
  // Override Methode
  initNewValues( ) : void { }
  _getFormularValues( ) : any { return { }; }
  _setFormularValues( initValues:any ) : void { }
  _validateFormular( attrValues:any ) : boolean { return false; }
  _applyToStage( attrValues:any ) : void { }
  _clearFormularFields( ) : void { }
}