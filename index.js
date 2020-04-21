import * as PIXI from "pixi.js"
import { mapKeys, groupBy, mapValues } from "lodash"
import Entity from "./entities/Entity"
import Collider from "./entities/Collider"
import Player from "./entities/Player"
import Plant from "./entities/Plant"
import Input from "./lib/input"
import Camera from "./lib/camera"
import createWorld from "./lib/world"
import HUD from "./lib/hud"
import WebFont from "webfontloader"
import GameOver from "./lib/gameover"
import Intro from "./lib/Intro"
import { playBackground } from "./lib/audio"
import Outro from "./lib/Outro"

WebFont.load({
  custom: {
    families: ["Silkscreen"],
    urls: ["/assets/fonts/fonts.css"],
  },
  active: start,
})

function start() {
  const app = createApp()
  app.loader.add("spritesheet.json").load(setup)

  function setup(loader, resources) {
    const textures = parseTextures(resources["spritesheet.json"].textures)

    playBackground()

    app.stage.sortableChildren = true

    let player
    let plant
    let hud
    let camera
    let gameover
    let paused = true
    let intro
    let input
    let outro

    function setPause(p) {
      paused = p
    }

    Collider.init()

    const titleScreen = new PIXI.AnimatedSprite(textures['anim_title-screen'])
    titleScreen.width = 512
    titleScreen.height = 512
    app.stage.addChild(titleScreen)
    Input.onAnyKeyOnce(() => {
      startGame()
      app.ticker.add(gameLoop)
      titleScreen.visible = false
    })

    function startGame() {
      camera = new Camera(app.stage)
      
      Entity.init(camera.getStage(), textures)
      
      player = new Player(2 * 500 + 200, 2 * 500 + 130)
      plant = new Plant(2 * 500 + 350, 2 * 500 + 130)
      
      player.onDeath = onGameOver
      plant.onDeath = onGameOver
      outro = new Outro(plant, player, camera, app.stage)
      plant.onEnd = () => {
        paused = true
        outro.start()
      }
      
      createWorld(6, 6)
      
      hud = new HUD(app.stage, textures, { plant })
      gameover = new GameOver(app.stage, restartGame)
      
      if (!intro) {
        intro = new Intro({ camera, player, plant, setPause, stage: app.stage })
      } else {
        camera.follow(player)
        plant.setWants(0)
      }
      
      function onGameOver(reason) {
        gameover.set(reason)
      }
      
      input = new Input(player, gameover)
    }
    function restartGame() {
      clearGame()
      startGame()
    }

    function clearGame() {
      app.stage.removeChildren()
      Entity.clear()
      Collider.clear()
    }

    function gameLoop(dt) {
      if (!paused) {
        Entity.updateAll(dt)
        Collider.check()
        player.setDirection(input.getDirection())
      }
      camera.update(dt)
      hud.update()
      intro.update(dt)
      outro.update(dt)
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
