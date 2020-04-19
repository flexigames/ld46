import Draggable from "./Draggable"
import V from "../lib/vec2"

export default class Cat extends Draggable {
  constructor(x, y, opts = {}) {
    super(x, y, { sprite: "cat" })

    this.addTag('cat')
    this.startPos = V(x, y)
  }

  inStartPosition() {
    return this.pos.equals(this.startPos)
  }
}
