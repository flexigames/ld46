import * as PIXI from "pixi.js"
import { mapKeys, groupBy, mapValues } from "lodash"
import Entity from "./entities/Entity"
import Collider from "./entities/Collider"

start()

function start() {
  const app = createApp()
  app.loader.add("spritesheet.json").load(setup)

  function setup(loader, resources) {
    const textures = parseTextures(resources["spritesheet.json"].textures)

    Entity.init(app.stage, textures)
    Collider.init()

    const testEntity = new Collider(0, 0, { sprite: "anim_heart_empty" })
    const i = setInterval(() => testEntity.moveBy(1, 1), 20)
    testEntity.onCollision = () => clearInterval(i)
    new Collider(100, 100, { sprite: "anim_heart_empty" })


    app.ticker.add(gameLoop)

    function gameLoop(dt) {
      Entity.updateAll(dt)
      Collider.check()
    }
  }
}

function createApp() {
  const app = new PIXI.Application({
    width: 512,
    height: 512,
    backgroundColor: 0x150a21,
    antialias: false,
  })

  document.body.appendChild(app.view)

  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

  return app
}

function parseTextures(rawTextures) {
  const textures = mapKeys(
    rawTextures,
    (_, fileName) => fileName.split(".")[0]
  )

  const animations = mapValues(groupBy(
    Object.entries(textures)
      .filter(([key, value]) => key.startsWith('anim_')),
    ([key, value]) => key.substr(0, key.lastIndexOf('_'))
  ), frames => frames.map(value => value[1]))

  return {
    ...textures,
    ...animations
  }
}