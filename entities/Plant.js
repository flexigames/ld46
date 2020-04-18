import Collider from "./Collider"
import play from "../lib/audio"
import Draggable from "./Draggable"

export default class Plant extends Draggable {
  constructor(x, y, opts = {}) {
    super(x, y, { sprite: "carnivorous_plant", ...opts })

    this.health = 100
  }

  update(dt) {
    super.update(dt)
    this.health -= 0.1
  }

  onCollision(entity) {
    if (entity.is("draggable") && !entity.heldBy) {
      this.health += 20
      play("snack")
      entity.destroy()
    }
  }
}
