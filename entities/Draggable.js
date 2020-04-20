import Collider from "./Collider"

// TODO: Make it an obstacle again and fix the pick up

export default class Draggable extends Collider {
  constructor(x, y, opts = {}) {
    super(x, y, {
      boundingBox: {
        height: 1,
        width: 1,
      },
      ...opts,
    })
    this.addTag('draggable')
  }
}
