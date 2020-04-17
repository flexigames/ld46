import * as PIXI from "pixi.js"
import { mapKeys } from "lodash"

start()

function start() {
  const app = createApp()
  app.loader.add("spritesheet.json").load(setup)

  function setup(loader, resources) {
    const textures = mapKeys(
      resources["spritesheet.json"].textures,
      (_, fileName) => fileName.split(".")[0]
    )
    const sprite = new PIXI.Sprite(textures.heart_full)
    app.stage.addChild(sprite)
    app.ticker.add(gameLoop)
  }
}

function gameLoop(dt) {}

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
