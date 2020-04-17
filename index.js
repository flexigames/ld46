import * as PIXI from "pixi.js"
import { mapKeys } from "lodash"
import Entity from "./entities/Entity"

start()

function start() {
  const app = createApp()
  app.loader.add("spritesheet.json").load(setup)

  function setup(loader, resources) {
    const textures = mapKeys(
      resources["spritesheet.json"].textures,
      (_, fileName) => fileName.split(".")[0]
    )

    Entity.init(app.stage, textures)

    new Entity(0, 0, {sprite: "heart_full"})
    new Entity(100, 100, {sprite: "heart_full"})

    app.ticker.add(gameLoop)

    function gameLoop(dt) {
      Entity.updateAll(dt)
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
