import Draggable from "./Draggable"
import V from "../lib/vec2"

export default class Possession extends Draggable {
  constructor(x, y, opts = {}) {
    const {sprite} = opts
    super(x, y, opts)

    this.addTag(sprite)
    this.startPos = V(x, y)
  }

  inStartPosition() {
    return this.pos.equals(this.startPos)
  }
}
