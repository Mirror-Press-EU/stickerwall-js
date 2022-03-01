export default class Instandable {
  _extensionsList = [ ];

  constructor( ) { }

  _extAdd( className ) {
    this._extensionsList.push( className );
  }

  instanceOf( otherClass ) {
    if (typeof otherClass === "object") {
      if (otherClass._extensionsList) {
        if (this._extensionsList[0] === otherClass._extensionsList[0]) {
          return true;
        }
      }
    } else if (typeof otherClass === "string") {
      return this._extensionsList.indexOf( otherClass ) >= 0;
    }

    return false;
  }
}