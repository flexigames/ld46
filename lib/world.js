import { times, random } from "lodash"
import Obstacle from "../entities/Obstacle"
import Entity from "../entities/Entity"
import Cat from "../entities/Cat"
import * as PIXI from "pixi.js"
import Enemy from "../entities/Enemy"

const tileSize = 500
const DEBUG = false

export default function createWorld(width, height) {
  const world = times(width).map((x) =>
    times(height).map((y) => {
      if (y % 2 === 1 && x % 2 !== 1) return Math.random() > 0.1
      if (x % 2 === 1 && y % 2 !== 1) return Math.random() > 0.1
      return y % 2 == 1 || x % 2 == 1
    })
  )

  if (DEBUG) {
    var graphics = new PIXI.Graphics()
    iterate(world, (x, y, isStreet) => {
      const rect = new PIXI.Graphics()
      rect.beginFill(isStreet ? 0x000000 : 0xffffff)
      rect.lineStyle(2, 0xff0000)
      rect.drawRect(x * tileSize, y * tileSize, tileSize, tileSize)
      Entity.world.addChild(rect)
    })
  }

  iterate(world, (x, y, isStreet) => {
    if (isStreet) {
      // TODO
    } else {
      createHouse(x, y)
    }
  })
}

function createHouse(tileX, tileY) {
  const basePosX = tileX * tileSize
  const basePosY = tileY * tileSize

  const house = new Obstacle(basePosX + 240, basePosY + 240, {
    sprite: "house",
    boundingBox: { width: 1, height: 0.8 },
  })

  times(9).forEach(
    (i) =>
      new Obstacle(basePosX + 24 + i * 48, basePosY + 400, {
        sprite: "fence",
        boundingBox: {
          width: 1,
          height: 0.2,
        },
      })
  )

  new Obstacle(basePosX + random(100, 380), basePosY + 350, {
    sprite: Math.random() > 0.8 ? "tree" : "tree2",
    boundingBox: { width: 0.2, height: 0.06 },
  })

  new Obstacle(basePosX + 200, basePosY + 320, {
    sprite: "mailbox",
    boundingBox: { width: 1, height: 0.2 },
  })

  new Cat(basePosX + random(100, 380), basePosY + random(300, 490))

  new Enemy(basePosX + 200, basePosY + 200)
}

function iterate(array, fn) {
  return array.map((col, y) => col.map((data, x) => fn(x, y, data)))
}
