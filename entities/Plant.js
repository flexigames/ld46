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


const texts = [
  'u kno what?',
  'im rlly hungry!',
  'get me some..',
  'hmmmm..',
  'meat pie!'
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

    this.textSpeed = 2000

    this.numberFed = 0

    this.thinking = false

    this.thoughtBubble = new PIXI.Container()

    this.playTexts(texts, () => {
      this.setWants(snacks[0])
    })
  }

  playTexts(texts, onEnd, startIndex = 0) {
    if (texts.length === 0) return onEnd()
    const [text, ...rest] = texts
    this.setText(text)
    setTimeout(() => {
      this.playTexts(rest, onEnd)
    }, this.textSpeed)
  }

  setText(text) {
    this.removeBubble()
    const container = createText(text)
    container.y = 27 - container.height/2
    const bubble = this.createBubbleBackground(container.width)
    bubble.addChild(container)
  }

  removeBubble() {
    this.thoughtBubble.removeChildren()
  }

  createBubbleBackground(width) {
    this.thoughtBubble.x = -width / 2
    this.thoughtBubble.y = -123
    this.sprite.addChild(this.thoughtBubble)

    const inner = new PIXI.Container()
    this.thoughtBubble.addChild(inner)
    this.bubbleInner = inner


    const bubble = new PIXI.Graphics()
    bubble.beginFill(0xffffff)
    bubble.drawRoundedRect(-5, 0, width + 10, 56, 10)
    bubble.endFill()
    inner.addChild(bubble)
    this.bubbleGraphic = bubble

    return inner
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
    if (this.thinking) this.bubbleInner.y = Math.round(Math.sin(Date.now() / 350) * 2) * 2
   }

   setWants(wants) {
    this.thinking = true
    this.removeBubble()
    this.wants = wants

    const item = Plant.createSprite(0, 0, wants.sprite, 0, [
      0,
      0.5,
    ])
    item.y = 30


    const bubble = this.createBubbleBackground(item.width)
    const mask = this.bubbleGraphic .clone()
    item.mask = mask
    bubble.addChild(mask)
    bubble.addChild(item)
  }

  onCollision(entity, data) {
    super.onCollision(entity, data)
    if (entity.is("draggable") && !entity.heldBy && entity.is(this.wants.tag)) {
      this.health = Math.min(this.maxHealth, this.health + 20)
      play("snack")
      entity.destroy()
      this.setWants(sample(snacks))
      this.numberFed++
      if (this.numberFed >= 2) {
        this.changeTexture('anim_carnivorous_plant_idle')
      }
    }
  }
}
