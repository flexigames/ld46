import Collider from "./Collider";

export default class Obstacle extends Collider {
    constructor(x, y, opts = {}) {
        // todo: make it possible to just do     tags = ['obstacle']
        super(x, y, { tags: ["obstacle"], ...opts })
    }
}