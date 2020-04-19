import Character from "./Character"
import play from "../lib/audio"

export default class Player extends Character {
  constructor(x, y, opts = {}) {
    super(x, y, {
      sprite: "anim_senor_idle",
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
      this.onDrop(this.holding)
    }
  }

  onPickup(entity) {
    this.holding = entity
    play("cat-hiss")
    entity.heldBy = this
    this.setSpeed(2)
  }

  onDrop(entity) {
    this.holding.setPosition(this.pos.x, this.pos.y + 12)
    this.holding.heldBy = null
    this.holding = null
    this.setSpeed(4)
  }

  onCollision(entity, data) {
    super.onCollision(entity, data)
    if (this.pickupIntent && !this.holding && entity.is("draggable")) {
      this.onPickup(entity)
    } else if (entity.is('enemy')) {
      // this.destroy()
      // TODO: Restart and Game Over
    }
  }

  setSpeed(speed) {
    this.speed = speed
    if (this.isMoving) this.sprite.animationSpeed = this.speed / 25
  }

  onMoveChange(isMoving) {
    this.isMoving = isMoving
    this.changeTexture(isMoving ? 'anim_senor_run' : 'anim_senor_idle')
    this.sprite.animationSpeed = isMoving ? this.speed / 25 : 0.01
  }
}
