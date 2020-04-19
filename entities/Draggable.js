import Obstacle from "./Obstacle"

export default class Draggable extends Obstacle {
  constructor(x, y, opts = {}) {
    super(x, y, {
      boundingBox: {
        height: 0.3,
        width: 1,
      },
      ...opts,
    })
    this.addTag('draggable')
  }
}
