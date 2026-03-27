import Phaser from "phaser"

export type BulletConfig = {
    speed: number
    damage: number
    velocityX?: number
    velocityY: number
    color: number
    width: number
    height: number
}

export class BaseBullet {
    sprite: Phaser.GameObjects.Rectangle
    config: BulletConfig

    constructor(scene: Phaser.Scene, x: number, y: number, config: BulletConfig){
        this.config = config

        this.sprite = scene.add.rectangle(
            x,
            y,
            config.width,
            config.height,
            config.color
        )
    }

    update(delta: number){
        this.sprite.x += (this.config.velocityX ?? 0) * this.config.speed * (delta / 1000)
        this.sprite.y += this.config.velocityY * this.config.speed * (delta / 1000)
    }

    isOffscreen(){
        return this.sprite.y < -50 || this.sprite.y > 900
    }

    destroy() {
        this.sprite.destroy()
    }
}