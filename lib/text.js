import * as PIXI from 'pixi.js'

export default function createText(text) {
    return new PIXI.Text(text, {fontFamily : 'Silkscreen', fontSize: 16, fill : 0x000000, align : 'center'})
}

export function createBigText(text) {
    return new PIXI.Text(text, {fontFamily : 'Silkscreen', fontSize: 16, fill : 0xffffff, align : 'center'})
}