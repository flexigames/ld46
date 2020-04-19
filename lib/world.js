import { times, random } from "lodash"
import Obstacle from "../entities/Obstacle"
import Entity from "../entities/Entity"
import Possession from "../entities/Possession"
import * as PIXI from "pixi.js"
import Enemy from "../entities/Enemy"
import { sample } from "lodash"

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
      createStreet(x, y)
    } else {
      createHouse(x, y)
    }
  })
}

function createStreet(tileX, tileY) {
  const basePosX = tileX * tileSize
  const basePosY = tileY * tileSize

  const texture =
    tileY % 2 === 0
      ? "street-vertical"
      : tileX % 2 === 1
      ? "street-crossing"
      : "street-horizontal"

  const street = new Entity(
    basePosX + 260,
    basePosY + (texture === "street-vertical" ? 446 : 330),
    {
      sprite: texture,
    }
  )

  street.sprite.zIndex = 0
}

function createHouse(tileX, tileY) {
  const basePosX = tileX * tileSize
  const basePosY = tileY * tileSize

  new Obstacle(basePosX + 240, basePosY + 240, {
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

  const tree = new Obstacle(basePosX + random(100, 380), basePosY + 350, {
    sprite: Math.random() > 0.8 ? "tree" : "tree2",
    boundingBox: { width: 0.2, height: 0.06 },
  })
  tree.sprite.alpha = 0.5

  new Obstacle(basePosX + 200, basePosY + 320, {
    sprite: "mailbox",
    boundingBox: { width: 1, height: 0.2 },
  })

  const possession = new Possession(
    basePosX + random(100, 380),
    basePosY + random(300, 490),
    { sprite: sample(["cat", "pie"]) }
  )

  const enemy = new Enemy(basePosX + 200, basePosY + 200, { possession })
  // enemy.pickup(pet)
}

function iterate(array, fn) {
  return array.map((col, y) => col.map((data, x) => fn(x, y, data)))
}
