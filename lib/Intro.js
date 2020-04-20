import * as PIXI from 'pixi.js'
import JoeExotic from "../entities/JoeExotic"

export default class Intro {
    constructor({ camera, player, plant, stage, setPause }) {
        this.stage = stage
        this.createBar()

        this.plant = plant

        this.sceneEnded = false

        this.camera = camera
        this.player = player
        this.setPause = setPause

        this.startScene()

        camera.setPos((player.pos.x + plant.pos.x) / 2, (player.pos.y + plant.pos.y) / 2)

    }

    async startScene() {
        const joeexotic = new JoeExotic(2 * 500 + 600, 2 * 500 + 130)
        this.joe = joeexotic
        joeexotic.pickup(this.plant)
        await joeexotic.moveTo(2 * 500 + 300, 2 * 500 + 130)
        joeexotic.drop()
        await joeexotic.playTexts([
            'im going to prison',
            'you need to take\ncare of my plant',
            'make sure it\ndoesnt starve',
            'when it grows big enough',
            'im gonna feed it...',
            '..that b from florida'
        ])
        await joeexotic.moveTo(2 * 500 + 600, 2 * 500 + 130)
        await this.plant.playTexts([
            '...',
            'hi there',
            'u kno what?',
            'im rlly hungry!',
            'get me some..',
            'hmmmm..',
            'meat pie!'
        ])
        joeexotic.destroy()
        this.plant.setWants(0)
        this.sceneEnded = true

        this.camera.transitionTo(this.player, () => {
            this.setPause(false)
            this.camera.follow(this.player)
        })
    }

    createBar() {
        const barHeight = 110
        const upper = new PIXI.Graphics()
        upper.beginFill(0x000000)
        upper.drawRect(0, 0, 512, barHeight)
        upper.endFill()
        this.upperRect = upper

        const lower = new PIXI.Graphics()
        lower.beginFill(0x000000)
        lower.drawRect(0, 512 - barHeight - 42, 512, barHeight)
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
        this.joe.update(dt)
    }
}