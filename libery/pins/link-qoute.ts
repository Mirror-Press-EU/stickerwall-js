import Konva from 'konva';

import PinUtilitys from '../base/pin.utils';
import Utilitys from './link-qoute.utils';
import BasisPin from "../base/pin";

import __DEFAULT_CONFIG__ from './link-qoute.config';

import { Image } from 'konva/lib/shapes/Image';
import Pin from '../base/pin';

export default class PinLinkQoute extends BasisPin {

  sourceLogo:Image = null;
  cover:Konva.Rect = null;
  title:Konva.Text = null;
  text:Konva.Text = null;

  // --- Defaults ---
  constructor(
    posX:number = 0,
    posY:number = 0,
    dataIdentifyer:string = null,
    valuesObj:any = { title:null, text:null, sourceLogo:null, cover:null }
  ) {
    super( posX, posY, dataIdentifyer );
    this._extAdd( "pin-link-qoute" );
    
    this.pinType = "link-qoute";

    this.initValues( valuesObj );

    this.drawAllSprites( );
    
    this.fetchCoverImage( "https://i1.wp.com/mirror-press.de/wp-content/uploads/2020/12/Werkzeuge_01-scaled.jpg" );

    this.updateSize( );

    //this.background.fill( "rgb(100,100,100)" );
  }

  fetchCoverImage( url:string ) : void {
    let targetCover:any = this.cover;
    let w = this._width;
    let h = this._height;
    /*let coverImage = new Image( );
    coverImage.onload = _=> {
      targetCover.setFillPatternImage( coverImage );
    };*/
    Utilitys.fetchImage(
      url, ( img:Image, suc:boolean ) => {
        if (!suc) return;

        let zoomLevel = Utilitys.getZoomValueFromImageSize( img, w, h );
        targetCover.fillPatternScale( { x:zoomLevel, y:zoomLevel } );
        targetCover.setFillPatternImage( img );
      }
    );
    //coverImage.src = url;
  }

  drawAllSprites( ) : void {
    let pinScope = this;
    const beforeBasicFn = ()=> { };
    const afterBasicFn = ()=> {
      pinScope._background = this._addShape(
        new Konva.Rect( __DEFAULT_CONFIG__.childs.container ), true
      );
      pinScope.cover = this._addShape(
        new Konva.Rect( __DEFAULT_CONFIG__.childs.cover )
      );
      pinScope.sourceLogo = this._addShape(
        new Konva.Rect( Object.assign(
          __DEFAULT_CONFIG__.childs.sourceLogo, { /*fillPatternImage: CostumIcons.getImage( "test_logo" )*/ }
        ) )
      );
      pinScope.title = this._addShape(
        new Konva.Text( Object.assign(
          __DEFAULT_CONFIG__.childs.title, { text: this.values.title }
        ) )
      );
      pinScope.text = this._addShape(
        new Konva.Text( Object.assign(
          __DEFAULT_CONFIG__.childs.text, { text: this.values.text }
        ) )
      );
      
      pinScope.afterDrawCalculates( );
    };

    this.drawBasics( beforeBasicFn, afterBasicFn );
  }

  override updateSize( ) : void {
    let pinHeight = this.getChildrenHeight( ) + 24;
    let pinWidth = this.getChildrenWidth( );
    super.updateSize( );

    this._background.setHeight( pinHeight ); // Background

    this.text.setPosition( {
      x: __DEFAULT_CONFIG__.childs.text.x,
      y: this.title.height( ) + __DEFAULT_CONFIG__.childs.text.y
    } ); // Textdarstellung
  }

  /*getChildrenHeight( ) {
    return this.cover.height( ) + this.title.height( ) + this.text.height( ) -48;
  }

  getChildrenWidth( ) {
    return super.getChildrenWidth(
      [this.cover.width( ), this.title.width( ), this.text.width( )]
    );
  }*/

  public override setDisplayValues( newAttrValues:any ) : void {
    this.title.setText( newAttrValues.title );
    this.text.setText( newAttrValues.text );

    this.updateValues( newAttrValues );
  }

  public override fromSerialized( valuesObj:any, callback:Function=()=>{} ) : Pin {

    super.fromSerialized( valuesObj, ()=> {
      this.setDisplayValues( valuesObj.values );

      callback( );
    } );

    return this;
  }

  public override serializeToJSON( )  {
    return super.serializeToJSON({
      sourceLogo: null, // this.values.sourceLogo,
      cover: null, //this.values.cover,
      title: this.values.title,
      text: this.values.text, 
    });
  }
}