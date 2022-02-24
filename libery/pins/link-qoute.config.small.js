export default {
  childs: {
    'container': {
      x: 0, y: 0,
      width: 128, height: 128,
      fill: 'rgba(255,255,255,.86)',
      stroke: 'rgba(0,0,0,.25)', strokeWidth: 2,
      cornerRadius: 12
    },
    'cover': {
      x: 1, y: 1,
      width: 127, height: 64,
      opacity: 0.87,
      cornerRadius: [ 12, 12, 0, 0 ],
    },
    'sourceLogo': {
      x: 0, y: 0,
      width: 32, height: 32,
      stroke: 'orange', strokeWidth: 2,
      cornerRadius: [ 12, 0, 12, 0 ],
      shadowColor: 'black', shadowBlur: 5, shadowOpacity: 0.5,
      shadowOffset: { x: 2.5, y: 2.5 }
    },
    'title': {
      x: 0, y: 69,
      text: "",
      fontSize: 16, fontFamily: 'Calibri',
      fill: '#555',
      width: 128, padding: 8,
      align: "center"
    },
    'text': {
      x: 0, y: -100,
      text: "",
      fontSize: 8, fontheight: 16, fontFamily: 'Calibri',
      fill: '#555',
      width: 128, padding: 32,
      align: "center"
    }
  }
}