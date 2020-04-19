import Character from "./Character"

export default class Player extends Character {
  constructor(x, y, opts = {}) {
    super(x, y, {
      idleSprite: "anim_senor_idle",
      walkSprite: "anim_senor_run",
      animationSpeed: 0.01,
      boundingBox: {
        x: 0,
        y: 0,
        width: 0.9,
        height: 0.2
      },
      tags: ['player'],
      ...opts
    })

    this.pickupIntent = false
  }

  startPickup() {
    if (!this.holding) this.pickupIntent = true
  }

  endPickup() {
    if (this.pickupIntent) {
      this.pickupIntent = false
    } else if (this.holding) {
      this.drop()
    }
  }

  onCollision(entity, data) {
    super.onCollision(entity, data)
    if (this.pickupIntent && !this.holding && entity.is("draggable")) {
      this.pickup(entity)
    }
  }

}
