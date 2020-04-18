import Draggable from "./Draggable"

export default class Cat extends Draggable {
  constructor(x, y, opts = {}) {
    super(x, y, { sprite: "cat" })
  }
}
