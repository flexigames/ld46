import Character from "./Character"
import play from "../lib/audio"

export default class Player extends Character {
  constructor(x, y, opts = {}) {
    super(x, y, {
      sprite: "anim_senor_run",
      animationSpeed: 0.15,
      boundingBox: {
        x: 0,
        y: 0,
        width: 0.9,
        height: 0.2
      },
      ...opts
    })

    this.pickupIntent = false
  }

  update(dt) {
    super.update(dt)
    if (this.holding) {
      this.holding.setPosition(this.pos.x, this.pos.y - 12)
      this.holding.sprite.zIndex = this.pos.y + 1
      this.holding.sprite.scale.x = this.sprite.scale.x
    }
  }

  startPickup() {
    if (!this.holding) this.pickupIntent = true
  }

  endPickup() {
    if (this.pickupIntent) {
      this.pickupIntent = false
    } else if (this.holding) {
      this.holding.setPosition(this.pos.x, this.pos.y + 12)
      this.holding.heldBy = null
      this.holding = null
    }
  }

  onCollision(entity, data) {
    super.onCollision(entity, data)
    if (this.pickupIntent && !this.holding && entity.is("draggable")) {
      this.holding = entity
      play("cat-hiss")
      entity.heldBy = this
    }
  }
}
