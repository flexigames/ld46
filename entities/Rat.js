import Draggable from "./Draggable"

export default class Rat extends Draggable {
    constructor(x, y, opts = {}) {
        super(x, y, {sprite: 'anim_rat', ...opts})

        this.addTag('rat')

        this.moveDirectionX = 1
        this.distance = 0
        this.maxDistance = 300
    }

    update(dt) {
        super.update(dt)
        if (this.heldBy) return
        const distance = 2 * dt
        this.distance += distance
        if (this.distance >= this.maxDistance) {
            this.moveDirectionX *= -1
            this.distance = 0
            this.sprite.scale.x = -this.moveDirectionX
        }
        this.setPosition(this.pos.x + distance * this.moveDirectionX, this.pos.y)
    }
}