import V from "./vec2"

const keysDown = {}

export function init(player, opts = {}) {
  const { onPause = () => { }, onEnter = () => { } } = opts
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !keysDown["Space"]) {
      player.attack()
    }
    if (e.code === "KeyF" && !keysDown["KeyF"]) {
      player.setPickupIntent(true)
    }
    if (e.code === "KeyP" && !keysDown["KeyP"]) {
      onPause()
    }
    if (e.code === "Enter" && !keysDown["Enter"]) {
      onEnter()
    }
    keysDown[e.code] = true
  })

  document.addEventListener("keyup", (e) => {
    keysDown[e.code] = false
    if (e.code === "KeyF") {
      player.setPickupIntent(false)
    }
  })
}

export function getDirection() {
  let horizontal = 0
  let vertical = 0
  if (keysDown["ArrowLeft"] || keysDown["KeyA"]) {
    horizontal -= 1
  }
  if (keysDown["ArrowRight"] || keysDown["KeyD"]) {
    horizontal += 1
  }
  if (keysDown["ArrowUp"] || keysDown["KeyW"]) {
    vertical -= 1
  }
  if (keysDown["ArrowDown"] || keysDown["KeyS"]) {
    vertical += 1
  }

  return horizontal === 0 && vertical === 0
    ? V(0, 0)
    : V(horizontal, vertical).normalize()
}
