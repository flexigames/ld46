import Collider from "./Collider"
import V from "../lib/vec2"
import play from "../lib/audio"

export default class Character extends Collider {
  constructor(x, y, opts = {}) {
    const { walkSprite, idleSprite } = opts
    super(x, y, { sprite: idleSprite, ...opts })

    const { holdingSpeed = 2, walkingSpeed = 4 } = opts

    this.walkSprite = walkSprite
    this.idleSprite = idleSprite

    this.speed = walkingSpeed
    this.holdingSpeed = holdingSpeed
    this.walkingSpeed = walkingSpeed
    this.direction = V(0, 0)
  }

  update(dt) {
    super.update(dt)
    this.setPosition(this.pos.add(this.direction.multiply(this.speed * dt)))
    if (this.holding) {
      this.holding.setPosition(this.pos.x, this.pos.y - 12)
      this.holding.sprite.zIndex = this.pos.y + 1
      this.holding.sprite.scale.x = this.sprite.scale.x
    }
  }

  onCollision(entity, data) {
    super.onCollision(entity)
    if (entity.is("obstacle")) {
      this.moveBy(V(-data.overlapV.x, -data.overlapV.y))
    }
  }

  setDirection(direction) {
    direction = direction.normalize()

    if (direction.x > 0) this.sprite.scale.x = -1
    if (direction.x < 0) this.sprite.scale.x = 1
    const isMoving = direction.x !== 0 || direction.y !== 0
    const wasMoving = this.direction.x !== 0 || this.direction.y !== 0
    if (wasMoving !== isMoving) this.onMoveChange(isMoving)
    this.direction = direction
  }

  drop() {
    if (this.holding) {
      this.holding.setPosition(this.pos.x, this.pos.y + 12)
      this.holding.heldBy = null
      this.holding = null
      this.setSpeed(this.walkingSpeed)
    }
  }

  pickup(entity) {
    this.holding = entity
    entity.heldBy = this
    this.setSpeed(this.holdingSpeed)
  }

  setSpeed(speed) {
    this.speed = speed
    if (this.isMoving) this.sprite.animationSpeed = this.speed / 25
  }

  onMoveChange(isMoving) {
    this.isMoving = isMoving
    this.changeTexture(isMoving ? this.walkSprite : this.idleSprite)
    this.sprite.animationSpeed = isMoving ? this.speed / 25 : 0.01
  }
}
