import { Viewport } from "pixi-viewport"

export default class Camera {
  constructor(stage) {
    this.viewport = new Viewport()

    this.viewport.sortableChildren = true

    stage.addChild(this.viewport)
  }

  update() {
    if (this.following) {
      this.viewport.x = -this.following.pos.x + 256
      this.viewport.y = -this.following.pos.y + 256
    }
  }

  follow(entity) {
    this.following = entity
  }

  unfollow() {
    this.following = false
  }

  getStage() {
    return this.viewport
  }
}
