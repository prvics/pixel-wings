import Phaser from "phaser";
import { Bullet } from "./Bullet";

export class Player{
    scene: Phaser.Scene
    sprite: Phaser.GameObjects.Rectangle

    targetX: number
    targetY: number

    speed = 0.15

    bullets: Bullet[] = []
    shootCooldown = 200
    lastShot = 0

    constructor(scene: Phaser.Scene, x: number, y: number){
        this.scene = scene
                                                    //! coloring  0x inside code; in css -> # ; R = 38; G = bd; B = f8
        this.sprite = scene.add.rectangle(x, y, 30, 30, 0x38bdf8)

        this.targetX = x
        this.targetY = y

        this.setupInput()

        this.scene.time.addEvent({
            delay: this.shootCooldown,
            loop: true,
            callback: () => this.shoot()
        })
    }

    setupInput() {
        this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            this.targetX = pointer.x
            this.targetY = pointer.y
        })
    }

    update(delta: number) {
        const dx = this.targetX - this.sprite.x
        const dy = this.targetY - this.sprite.y

        this.sprite.x += dx * this.speed
        this.sprite.y += dy * this.speed

        this.bullets.forEach((b) => b.update(delta))

        this.bullets = this.bullets.filter((b) => {
            if (b.isOffscreen()){
                b.destroy()
                return false
            }
            return true
        })
    }

    shoot(){
        const bullet = new Bullet(
            this.scene,
            this.sprite.x,
            this.sprite.y - 20
        )

        this.bullets.push(bullet)
    }
}