import * as PIXI from "pixi.js"
import { mapKeys, groupBy, mapValues } from "lodash"
import Entity from "./entities/Entity"
import Collider from "./entities/Collider"
import Cat from "./entities/Cat"
import Player from "./entities/Player"
import Plant from "./entities/Plant"
import * as input from "./lib/input"
import Camera from "./lib/camera"
import { times, random } from "lodash"

start()

function start() {
  const app = createApp()
  app.loader.add("spritesheet.json").load(setup)

  function setup(loader, resources) {
    const textures = parseTextures(resources["spritesheet.json"].textures)

    app.stage.sortableChildren = true
    const camera = new Camera(app.stage)

    Entity.init(camera.getStage(), textures)
    Collider.init()

    const player = new Player(100, 100)

    camera.follow(player)

    new Plant(200, 200)
    new Entity(100, 100, { sprite: "house" })
    new Entity(100, 140, { sprite: "mailbox" })
    times(12).forEach((i) => new Entity(24 + i * 48, 300, { sprite: "fence" }))
    times(10).forEach(() => new Cat(random(0, 400), random(0, 300)))
    times(12).forEach((i) => new Entity(i * 48, 352, { sprite: "sidewalk" }))
    times(12).forEach((i) => new Entity(i * 48, 400, { sprite: "street" }))
    times(12).forEach((i) => new Entity(i * 48, 400, { sprite: "street" }))

    input.init(player)
    app.ticker.add(gameLoop)

    function gameLoop(dt) {
      // console.log(Entity.children)
      Entity.updateAll(dt)
      Collider.check()
      player.setDirection(input.getDirection())
      camera.update(dt)
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
