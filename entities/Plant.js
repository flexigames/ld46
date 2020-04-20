import Collider from "./Collider"
import play from "../lib/audio"
import Draggable from "./Draggable"
import * as PIXI from "pixi.js"
import createText from '../lib/text'

import { sample } from "lodash"

const snacks = [
  {
    tag: "pie",
    sprite: "pie",
  },
  {
    tag: "rat",
    sprite: "anim_rat_01",
  },
  {
    tag: "cat",
    sprite: "cat",
  }
]

export default class Plant extends Draggable {
  constructor(x, y, opts = {}) {
    super(x, y, {
      sprite: "anim_plant_small",
      animationSpeed: 0.04,
      ...opts,
    })

    this.addTag("plant")

    this.wants = null

    this.maxHealth = 100
    this.health = 100


    this.snackIndex = 0

    this.thinking = false

    this.healthReduction = 0.02
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
    this.health = Math.max(0, this.health - this.healthReduction)
    if (this.health <= 0) this.onDeath('plantdead')
    if (this.thinking) this.bubbleInner.y = Math.round(Math.sin(Date.now() / 350) * 2) * 2
  }

  setWants(wants) {
    wants = snacks[wants]

    this.thinking = true
    this.removeBubble()
    this.wants = wants

    const item = Plant.createSprite(0, 0, wants.sprite, 0, [
      0,
      0.5,
    ])
    item.y = 30


    const bubble = this.createBubbleBackground(item.width)
    const mask = this.bubbleGraphic.clone()
    item.mask = mask
    bubble.addChild(mask)
    bubble.addChild(item)
  }

  onCollision(entity, data) {
    super.onCollision(entity, data)
    if (entity.is('enemy')) {
      this.onDeath('neighborplant')
    }
    if (entity.is("draggable") && !entity.heldBy && entity.is(this.wants.tag)) {
      this.health = this.maxHealth
      play("snack")
      entity.destroy()
      this.snackIndex += 1

      if (this.snackIndex === 1) {
        this.changeTexture('anim_carnivorous_plant_idle')
      } else if (this.snackIndex === 2) {
        this.changeTexture('anim_big_plant')
      }

      this.setWants(Math.min(this.snackIndex, snacks.length - 1))
    }
  }
}
