import * as PIXI from "pixi.js"
import { mapKeys, groupBy, mapValues } from "lodash"
import Entity from "./entities/Entity"
import Collider from "./entities/Collider"
import Player from "./entities/Player"
import Plant from "./entities/Plant"
import * as input from "./lib/input"
import Camera from "./lib/camera"
import createWorld from "./lib/world"
import HUD from "./lib/hud"
import WebFont from 'webfontloader'

WebFont.load({
  custom: {
    families: ['Silkscreen'],
    urls: ['/assets/fonts/fonts.css']
  },
  active: start
})

function start() {
  const app = createApp()
  app.loader.add("spritesheet.json").load(setup)

  function setup(loader, resources) {
    const textures = parseTextures(resources["spritesheet.json"].textures)

    app.stage.sortableChildren = true
    const camera = new Camera(app.stage)

    Entity.init(camera.getStage(), textures)
    Collider.init()

    const player = new Player(5 * 500 - 150, 5 * 500 + 300)
    const plant = new Plant(5 * 500, 5 * 500 + 300)

    createWorld(10, 10)

    const hud = new HUD(app.stage, textures, { plant })

    camera.follow(player)

    input.init(player)
    app.ticker.add(gameLoop)

    function gameLoop(dt) {
      Entity.updateAll(dt)
      Collider.check()
      player.setDirection(input.getDirection())
      camera.update(dt)
      hud.update()
    }
  }
}

function createApp() {
  const app = new PIXI.Application({
    width: 512,
    height: 512,
    backgroundColor: 0x49a63c,
    antialias: false,
  })

  document.body.appendChild(app.view)

  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

  return app
}

function parseTextures(rawTextures) {
  const textures = mapKeys(rawTextures, (_, fileName) => fileName.split(".")[0])

  const animations = mapValues(
    groupBy(
      Object.entries(textures).filter(([key, value]) =>
        key.startsWith("anim_")
      ),
      ([key, value]) => key.substr(0, key.lastIndexOf("_"))
    ),
    (frames) => frames.map((value) => value[1])
  )

  return {
    ...textures,
    ...animations,
  }
}
