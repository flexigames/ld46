import * as PIXI from 'pixi.js'
import {createBigText} from './text'

export default class CutScene {
    constructor(stage, barVisible = false) {
        this.stage = stage
        this.sceneEnded = false
        this.barHeight = 110
        this.barVisible = barVisible
        this.createBar()

        this.barDirection = 0

    }

    createBar() {
        const barHeight = this.barHeight
        const upper = new PIXI.Graphics()
        upper.beginFill(0x000000)
        upper.drawRect(0, 0, 512, barHeight)
        upper.endFill()
        upper.zIndex = 200000
        this.upperRect = upper
        this.upperRect.visible = this.barVisible

        const lower = new PIXI.Graphics()
        lower.beginFill(0x000000)
        lower.drawRect(0, 0, 512, barHeight)
        lower.endFill()
        lower.y = 512 - barHeight
        lower.zIndex = 200000
        this.lowerRect = lower
        this.lowerRect.visible = this.barVisible

        this.stage.addChild(upper)
        this.stage.addChild(lower)
    }

    showBar() {
        this.upperRect.visible = true
        this.lowerRect.visible = true
        this.upperRect.y = -this.barHeight
        this.lowerRect.y = 512
        this.barDirection = -1
    }

    hideBar() {
        this.barDirection = 1
    }

    setDark() {
        this.upperRect.height = 512

        const text = createBigText('the end\n\nthanks for playing <3')
        text.x = 512 / 2 - text.width / 2
        text.y = 512 / 2 - 50
        text.zIndex = 2000001
        this.stage.addChild(text)
    }

    update(dt) {
        this.upperRect.y -= this.barDirection * dt
        this.lowerRect.y += this.barDirection * dt
        if (this.barDirection === -1 && this.upperRect.y >= 0) {
            this.upperRect.y = 0
            this.lowerRect.y = 512 - this.barHeight
            this.barDirection = 0
        }
        if  (this.barDirection === 1 && this.upperRect.y <= -this.barHeight) {
            this.barDirection = 0
            this.upperRect.visible = false
            this.lowerRect.visible = false
        }
    }
}