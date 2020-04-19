import Entity from "./Entity"
import Crash from "crash-colliders"
import * as PIXI from 'pixi.js'

const DEBUG = false

export default class Collider extends Entity {
  constructor(x, y, opts = {}) {
    super(x, y, opts)
    const {boundingBox} = opts

    const sprite = this.sprite

    if (boundingBox)  {
      const width = boundingBox.width * this.sprite.width
      const height = boundingBox.height * this.sprite.height

      this.colliderOffset = {x: -width * sprite.anchor.x, y: -height * sprite.anchor.y}
      this.collider = new Collider.crash.Box(new Collider.crash.Vector(x + this.colliderOffset.x,y + this.colliderOffset.y), width, height, true, { entity: this})
    } else {
      this.collider = new Collider.crash.Polygon(
        new Collider.crash.V(sprite.x, sprite.y),
        Collider.getSpriteCornersPoints(sprite),
        true,
        { entity: this }
      )
      this.colliderOffset = {x: 0, y: 0}
    }

    if (DEBUG) this.startDebug()
  }

  setPosition(x, y) {
    super.setPosition(x, y)
    this.collider.pos.x = this.pos.x + this.colliderOffset.x
    this.collider.pos.y = this.pos.y + this.colliderOffset.y
    Collider.crash.moved(this.collider)
    Collider.crash.updateAABBPolygon(this.collider)
  }

  update(dt) {
    super.update(dt)
    if (DEBUG) this.updateDebug()
  }

  destroy() {
    this.collider.remove()
    super.destroy()
  }

  onCollision(entity, data) { }

  startDebug() {
    const rect = new PIXI.Graphics()
    rect.beginFill(0xffffff, 0.5)
    rect.drawPolygon(this.collider.sat.calcPoints.map(p => new PIXI.Point(p.x, p.y)))
    rect.endFill()
    rect.x = this.collider.sat.pos.x
    rect.y = this.collider.sat.pos.y
    rect.zIndex = 1000000

    this.debugRectangle = rect
    this.addToWorld(rect)
  }

  updateDebug() {
    this.debugRectangle.x = this.collider.sat.pos.x
    this.debugRectangle.y = this.collider.sat.pos.y
    this.debugRectangle.rotation = this.sprite.rotation
  }

  isObstacle() {
    return false
  }

  static crash = new Crash()

  static check() {
    Collider.crash.check()
  }

  static init() {
    Collider.crash.onCollision((a, b, data) => {
      a.data.entity.onCollision(b.data.entity, data)
      b.data.entity.onCollision(a.data.entity, data)
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
