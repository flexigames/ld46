import Collider from "./Collider"

export default class Plant extends Collider {
  constructor(x, y, opts = {}) {
    super(x, y, { sprite: "carnivorous_plant", ...opts })

    this.health = 100
  }

  update(dt) {
    super.update(dt)
    this.health -= 0.1
    this.setPosition(this.pos.x, this.health)
  }

  onCollision(entity) {
    if (entity.is("draggable") && !entity.heldBy) {
      this.health += 20
      entity.destroy()
    }
  }
}
