import Draggable from "./Draggable"
import V from "../lib/vec2"

export default class Possession extends Draggable {
  constructor(x, y, opts = {}) {
    super(x, y, opts)

    this.addTag("cat")
    this.startPos = V(x, y)
  }

  inStartPosition() {
    return this.pos.equals(this.startPos)
  }
}
