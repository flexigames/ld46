import Character from "./Character"

export default class Player extends Character {
  constructor(x, y, opts = {}) {
    super(x, y, { sprite: "anim_senor_idle", animationSpeed: 0.01, ...opts })

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

  onCollision(entity) {
    if (this.pickupIntent && !this.holding && entity.is("draggable")) {
      this.holding = entity
      entity.heldBy = this
    }
  }
}
