import * as PIXI from 'pixi.js'
import JoeExotic from "../entities/JoeExotic"
import CutScene from './CutScene'

export default class Intro extends CutScene {
    constructor({ camera, player, plant, stage, setPause }) {
        super(stage, true)
        this.stage = stage

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
            'when it grows\nbig enough',
            'im gonna\nfeed it...',
            '..that b down\nin florida'
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
        this.hideBar()

        this.camera.transitionTo(this.player, () => {
            this.setPause(false)
            this.camera.follow(this.player)
        })
    }

    update(dt) {
        super.update(dt)
        if (!this.sceneEnded) {
            this.joe.update(dt)
        }
    }
}