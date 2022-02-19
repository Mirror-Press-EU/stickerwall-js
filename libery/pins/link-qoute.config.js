const WIDTH = 256;

const STROKE_PADDING = 4;

export default {
  childs: {
    'container': {
      x: 0, y: 0,
      width: WIDTH, height: 0,
      fill: '#ffffff',
      //stroke: 'rgb( 100, 100, 100 )', strokeWidth: 8,
      cornerRadius: 12,
      opacity: .25,
    },
    'cover': {
      x: STROKE_PADDING, y: STROKE_PADDING,
      width: WIDTH -STROKE_PADDING*2, height: 128,
      opacity: 0.87,
      cornerRadius: 9 //[ 9, 9, 0, 0 ]
    },
    'sourceLogo': {
      x: 0, y: 0,
      width: 48, height: 48,
      stroke: 'orange', strokeWidth: 2,
      cornerRadius: [ 12, 0, 12, 0 ],
      shadowColor: 'black', shadowBlur: 5, shadowOpacity: 0.5,
      shadowOffset: { x: 2.5, y: 2.5 }
    },
    'title': {
      x: 0, y: 128 +16,
      text: "",
      fontSize: 18, fontFamily: 'Calibri',
      fill: '#555',
      width: WIDTH, padding: 8,
      align: "center"
    },
    'text': {
      x: 16, y: 128 +24,
      text: "",
      fontSize: 12, fontheight:16, fontFamily: 'Calibri',
      fill: '#555',
      width: WIDTH -32,
      align: "center"
    }
  }
}