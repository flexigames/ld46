import { Viewport } from "pixi-viewport"

export default class Camera {
  constructor(stage) {
    this.viewport = new Viewport()

    this.viewport.sortableChildren = true

    stage.addChild(this.viewport)
  }

  update() {
    if (this.following) {
      this.viewport.x = Math.min(0, -this.following.pos.x + 256)
      this.viewport.y = Math.min(0, -this.following.pos.y + 256)
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
