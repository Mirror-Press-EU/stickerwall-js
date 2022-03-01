import Konva from 'konva';
import Instandable from '../instandable';

export default class Shapes extends Instandable {
  _shapeType;
  _shape;

  constructor( ) {
    super( );
    this._extAdd( "shapes" );
    this._shapeType = "basis";
  }

  setDisplayNode( konvaNode ){
    this._shape = konvaNode;
  }

  getDisplayNode( ) {
    return this._shape;
  }

  getType( ) { return this._type; }

  serializeToJSON( valuesObj={ } ) {
    let vPos = this._shape.getPosition( );
    let defaultValues = { x: vPos.x, y: vPos.y }
    
    return {
      type: this._shapeType,
      values: Object.assign( defaultValues, valuesObj )
    };
  }
}