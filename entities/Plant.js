import Collider from "./Collider"
import play from "../lib/audio"
import Draggable from "./Draggable"

export default class Plant extends Draggable {
  constructor(x, y, opts = {}) {
    super(x, y, {
      sprite: "anim_carnivorous_plant_idle",
      animationSpeed: 0.04,
      ...opts,
    })

    this.addTag('plant')

    this.maxHealth = 100
    this.health = 100
  }

  update(dt) {
    super.update(dt)
    this.health = Math.max(0, this.health - 0.02)
  }

  onCollision(entity, data) {
    super.onCollision(entity, data)
    if (entity.is("draggable") && !entity.heldBy) {
      this.health = Math.min(this.maxHealth, this.health + 20)
      play("snack")
      entity.destroy()
    }
  }
}
