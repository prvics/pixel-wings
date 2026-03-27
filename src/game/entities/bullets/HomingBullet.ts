import Phaser from "phaser";
import { BaseBullet, type BulletConfig } from "./BaseBullet";
import type { Player } from "../Player";

export class HomingBullet extends BaseBullet {
    target: Player

    constructor(scene: Phaser.Scene, x: number, y: number, config: BulletConfig, target: Player){
        super(scene, x, y, config)
        this.target = target
    }

    update(delta: number) {
        const dx = this.target.sprite.x - this.sprite.x
        const dy = this.target.sprite.y - this.sprite.y

        const length = Math.sqrt(dx * dx + dy * dy)

        this.sprite.x += (dx/length) * this.config.speed * (delta / 1000)
        this.sprite.y += (dy/length) * this.config.speed * (delta / 1000)
    }
}