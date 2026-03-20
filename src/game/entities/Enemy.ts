import Phaser from "phaser";

export class Enemy {
    sprite: Phaser.GameObjects.Rectangle
    speed = 169

    constructor(scene: Phaser.Scene, x: number, y: number){
        this.sprite = scene.add.rectangle(x, y, 28, 28, 0xff4d4d)
    }

    update(delta: number){
        this.sprite.y += this.speed * (delta / 1000)
    }

    isOffscreen(height: number) {
        return this.sprite.y > height + 30
    }

    destroy(){
        this.sprite.destroy()
    }
}