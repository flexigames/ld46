import * as PIXI from "pixi.js"
import { mapKeys, groupBy, mapValues } from "lodash"
import Entity from "./entities/Entity"
import Collider from "./entities/Collider"
import Cat from "./entities/Cat"
import Player from "./entities/Player"
import Plant from "./entities/Plant"
import * as input from "./lib/input"
import { times, random } from "lodash"

start()

function start() {
  const app = createApp()
  app.loader.add("spritesheet.json").load(setup)

  function setup(loader, resources) {
    const textures = parseTextures(resources["spritesheet.json"].textures)

    app.stage.sortableChildren = true
    Entity.init(app.stage, textures)
    Collider.init()

    const player = new Player(100, 100)
    new Plant(200, 200)
    times(10).forEach(() => new Cat(random(0, 400), random(0, 400)))

    input.init(player)
    app.ticker.add(gameLoop)

    function gameLoop(dt) {
      // console.log(Entity.children)
      Entity.updateAll(dt)
      Collider.check()
      player.setDirection(input.getDirection())
    }
  }
}

function createApp() {
  const app = new PIXI.Application({
    width: 512,
    height: 512,
    backgroundColor: 0x5c8636,
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
