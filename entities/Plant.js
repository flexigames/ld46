import Collider from "./Collider"
import play from "../lib/audio"
import Draggable from "./Draggable"
import * as PIXI from "pixi.js"

import { sample } from "lodash"

const snacks = [
  {
    tag: "rat",
    sprite: "anim_rat_01",
  },
  {
    tag: "cat",
    sprite: "cat",
  },
  {
    tag: "pie",
    sprite: "pie",
  },
]

export default class Plant extends Draggable {
  constructor(x, y, opts = {}) {
    super(x, y, {
      sprite: "anim_carnivorous_plant_idle",
      animationSpeed: 0.04,
      ...opts,
    })

    this.addTag("plant")

    this.wants = sample(snacks)

    this.createBubble()

    this.maxHealth = 100
    this.health = 100
  }

  createBubble() {
    this.thoughtBubble = new PIXI.Container()
    this.sprite.addChild(this.thoughtBubble)

    const bubble = new PIXI.Graphics()
    bubble.beginFill(0xffffff)
    bubble.drawRoundedRect(-28, -123, 56, 56, 10)
    bubble.endFill()
    this.thoughtBubble.addChild(bubble)
    this.wantsSprite = Plant.createSprite(0, -95, this.wants.sprite, 0, [
      0.5,
      0.5,
    ])

    const mask = bubble.clone()

    this.wantsSprite.mask = mask
    this.thoughtBubble.addChild(mask)

    this.thoughtBubble.addChild(this.wantsSprite)
  }

  update(dt) {
    super.update(dt)
    this.health = Math.max(0, this.health - 0.02)
    this.thoughtBubble.y = Math.round(Math.sin(Date.now() / 350) * 2) * 2
  }

  setWants(wants) {
    this.wants = wants
    this.wantsSprite.texture = Plant.textures[wants.sprite]
  }

  onCollision(entity, data) {
    super.onCollision(entity, data)
    if (entity.is("draggable") && !entity.heldBy) {
      this.health = Math.min(this.maxHealth, this.health + 20)
      play("snack")
      entity.destroy()
      if (entity.is(this.wants.tag)) {
        this.setWants(sample(snacks))
      }
    }
  }
}
