import V from "./vec2"

export default class Input {
  constructor(player, gameover) {
    this.keysDown = {}

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" && !this.keysDown["Space"]) {
        player.startPickup()
      }
      this.keysDown[e.code] = true
    })

    document.addEventListener("keyup", (e) => {
      this.keysDown[e.code] = false
      if (e.code === "Space") {
        player.endPickup()
      }
      if (e.code === "Enter") {
        gameover.continue()
      }
    })
  }

  getDirection() {
    let horizontal = 0
    let vertical = 0
    if (this.keysDown["ArrowLeft"] || this.keysDown["KeyA"]) {
      horizontal -= 1
    }
    if (this.keysDown["ArrowRight"] || this.keysDown["KeyD"]) {
      horizontal += 1
    }
    if (this.keysDown["ArrowUp"] || this.keysDown["KeyW"]) {
      vertical -= 1
    }
    if (this.keysDown["ArrowDown"] || this.keysDown["KeyS"]) {
      vertical += 1
    }

    return horizontal === 0 && vertical === 0
      ? V(0, 0)
      : V(horizontal, vertical).normalize()
  }

}

