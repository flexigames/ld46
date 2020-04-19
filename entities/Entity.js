import V from "../lib/vec2"
import * as PIXI from "pixi.js"
import { isArray } from "lodash"

export default class Entity {
  constructor(x, y, opts = {}) {
    const {
      tags = [],
      sprite,
      animationSpeed = 0.1,
      spriteAnchor = [0.5, 1],
    } = opts

    this.pos = V(x, y)

    this.tags = tags
    this.sprite = Entity.createSprite(
      x,
      y,
      sprite,
      animationSpeed,
      spriteAnchor
    )

    Entity.create(this)
  }

  update(dt) {}

  setPosition(x, y) {
    if (!y) {
      y = x.y
      x = x.x
    }
    this.pos.x = x
    this.pos.y = y

    if (this.sprite) {
      this.sprite.x = x
      this.sprite.y = y
      this.sprite.zIndex = y
    }
  }

  moveBy(x, y) {
    if (!y) {
      y = x.y
      x = x.x
    }
    this.setPosition(this.pos.x + x, this.pos.y + y)
  }

  destroy() {
    Entity.destroy(this)
  }

  is(tag) {
    return this.tags.includes(tag)
  }

  addToWorld(object) {
    Entity.world.addChild(object)
  }

  changeTexture(textureName, sprite) {
    sprite = sprite || this.sprite
    const texture = Entity.textures[textureName]
    if (isArray(texture)) {
      this.sprite.textures = texture
      this.sprite.play()
    } else {
      this.sprite.texture = texture
    }
  }

  addTag (tag) {
    this.tags.push(tag)
  }

  static children = []

  static world

  static textures

  static init(world, textures) {
    Entity.world = world
    Entity.textures = textures
  }

  static create(entity) {
    Entity.children.push(entity)

    Entity.world.addChild(entity.sprite)
  }

  static destroy(entity) {
    const entityPos = Entity.children.indexOf(entity)
    if (entityPos === -1) return
    Entity.children.splice(entityPos, 1)

    Entity.world.removeChild(entity.sprite)
  }

  static updateAll(dt) {
    Entity.children.forEach((it) => it.update(dt))
  }

  static createSprite(x, y, textureName, animationSpeed = 0, spriteAnchor = [0.5, 1]) {
    let sprite
    const texture = Entity.textures[textureName]
    if (isArray(texture)) {
      sprite = new PIXI.AnimatedSprite(texture)
      sprite.play()
      sprite.animationSpeed = animationSpeed
    } else {
      sprite = new PIXI.Sprite(texture)
    }

    sprite.x = x
    sprite.y = y
    sprite.zIndex = y

    sprite.anchor.set(spriteAnchor[0], spriteAnchor[1])

    return sprite
  }

  static find(tag) {
    if (!isArray(tag)) tag = [tag]
    return Entity.children.filter((entity) =>
      entity.tags.some((it) => tag.includes(it))
    )
  }
  static findOne(tag) {
    return Entity.find(tag)?.[0]
  }
}
