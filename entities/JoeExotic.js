import Character from "./Character";
import V from "../lib/vec2";

export default class JoeExotic extends Character {
    constructor(x, y, opts = {}) {
        super(x, y, {
            walkSprite: "anim_joe_exotic",
            idleSprite: "anim_joe_exotic",
        })

        this.targetPoint = false
        this.targetReached = () => {}
    }

    moveTo(x, y) {
        this.targetPoint = V(x, y)
        return new Promise(resolve => this.targetReached = resolve)
    }

    update(dt) {
        super.update(dt)
        if (this.targetPoint) {
            if (this.targetPoint.distance(this.pos) < 5) {
                this.setDirection(V(0, 0))
                this.targetPoint = false
                this.targetReached()
            } else {
                this.setDirection(this.targetPoint.sub(this.pos))
            }
        }
    }

    onMoveChange(isMoving) {
        this.isMoving = isMoving
        this.changeTexture("anim_joe_exotic")
        this.sprite.animationSpeed = isMoving ? this.speed / 25 : 0
      }
}