import Collider from "./Collider"
import V from "../lib/vec2"

export default class Character extends Collider {
  constructor(x, y, opts = {}) {
    super(x, y, { sprite: "anim_heart_empty", ...opts })

    const { speed = 2 } = opts

    this.speed = speed
    this.direction = V(0, 0)
  }

  update(dt) {
    super.update(dt)
    this.setPosition(this.pos.add(this.direction.multiply(this.speed * dt)))
  }

  setDirection(direction) {
    this.direction = direction
  }
}
