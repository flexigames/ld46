import V from "../lib/vec2"
import * as PIXI from "pixi.js"
import {isArray} from 'lodash'

export default class Entity {
  constructor(x, y, opts = {}) {
    const { tags = [], sprite } = opts

    this.pos = V(x, y)

    this.tags = tags
    this.sprite = Entity.createSprite(x, y, sprite)

    Entity.create(this)
  }

  update(dt) {}

  destroy() {
    Entity.destroy(this)
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
    Entity.children.splice(Entity.children.indexOf(entity), 1)

    Entity.world.removeChild(entity.sprite)
  }

  static updateAll(dt) {
    Entity.children.forEach((it) => it.update(dt))
  }

  static createSprite(x, y, textureName) {
    let sprite
    const texture = Entity.textures[textureName]
    if (isArray(texture)) {
      sprite = new PIXI.AnimatedSprite(texture)
      sprite.play()
      sprite.animationSpeed = 0.1
    } else {
      sprite = new PIXI.Sprite(texture)
    }

    sprite.x = x
    sprite.y = y

    return sprite
  }

  static find(tag) {
    if (!isArray(tag)) tag = [tag]
    return Entity.children.filter((entity) =>
      entity.tags.some((it) => tag.includes(it))
    )
  }
}
