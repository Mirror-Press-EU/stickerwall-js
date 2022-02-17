import Konva from 'konva';

import PinUtilitys from '../base/pin.utils';
import BasisPin from "../base/pin";

import __DEFAULT_CONFIG__ from './link-qoute.config';

import CostumIcons from '/./assets/icons/icons';

export default class PinLinkQoute extends BasisPin {

  sourceLogo = null;
  cover = null;
  title = null;
  text = null;

  // --- Defaults ---
  constructor( posX, posY, dataIdentifyer,
    valuesObj={ title:null, text:null, sourceLogo:null, cover:null }
  ) {
    super( posX, posY, dataIdentifyer );
    this._extAdd( "pin-link-qoute" );
    
    this.pinType = "link-qoute";

    this._height = 0;
    this._width = 256;

    this.initValues( valuesObj );

    this.drawAllSprites( );
    
    this.fetchCoverImage( "https://i1.wp.com/mirror-press.de/wp-content/uploads/2020/12/Werkzeuge_01-scaled.jpg?w=256" );

    this.updateSize( );
  }

  fetchCoverImage( url ) {
    /*let coverImage = new Image( );
    coverImage.onload = _=> this.cover.setFillPatternImage( coverImage );
    coverImage.src = url;*/
  }

  drawAllSprites( ) {
    let pinScope = this;
    const beforeBasicFn = _=> { };
    const afterBasicFn = _=> {
      pinScope.background = PinUtilitys.basic.addAttachmentsToCanvasNode(
        new Konva.Rect( __DEFAULT_CONFIG__.childs.container ), pinScope
      );
      pinScope.cover = PinUtilitys.basic.addAttachmentsToCanvasNode(
        new Konva.Rect( __DEFAULT_CONFIG__.childs.cover ), pinScope
      );
      pinScope.sourceLogo = PinUtilitys.basic.addAttachmentsToCanvasNode(
        new Konva.Rect( Object.assign(
          __DEFAULT_CONFIG__.childs.sourceLogo, { fillPatternImage: CostumIcons.getImage( "test_logo" ) }
        ) ), pinScope
      );
      pinScope.title = PinUtilitys.basic.addAttachmentsToCanvasNode(
        new Konva.Text( Object.assign(
          __DEFAULT_CONFIG__.childs.title, { text: this.values.title }
        ) ), pinScope
      );
      pinScope.text = PinUtilitys.basic.addAttachmentsToCanvasNode(
        new Konva.Text( Object.assign(
          __DEFAULT_CONFIG__.childs.text, { text: this.values.text }
        ) ), pinScope
      );
      
      pinScope._container.add(
        pinScope.background,
        pinScope.cover,
        pinScope.sourceLogo,
        pinScope.title,
        pinScope.text
      );
      pinScope.afterDrawCalculates( );
    };

    this.drawBasics( beforeBasicFn, afterBasicFn );
  }

  updateSize( ) {
    let pinHeight = this.getChildrenHeight( ) + 24;
    let pinWidth = this.getChildrenWidth( );
    super.updateSize( pinHeight, pinWidth );

    this.background.setHeight( pinHeight ); // Background

    this.text.setPosition({ x:0, y: 108 + this.title.height( ) }); // Textdarstellung
  }

  /*getChildrenHeight( ) {
    return this.cover.height( ) + this.title.height( ) + this.text.height( ) -48;
  }

  getChildrenWidth( ) {
    return super.getChildrenWidth(
      [this.cover.width( ), this.title.width( ), this.text.width( )]
    );
  }*/

  setDisplayValues( newAttrValues ) {
    this.title.setText( newAttrValues.title );
    this.text.setText( newAttrValues.text );

    this.updateValues( newAttrValues );

    this.updateSize( );
  }

  serializeToJSON( ) {
    return super.serializeToJSON({
      sourceLogo: null, // this.values.sourceLogo,
      cover: null, //this.values.cover,
      title: this.values.title,
      text: this.values.text, 
    });
  }
}