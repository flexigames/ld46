import * as PIXI from 'pixi.js'

export default class Intro {
    constructor({camera, player, plant, stage, setPause}) {
        this.stage = stage
        this.createBar()

        this.sceneEnded = false

        camera.setPos((player.pos.x + plant.pos.x) / 2, (player.pos.y + plant.pos.y)/2)
        plant.onIntroEnd = () => {
            this.sceneEnded = true
            camera.transitionTo(player, () => {
                setPause(false)
                camera.follow(player)
            })
        }
    }

    createBar() {
        const barHeight = 110
        const upper =new PIXI.Graphics()
        upper.beginFill(0x000000)
        upper.drawRect(0, 0, 512, barHeight)
        upper.endFill()
        this.upperRect = upper

        const lower =new PIXI.Graphics()
        lower.beginFill(0x000000)
        lower.drawRect(0, 512- barHeight - 42, 512, barHeight)
        lower.endFill()
        this.lowerRect = lower


        this.stage.addChild(upper)
        this.stage.addChild(lower)
    }

    update(dt) {
        if (this.sceneEnded) {
            this.upperRect.y -= dt
            this.lowerRect.y += dt
        }
    }
}