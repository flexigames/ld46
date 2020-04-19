import Character from "./Character";
import V from '../lib/vec2'
import * as PIXI from 'pixi.js'

export default class Enemy extends Character {
    constructor(x, y, opts = {}) {
        const { pet } = opts
        super(x, y, {
            walkSprite: "anim_grandpa",
            idleSprite: "anim_grandpa",
            walkingSpeed: 2,
            animationSpeed: 0,
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
        this.plant = Character.findOne('plant')
        this.pet = pet
        this.detectionRange = 220
        this.cooldownRange = 270
        this.following = false
        this.knowsPlayer = false

        this.flipTime = 300
        this.currentFlipTime = 0

        this.createSightLine()
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
        if (!this.following && !this.holding) this.idle(dt)
        this.followPlayerInRange()
        if (this.holding) {
            if (this.pet.startPos.distance(this.pos) < 60) {
                this.drop()
                this.pet.startPos = V(this.pet.pos.x, this.pet.pos.y)
            }
            if (!this.following) this.setDirection(this.pet.startPos.subtract(this.pos))
        }
    }

    idle(dt) {
        this.currentFlipTime += dt
        if (this.currentFlipTime > this.flipTime) {
            this.currentFlipTime = 0
            this.sprite.scale.x = -this.sprite.scale.x
        }
    }

    followPlayerInRange() {
        const detectedTarget = this.detectsTarget()

        if (this.following) {
            this.showLineSight(this.following)
        } else if (detectedTarget) {
            this.showLineSight(detectedTarget)
        } else {
            this.hideLineSight()
        }

        const wouldFollow = detectedTarget !== this.player || this.knowsPlayer || this.player.holding

        if (this.following && this.pos.distance(this.following.pos) < this.cooldownRange) {
            this.setDirection(this.following.pos.subtract(this.pos))
        } else if (wouldFollow && detectedTarget) {
            if (detectedTarget !== this.pet) this.drop()
            if (detectedTarget === this.player) {
                this.knowsPlayer = true
                this.following = this.player
            }
            this.setDirection(detectedTarget.pos.subtract(this.pos))
            this.pickupIntent = detectedTarget === this.pet
        } else {
            this.following = false
            this.setDirection(V(0, 0))
        }
    }

    drop() {
        super.drop()
        this.pickupIntent = false
    }

    showLineSight(targetEntity) {
        const start = V(this.pos.x, this.pos.y - 50)
        const target = V(targetEntity.pos.x, targetEntity.pos.y - 50)
        const offset = target.sub(start).normalize().multiply(20)
        const sightStart = start.add(offset)
        this.sightLine.visible = true
        this.sightLine.clear()
        this.sightLine.moveTo(sightStart.x, sightStart.y)
        this.sightLine.lineStyle(20, 0x000000)
        const sightEnd = target.sub(offset)
        this.sightLine.lineTo(sightEnd.x, sightEnd.y)
    }

    hideLineSight() {
        this.sightLine.visible = false
    }

    detectsEntity(entity) {
        const directionMatches = this.sprite.scale.x > 0 ? entity.pos.x - this.pos.x < 0 : entity.pos.x - this.pos.x > 0
        return directionMatches && this.pos.distance(entity.pos) < this.detectionRange
    }

    detectsTarget() {
        if (this.detectsEntity(this.plant)) return this.plant
        if (this.detectsEntity(this.player)) return this.player
        if (!this.pet.inStartPosition() && this.detectsEntity(this.pet)) return this.pet
        return false
    }

    onMoveChange(isMoving) {
        this.isMoving = isMoving
        this.changeTexture('anim_grandpa')
        this.sprite.animationSpeed = isMoving ? this.speed / 25 : 0
    }

    onCollision(entity, data) {
        super.onCollision(entity, data)
        if (this.pickupIntent && entity === this.pet) {
            this.onPickup(entity)
        }
    }

    onPickup(entity) {
        entity.obstacleEnabled = false
        this.holding = entity
        entity.heldBy = this
        this.speed = 2
    }

}