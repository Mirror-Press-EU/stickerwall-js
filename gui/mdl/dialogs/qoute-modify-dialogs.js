import BaseDialog from "./base-modify-dialog";

export default class QouteModifyDialog extends BaseDialog {
  constructor( containerDomEl, pinAttrKeyList, dialogMdlMapping, pinMangerScope ) {
    super( containerDomEl, pinAttrKeyList, dialogMdlMapping, pinMangerScope );
  }
  
  initNewValues( ) {
    this._resultInstance = pinMangerScope.createPinLinkQuote( );
  }
  
  // Overriding Methods
  _getFormularValues( ) {
    let elMap = this._elements;
    let titleEl = elMap.fields.title;
    let textEl = elMap.fields.text;

    if (elMap.container &&  titleEl && textEl) {
      return {
        title: titleEl.value,
        text: textEl.value
      };
    }
  }

  _setFormularValues( initValues ) {
    let elMap = this._elements;

    if (initValues.title
    &&  initValues.text
    ) {
      elMap.fields.title.value = initValues.title;
      elMap.fields.text.value = initValues.text;
    };

  }

  _validateFormular( attrValues ) {
    if (attrValues.title && attrValues.text) {
      return (typeof attrValues.title == "string" &&  typeof attrValues.text == "string");
    }
  }

  _applyToStage( attrValues ) {
    this._resultInstance.setDisplayValues( attrValues );

    return this;
  }

  _clearFormularFields( ) {
    if (elMap.container
    &&  elMap.fields.length > 0
    ) {
      elMap.title.value = "";
      elMap.text.value = "";
    }
  }
}