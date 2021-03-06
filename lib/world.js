import { times, random } from "lodash"
import Obstacle from "../entities/Obstacle"
import Entity from "../entities/Entity"
import Possession from "../entities/Possession"
import * as PIXI from "pixi.js"
import Enemy from "../entities/Enemy"
import Rat from "../entities/Rat"
import { sample, shuffle } from "lodash"

const tileSize = 500
const DEBUG = false

export default function createWorld(width, height) {
  const world = times(width).map((x) =>
    times(height).map((y) => {
      if (y % 2 === 1 && x % 2 !== 1) return true
      if (x % 2 === 1 && y % 2 !== 1) return true
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

  const items = shuffle([
    'pie',
    'pie',
    'pie',
    'pie',
    'pie',
    'cat',
    'cat',
    'cat'
  ])

  iterate(world, (x, y, isStreet) => {
    if (isStreet) {
      createStreet(x, y)
    } else if (
      x === Math.floor(width / 2) - 1 &&
      y === Math.floor(height / 2) - 1
    ) {
      createPark(x, y)
    } else {
      createHouse(x, y, items.pop())
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

  if (texture === "street-horizontal") {
    new Rat(basePosX + 100, basePosY)
  }

  const street = new Entity(
    basePosX + 260,
    basePosY + (texture === "street-vertical" ? 446 : 330),
    {
      sprite: texture,
    }
  )

  street.sprite.zIndex = 0
}

function createPark(tileX, tileY) {
  const basePosX = tileX * tileSize
  const basePosY = tileY * tileSize

  const park = new Entity(basePosX + 260, basePosY + 400, {
    sprite: "park",
  })

  new Obstacle(basePosX + 70, basePosY + 40, {
    sprite: "tree2",
    boundingBox: { width: 0.2, height: 0.06 },
  })

  new Obstacle(basePosX + 400, basePosY + 40, {
    sprite: "tree2",
    boundingBox: { width: 0.2, height: 0.06 },
  })

  new Obstacle(basePosX + 70, basePosY + 400, {
    sprite: "tree2",
    boundingBox: { width: 0.2, height: 0.06 },
  })

  new Obstacle(basePosX + 400, basePosY + 400, {
    sprite: "tree2",
    boundingBox: { width: 0.2, height: 0.06 },
  })

  new Obstacle(basePosX + 80, basePosY + 65, {
    sprite: "park-bench",
    boundingBox: {
      width: 1,
      height: 0.5,
    },
  })

  park.sprite.zIndex = 0
}

function createHouse(tileX, tileY, item) {
  const basePosX = tileX * tileSize
  const basePosY = tileY * tileSize

  const grass = new Entity(basePosX + 250, basePosY + 400, {
    sprite: "grass",
  })
  grass.sprite.zIndex = 0

  new Obstacle(basePosX + 250, basePosY + 259, {
    sprite: sample(["house", "house02"]),
    boundingBox: { width: 1, height: 0.8 },
  })

  if (Math.random() > 0.5) createFence(basePosX, basePosY)

  if (Math.random() > 0.2) {
    const tree = new Obstacle(basePosX + random(100, 200), basePosY + 350, {
      sprite: Math.random() > 0.8 ? "tree" : "tree2",
      boundingBox: { width: 0.2, height: 0.06 },
    })
    tree.sprite.alpha = 0.5
  }

  new Obstacle(basePosX + 300, basePosY + 420, {
    sprite: "mailbox",
    boundingBox: { width: 1, height: 0.2 },
  })

  const possession = createRandomPossession(basePosX, basePosY, item)

  const enemy = new Enemy(basePosX + 200, basePosY + 200, { possession })
}

function createFence(basePosX, basePosY) {
  times(4).forEach(
    (i) =>
      new Obstacle(basePosX + 54 + i * 48, basePosY + 400, {
        sprite: "fence",
        boundingBox: {
          width: 1,
          height: 0.2,
        },
      })
  )

  times(4).forEach(
    (i) =>
      new Obstacle(basePosX + 62 + i * 48 + 48 * 5, basePosY + 400, {
        sprite: "fence",
        boundingBox: {
          width: 1,
          height: 0.2,
        },
      })
  )
}

function createRandomPossession(basePosX, basePosY, item) {
  if (item === 'pie') {
    return new Possession(basePosX + 392, basePosY + 269, {
      sprite: "pie",
      z: 30,
    })
  }

  return new Possession(
    basePosX + random(100, 380),
    basePosY + random(300, 490),
    { sprite: "cat" }
  )
}

function iterate(array, fn) {
  return array.map((col, y) => col.map((data, x) => fn(x, y, data)))
}
