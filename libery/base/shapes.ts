import Konva from 'konva';
import Instandable from '../instandable';

export default class Shapes extends Instandable {
  _shapeType:string;
  _shape:any;

  constructor( ) {
    super( );
    this._extAdd( "shapes" );
    this._shapeType = "basis";
  }

  setDisplayNode( konvaNode:any ) : void {
    this._shape = konvaNode;
  }

  getDisplayNode( ) : any {
    return this._shape;
  }

  getType( ) : string { return this._shapeType; }

  serializeToJSON( valuesObj={ } ) : any {
    let vPos = this._shape.getPosition( );
    let defaultValues = { x: vPos.x, y: vPos.y }
    
    return {
      type: this._shapeType,
      values: Object.assign( defaultValues, valuesObj )
    };
  }
}