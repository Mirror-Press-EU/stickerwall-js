import Controller from './gui/controller';

function run( ) {
  let guiControll: Controller = new Controller( );
}

// in case the document is already rendered
if (document.readyState!='loading') run( );
// modern browsers
else if (document.addEventListener) document.addEventListener( 'DOMContentLoaded', run );
// IE <= 8
/*else document.attachEvent( 'onreadystatechange', function( ) {
  if (document.readyState == 'complete') run( );
});*/