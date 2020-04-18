import Character from "./Character"

export default class Player extends Character {
  constructor(x, y, opts = {}) {
    super(x, y, { sprite: "hooded_teenager", ...opts })
  }
}
