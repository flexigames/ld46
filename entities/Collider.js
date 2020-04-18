import Entity from "./Entity"
import Crash from "crash-colliders"

export default class Collider extends Entity {
  constructor(x, y, opts = {}) {
    super(x, y, opts)

    const sprite = this.sprite
    this.collider = new Collider.crash.Polygon(
      new Collider.crash.V(sprite.x, sprite.y),
      Collider.getSpriteCornersPoints(sprite),
      true,
      { sprite, entity: this }
    )
  }

  setPosition(x, y) {
    super.setPosition(x, y)
    this.collider.pos.x = this.sprite.x
    this.collider.pos.y = this.sprite.y
    Collider.crash.moved(this.collider)
    Collider.crash.updateAABBPolygon(this.collider)
  }

  destroy() {
    this.collider.remove()
    super.destroy()
  }

  onCollision(entity) {}

  static crash = new Crash()

  static check() {
    Collider.crash.check()
  }

  static init() {
    Collider.crash.onCollision((a, b) => {
      a.data.entity.onCollision(b.data.entity)
    })
  }

  static getSpriteCornersPoints(sprite) {
    const offset = new Collider.crash.V(
      sprite.anchor.x * sprite.width,
      sprite.anchor.y * sprite.height
    )
    return [
      new Collider.crash.V(0, 0),
      new Collider.crash.V(0, sprite.height),
      new Collider.crash.V(sprite.width, sprite.height),
      new Collider.crash.V(sprite.width, 0),
    ].map((corner) => corner.sub(offset))
  }
}
