import Phaser from "phaser";

export class Bullet {
    sprite: Phaser.GameObjects.Rectangle
    speed = 500

    constructor(scene: Phaser.Scene, x: number, y: number){
        this.sprite = scene.add.rectangle(x, y, 6, 12, 0xfacc15)
    }

    update(delta: number) {
        this.sprite.y -= this.speed * (delta/ 1000)
    }

    isOffscreen() {
        return this.sprite.y < -20
    }

    destroy() {
        this.sprite.destroy()
    }
}