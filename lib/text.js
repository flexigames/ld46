import * as PIXI from 'pixi.js'

module.exports = function createText(text) {
    return new PIXI.Text(text, {fontFamily : 'Silkscreen', fontSize: 16, fill : 0x000000, align : 'center'})
}