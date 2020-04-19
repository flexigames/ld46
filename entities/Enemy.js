import Character from "./Character";
import V from '../lib/vec2'

export default class Enemy extends Character {
    constructor(x, y, opts = {}) {
        super(x, y, {
            sprite: "anim_senor_idle",
            speed: 2,
            animationSpeed: 0.01,
            boundingBox: {
                x: 0,
                y: 0,
                width: 0.9,
                height: 0.2
            },
            tags: ['enemy'],
            ...opts
        })
        this.player = Character.findOne('player')
        this.detectionRange = 220
        this.cooldownRange = 270
        this.following = false

        setInterval(() => {
            this.sprite.scale.x = -this.sprite.scale.x
        }, 3000)
    }

    update(dt) {
        super.update(dt)
        this.followPlayerInRange()
    }

    followPlayerInRange() {
      if (
        (this.player.holding && this.detectsPlayer()) ||
        (this.following && this.pos.distance(this.player.pos) < this.cooldownRange)
      ) {
          this.following = true
          const direction = this.player.pos.subtract(this.pos)
          this.setDirection(direction)
      } else {
          this.following = false
          this.setDirection(V(0, 0))
      }
    }

    detectsPlayer() {
        const directionMatches = this.sprite.scale.x > 0 ? this.player.pos.x - this.pos.x < 0 : this.player.pos.x - this.pos.x > 0
        return directionMatches && this.pos.distance(this.player.pos) < this.detectionRange
    }
}