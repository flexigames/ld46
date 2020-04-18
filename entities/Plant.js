import Collider from "./Collider"

export default class Plant extends Collider {
  constructor(x, y, opts = {}) {
    super(x, y, { sprite: "carnivorous_plant", ...opts })
  }
}
