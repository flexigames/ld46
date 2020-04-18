import * as PIXI from "pixi.js"

export default class HUD {
  constructor(stage, textures, { plant }) {
    this.plant = plant

    this.stage = stage

    this.textures = textures

    this.healthBarWidth = 400

    this.createBar()
  }

  createBar() {
    const width = this.healthBarWidth
    const pos = { x: 46, y: 430 }

    const barStart = new PIXI.Sprite(this.textures["health-bar-start"])
    barStart.x = pos.x
    barStart.y = pos.y
    this.stage.addChild(barStart)

    const barEmptyMiddle = new PIXI.Sprite(
      this.textures["health-bar-middle-empty"]
    )
    barEmptyMiddle.x = pos.x + 9
    barEmptyMiddle.y = pos.y
    barEmptyMiddle.width = width - 18
    this.stage.addChild(barEmptyMiddle)

    const barFullMiddle = new PIXI.Sprite(
      this.textures["health-bar-middle-full"]
    )
    barFullMiddle.x = pos.x + 9
    barFullMiddle.y = pos.y
    barFullMiddle.width = 0
    this.plantHealthBar = barFullMiddle
    this.stage.addChild(barFullMiddle)

    const barEnd = new PIXI.Sprite(this.textures["health-bar-end"])
    barEnd.x = pos.x + width - 9
    barEnd.y = pos.y
    this.stage.addChild(barEnd)
  }

  update() {
    this.plantHealthBar.width =
      (this.plant.health / this.plant.maxHealth) * (this.healthBarWidth - 18)
  }
}

