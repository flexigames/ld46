import Collider from "./Collider"

export default class Draggable extends Collider {
  constructor(x, y, opts = {}) {
    super(x, y, { tags: ["draggable"], ...opts })
  }
}
