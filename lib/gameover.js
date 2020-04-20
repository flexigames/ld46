import * as PIXI from 'pixi.js'
import {createBigText} from './text'

const texts = {
    'neighbor': 'you were caught by the neighbor :(',
    'plantdead': 'your plant starved :(',
    'neighborplant': 'the neigbor got your plant :('
}

export default class GameOver {
    constructor(stage, onRestart) {
        this.onRestart = onRestart
        this.container = new PIXI.Container()
        stage.addChild(this.container)
        this.container.visible = false


        const background = new PIXI.Graphics()
        background.beginFill(0x000000)
        background.drawRect(0, 0, 512, 512)
        background.endFill()
        this.container.addChild(background)

        const text = createBigText('game over')
        text.x = 512 / 2 - text.width / 2
        text.y = 512 / 2 - 50
        this.text = text
        this.container.addChild(text)
    }

    continue() {
        if (this.container.visible) {
            this.container.visible = false
            this.onRestart()
        }
    }

    set(reason) {
        this.container.visible = true
        this.text.text = texts[reason] + ' \n\npress enter to try again_'
        this.text.x = 512 / 2 - this.text.width / 2
    }
}