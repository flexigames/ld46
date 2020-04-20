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
import GameOver from "./lib/gameover"
import Intro from "./lib/Intro"
import { playBackground } from "./lib/audio"

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

    playBackground()

    app.stage.sortableChildren = true

    let player
    let plant
    let hud
    let camera
    let gameover
    let paused = false

    function setPause(p) {
      paused = p
    }

    Collider.init()

    function startGame() {
      camera = new Camera(app.stage)
      
      
      Entity.init(camera.getStage(), textures)
      
      player = new Player(5 * 500 - 150, 5 * 500 + 300)
      plant = new Plant(5 * 500, 5 * 500 + 300)
      
      player.onDeath = onGameOver
      plant.onDeath = onGameOver
      
      createWorld(10, 10)
      
      hud = new HUD(app.stage, textures, { plant })
      gameover = new GameOver(app.stage, restartGame)

      // new Intro({camera, player, plant, setPause})
      
      function onGameOver(reason) {
        gameover.set(reason)
      }
  
    
      camera.follow(player)
      input.init(player, gameover)
    }
    function restartGame() {
      clearGame()
      startGame()
    }

    function clearGame () {
      app.stage.removeChildren()
      Entity.clear()
      Collider.clear()
    }

    startGame()

    app.ticker.add(gameLoop)

    function gameLoop(dt) {
      if (!paused) {
        Entity.updateAll(dt)
        Collider.check()
        player.setDirection(input.getDirection())
      }
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
