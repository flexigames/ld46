import { Viewport } from "pixi-viewport"
import V from "./vec2"

export default class Camera {
  constructor(stage) {
    this.viewport = new Viewport()

    this.pos = V(0, 0)

    this.viewport.sortableChildren = true

    stage.addChild(this.viewport)
  }

  update() {
    if (this.following) {
      this.setPos(this.following.pos.x, this.following.pos.y)
    }
  }

  follow(entity) {
    this.following = entity
  }

  transitionTo(entity, onEnd) {
    const newPos = this.pos.add(entity.pos.sub(this.pos).normalize())
    this.setPos(newPos.x, newPos.y)
    if (entity.pos.distance(this.pos) < 2) return onEnd()
    setTimeout(() => {
      this.transitionTo(entity, onEnd)
    }, 20)
  }

  unfollow() {
    this.following = false
  }

  getStage() {
    return this.viewport
  }

  setPos(x, y) {
    this.pos.x = x
    this.pos.y = y
    this.viewport.x = Math.max(-4.5 * 500, Math.min(0, -x + 256))
    this.viewport.y = Math.max(-4.5 * 500, Math.min(0, -y + 256))
  }
}
