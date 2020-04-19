import Character from "./Character";
import V from '../lib/vec2'
import * as PIXI from 'pixi.js'

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
        this.knowsPlayer = false

        this.createSightLine()


        setInterval(() => {
            this.sprite.scale.x = -this.sprite.scale.x
        }, 3000)
    }

    createSightLine() {
        const line = new PIXI.Graphics()
        this.sightLine = line
        this.sightLine.zIndex = 90000
        this.sightLine.alpha = 0.2
        Enemy.world.addChild(line)
    }

    update(dt) {
        super.update(dt)
        this.followPlayerInRange()
    }

    followPlayerInRange() {
        if (this.following || this.detectsPlayer()) {
            const start = V(this.pos.x, this.pos.y - 50)
            const target = V(this.player.pos.x, this.player.pos.y - 50)
            const offset = target.sub(start).normalize().multiply(20)
            const sightStart = start.add(offset)
            this.sightLine.visible = true
            this.sightLine.clear()
            this.sightLine.moveTo(sightStart.x, sightStart.y)
            this.sightLine.lineStyle(20, 0x000000)
            const sightEnd = target.sub(offset)
            this.sightLine.lineTo(sightEnd.x, sightEnd.y)
        } else {
            this.sightLine.visible = false
        }

        const wouldFollow = this.knowsPlayer || this.player.holding

        if (
            (wouldFollow && this.detectsPlayer()) ||
            (this.following && this.pos.distance(this.player.pos) < this.cooldownRange)
        ) {
            this.following = true
            this.knowsPlayer = true
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