import PinLinkQoute from "../../../libery/pins/link-qoute";
import StickerWallManager from "../../../libery/sticker-wall";
import BaseDialog from "./base-modify-dialog";

export default class QouteModifyDialog extends BaseDialog {
  constructor( containerDomEl:HTMLElement, pinAttrKeyList:any, dialogMdlMapping:any, pinMangerScope:StickerWallManager ) {
    super( containerDomEl, pinAttrKeyList, dialogMdlMapping, pinMangerScope );
  }
  
  initNewValues( ) : void {
    this._resultInstance = new PinLinkQoute( );
  }
  
  // Overriding Methods
  _getFormularValues( ) : any {
    let elMap:any = this._elements;
    let titleEl:any = elMap.fields.title;
    let textEl:any = elMap.fields.text;

    if (elMap.container &&  titleEl && textEl) {
      return {
        title: titleEl.value,
        text: textEl.value
      };
    }
  }

  _setFormularValues( initValues:any ) : void {
    let elMap:any = this._elements;

    if (initValues.title
    &&  initValues.text
    ) {
      elMap.fields.title.value = initValues.title;
      elMap.fields.text.value = initValues.text;
    };

  }

  _validateFormular( attrValues:any ) : boolean {
    if (attrValues.title && attrValues.text) {
      return (typeof attrValues.title == "string" &&  typeof attrValues.text == "string");
    }
  }

  _applyToStage( attrValues:any ) : void {
    this._resultInstance.setDisplayValues( attrValues );
  }

  _clearFormularFields( ) : void {
    let elMap:any = this._elements;

    if (elMap.container
    &&  elMap.fields.length > 0
    ) {
      elMap.title.value = "";
      elMap.text.value = "";
    }
  }
}