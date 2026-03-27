import Phaser from "phaser";
import { BaseBullet } from "./bullets/BaseBullet";
import { BulletPresets } from "./bullets/BulletPresets";

export class Player{
    scene: Phaser.Scene
    sprite: Phaser.GameObjects.Rectangle

    targetX: number
    targetY: number

    speed = 0.15

    hp = 3
    maxHp = 3
    isDead = false

    bullets: BaseBullet[] = []
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
        const bullet = new BaseBullet(
            this.scene,
            this.sprite.x,
            this.sprite.y - 20,
            BulletPresets.playerBasic
        )

        this.bullets.push(bullet)
    }

    takeHit(): boolean {
        this.hp--

        if (this.hp <= 0) {
            this.destroy()
            return true
        }

        return false
    }

    get x() {
        return this.sprite.x
    }
    get y() {
        return this.sprite.y
    }

    destroy() {
        this.sprite.destroy()
        this.bullets.forEach((bullet) => bullet.destroy())
    }
}