import Collider from "./Collider"

export default class Obstacle extends Collider {
    constructor(x, y, opts = {}) {
        super(x, y, { tags: ["obstacle"], ...opts })
        this.obstacleEnabled = true
    }
}