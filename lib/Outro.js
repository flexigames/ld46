import * as PIXI from 'pixi.js'
import CutScene from './CutScene'

export default class Outro extends CutScene {
    constructor(plant, player, camera, stage) {
        super(stage)
        this.plant = plant
        this.player = player
        this.camera = camera

        this.gobblesPlayer = false

        this.over =false
    }

    async start() {
        this.showBar()
        this.camera.unfollow()
        this.camera.setPos((this.player.pos.x + this.plant.pos.x)/2, (this.player.pos.y + this.plant.pos.y)/2 - 50)
        console.log('start')
        const mask = new PIXI.Graphics()
        mask.beginFill(0x000000)
        mask.drawRect(-this.player.sprite.width / 2, -this.player.sprite.height, this.player.sprite.width, this.player.sprite.height)
        mask.endFill()

        this.mask = mask
        this.player.sprite.addChild(mask)
        this.player.sprite.mask = mask

        await this.plant.playTexts([
            'mhhhh',
            'thank you for\nthat yummy cat',
            'but now...',
            'i need something bigger',
            'like a human..',
            'like',
            'you!'
        ])
        this.gobblePlayer()
    }

    gobblePlayer() {
        this.camera.unfollow()

        this.player.pos.x = this.plant.pos.x - 7
        this.player.pos.y = this.plant.pos.y + 14
        this.gobblesPlayer = true
    }

    update(dt) {
        super.update(dt)
        if (this.gobblesPlayer) {
            this.mask.y += dt * 2
            this.player.moveBy(0, -dt * 2)
            // this.player.update(dt)
            this.player.sprite.zIndex = 100000
            if (this.mask.y > 200) {
                if (!this.over) this.setDark()
                this.over = true
            }
        }
    }
}